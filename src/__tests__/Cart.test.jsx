import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  removeFromCart,
  updateQuantity,
  clearCart
} from '../store/cartSlice';
import authReducer from '../store/authSlice';
import CartDrawer from '../components/CartDrawer';

// Helper to render component with Redux store
function renderWithRedux(
  ui,
  {
    initialState = {},
    store = configureStore({
      reducer: { cart: cartReducer, auth: authReducer },
      preloadedState: initialState
    })
  } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
}

describe('Cart Component & State Management Testing', () => {
  it('renders appropriate empty cart state when cart has no items', () => {
    renderWithRedux(
      <CartDrawer isOpen={true} onClose={jest.fn()} />,
      {
        initialState: {
          cart: { items: [], isLoading: false },
          auth: { isAuthenticated: false }
        }
      }
    );

    // Empty cart state verification (Exp 2g)
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Menu/i)).toBeInTheDocument();
  });

  it('renders cart items, quantities, and calculates derived totals accurately', () => {
    const mockCartItems = [
      {
        id: 'food-1',
        name: 'Artisan Truffle Burger',
        price: 16.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1'
      },
      {
        id: 'food-2',
        name: 'Spicy Tonkotsu Ramen',
        price: 15.5,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-2'
      }
    ];

    renderWithRedux(
      <CartDrawer isOpen={true} onClose={jest.fn()} />,
      {
        initialState: {
          cart: { items: mockCartItems, isLoading: false },
          auth: { isAuthenticated: false }
        }
      }
    );

    // Verify item names
    expect(screen.getByText('Artisan Truffle Burger')).toBeInTheDocument();
    expect(screen.getByText('Spicy Tonkotsu Ramen')).toBeInTheDocument();

    // Verify derived calculations:
    // Subtotal: 16.99 * 2 + 15.50 * 1 = 33.98 + 15.50 = 49.48
    // Tax: 49.48 * 0.05 = 2.47
    // Delivery: Subtotal >= 35 -> FREE
    // Total: 49.48 + 2.47 = 51.95
    expect(screen.getByText('$49.48')).toBeInTheDocument(); // Subtotal
    expect(screen.getByText('$2.47')).toBeInTheDocument(); // Tax
    expect(screen.getByText('FREE')).toBeInTheDocument(); // Delivery Fee
    expect(screen.getByText('$51.95')).toBeInTheDocument(); // Total Amount
  });

  it('handles item quantity increment and decrement actions', () => {
    const { store } = renderWithRedux(
      <CartDrawer isOpen={true} onClose={jest.fn()} />,
      {
        initialState: {
          cart: {
            items: [
              {
                id: 'food-1',
                name: 'Artisan Truffle Burger',
                price: 16.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1'
              }
            ],
            isLoading: false
          },
          auth: { isAuthenticated: false }
        }
      }
    );

    // Increase quantity via action
    act(() => {
      store.dispatch(updateQuantity({ id: 'food-1', quantity: 2 }));
    });
    expect(store.getState().cart.items[0].quantity).toBe(2);

    // Decrease quantity
    act(() => {
      store.dispatch(updateQuantity({ id: 'food-1', quantity: 1 }));
    });
    expect(store.getState().cart.items[0].quantity).toBe(1);
  });

  it('handles remove-from-cart and clearCart actions', () => {
    const { store } = renderWithRedux(
      <CartDrawer isOpen={true} onClose={jest.fn()} />,
      {
        initialState: {
          cart: {
            items: [
              { id: 'food-1', name: 'Artisan Truffle Burger', price: 16.99, quantity: 1, image: '' },
              { id: 'food-2', name: 'Spicy Tonkotsu Ramen', price: 15.5, quantity: 1, image: '' }
            ],
            isLoading: false
          },
          auth: { isAuthenticated: false }
        }
      }
    );

    expect(store.getState().cart.items).toHaveLength(2);

    // Remove single item (removeFromCart action)
    act(() => {
      store.dispatch(removeFromCart('food-1'));
    });
    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0].id).toBe('food-2');

    // Clear cart (clearCart action)
    act(() => {
      store.dispatch(clearCart());
    });
    expect(store.getState().cart.items).toHaveLength(0);
  });
});
