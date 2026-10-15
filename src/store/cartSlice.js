import { createSlice, createSelector } from '@reduxjs/toolkit';

// EXPERIMENT 2f: Synchronize cart data with browser storage
const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem('gourmet_cart_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load initial cart from storage:', err);
  }
  return [];
};

const initialState = {
  items: loadCartFromStorage(),
  isLoading: false,
  lastAction: null
};

// ==========================================
// EXPERIMENT 2c: Redux Toolkit Cart Slice
// EXPERIMENT 2b: Cart operations
// ==========================================
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // b) addToCart()
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      const qtyToAdd = item.quantity || 1;

      if (existing) {
        existing.quantity += qtyToAdd;
      } else {
        state.items.push({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          image: item.image,
          category: item.category,
          quantity: qtyToAdd
        });
      }
      state.lastAction = `Added "${item.name}" (qty: ${qtyToAdd})`;
    },

    // b) removeFromCart()
    removeFromCart: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      state.items = state.items.filter((i) => i.id !== id);
      state.lastAction = item ? `Removed "${item.name}"` : `Removed item ${id}`;
    },

    // b) updateQuantity()
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
        state.lastAction = `Removed item #${id} (quantity reached 0)`;
      } else {
        const item = state.items.find((i) => i.id === id);
        if (item) {
          item.quantity = quantity;
          state.lastAction = `Updated "${item.name}" quantity to ${quantity}`;
        }
      }
    },

    // b) clearCart()
    clearCart: (state) => {
      state.items = [];
      state.lastAction = 'Cleared all items from cart';
    },

    // Synchronize / hydrate
    hydrateCart: (state, action) => {
      state.items = action.payload || [];
      state.lastAction = 'Hydrated cart from storage';
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  hydrateCart
} = cartSlice.actions;

// ==========================================
// EXPERIMENT 2d: Derived State Calculations
// Calculate cart subtotal, tax, and total amount
// ==========================================
export const selectCartItems = (state) => state.cart.items;
export const selectCartLastAction = (state) => state.cart.lastAction;

// Total count of physical items in cart
export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + (item.quantity || 0), 0)
);

// Cart Subtotal
export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  Number(
    items
      .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
      .toFixed(2)
  )
);

// Tax (5% Standard Food & Beverage Tax)
export const selectCartTax = createSelector([selectCartSubtotal], (subtotal) =>
  Number((subtotal * 0.05).toFixed(2))
);

// Delivery fee: $3.99, free for orders above $35, $0 if cart is empty
export const selectCartDeliveryFee = createSelector([selectCartSubtotal], (subtotal) => {
  if (subtotal === 0) return 0;
  return subtotal >= 35 ? 0 : 3.99;
});

// Final Total = Subtotal + Tax + DeliveryFee
export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectCartTax, selectCartDeliveryFee],
  (subtotal, tax, delivery) => Number((subtotal + tax + delivery).toFixed(2))
);

export default cartSlice.reducer;
