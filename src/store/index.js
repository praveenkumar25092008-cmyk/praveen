import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import foodReducer from './foodSlice';
import authReducer from './authSlice';
import { cartMiddleware, notificationMiddleware } from './middleware';

// ==========================================
// EXPERIMENT 2a: Global store for food items and cart information
// EXPERIMENT 2e: Apply custom middleware
// ==========================================
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    food: foodReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(cartMiddleware, notificationMiddleware)
});

export default store;
