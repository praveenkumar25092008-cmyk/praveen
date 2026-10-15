import { eventBus } from '../services/eventBus';

// ==========================================
// EXPERIMENT 2e: Custom Redux Middleware to monitor/process cart actions
// EXPERIMENT 2f: Synchronize cart data with browser storage
// ==========================================
export const cartMiddleware = (storeAPI) => (next) => (action) => {
  // Let the action pass through first to compute the next state
  const result = next(action);

  // If the dispatched action is a cart operation
  if (action.type && action.type.startsWith('cart/')) {
    const state = storeAPI.getState();
    const cartItems = state.cart.items;

    // 1. Synchronize cart with browser storage (Exp 2f)
    try {
      localStorage.setItem('gourmet_cart_v1', JSON.stringify(cartItems));
    } catch (err) {
      console.error('[Cart Middleware] Failed to save cart to localStorage:', err);
    }

    // 2. Broadcast intercepted action to live UI Monitor (Exp 2e)
    eventBus.emit('redux:cart_action', {
      id: Date.now() + Math.random(),
      type: action.type,
      payload: action.payload,
      timestamp: new Date().toLocaleTimeString(),
      totalUnits: cartItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0),
      itemsCount: cartItems.length
    });
  }

  return result;
};

// Notification and toast dispatcher middleware
export const notificationMiddleware = () => (next) => (action) => {
  const result = next(action);

  // Automatically trigger toasts for common action outcomes
  if (action.type?.endsWith('/fulfilled')) {
    if (action.type.includes('createFood')) {
      eventBus.emit('toast', { type: 'success', message: '✨ Food item added to menu!' });
    } else if (action.type.includes('updateFood')) {
      eventBus.emit('toast', { type: 'success', message: '✏️ Food item updated successfully!' });
    } else if (action.type.includes('deleteFood')) {
      eventBus.emit('toast', { type: 'info', message: '🗑️ Food item removed from menu.' });
    } else if (action.type.includes('loginUser')) {
      eventBus.emit('toast', { type: 'success', message: `👋 Welcome back, ${action.payload?.user?.name || 'User'}!` });
    } else if (action.type.includes('placeOrder')) {
      eventBus.emit('toast', { type: 'success', message: `🎉 Order placed! ID: ${action.payload?.orderId}` });
    } else if (action.type.includes('resetDatabase')) {
      eventBus.emit('toast', { type: 'info', message: '🔄 Menu reset to default seed items.' });
    }
  } else if (action.type?.endsWith('/rejected')) {
    const errorMsg = action.payload || 'Operation failed';
    eventBus.emit('toast', { type: 'error', message: `❌ ${errorMsg}` });
  }

  return result;
};
