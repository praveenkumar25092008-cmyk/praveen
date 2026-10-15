import { eventBus } from './services/eventBus';

// ==========================================
// EXPERIMENT 2d: Register Service Worker for PWA
// ==========================================
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration.scope);
          eventBus.emit('pwa:ready', { scope: registration.scope });
        })
        .catch((error) => {
          console.warn('[PWA] Service Worker registration failed:', error);
        });
    });

    // Detect Online / Offline connectivity changes
    window.addEventListener('online', () => {
      eventBus.emit('toast', { type: 'success', message: '🌐 Network connected! You are back online.' });
      eventBus.emit('network:status', { online: true });
    });

    window.addEventListener('offline', () => {
      eventBus.emit('toast', { type: 'warning', message: '⚠️ You are currently offline. Cached menu is available.' });
      eventBus.emit('network:status', { online: false });
    });
  }
}
