import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods, fetchFoodDetails, clearSelectedFood } from './store/foodSlice';
import { addToCart } from './store/cartSlice';
import { eventBus } from './services/eventBus';
import { registerServiceWorker } from './serviceWorkerRegistration';

// Direct static imports for critical shell UI
import Navbar from './components/Navbar';
import ExperimentBanner from './components/ExperimentBanner';
import StorefrontView from './components/StorefrontView';
import CartDrawer from './components/CartDrawer';
import LoginModal from './components/LoginModal';
import LiveInspector from './components/LiveInspector';
import ToastContainer from './components/ToastContainer';

// ==========================================
// EXPERIMENT 2a, 2b: Code Splitting & Lazy Loading using dynamic imports
// ==========================================
const FoodDetailModal = lazy(() => import('./components/FoodDetailModal'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const CrudPanel = lazy(() => import('./components/CrudPanel'));
const AuthLabView = lazy(() => import('./components/AuthLabView'));
const TestRunnerView = lazy(() => import('./components/TestRunnerView'));
const PerformanceAuditView = lazy(() => import('./components/PerformanceAuditView'));

// Accessible Fallback Spinner for Suspense
function LoadingFallback({ message = 'Loading component...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}
    >
      <div
        className="animate-spin"
        style={{
          width: '36px',
          height: '36px',
          border: '3px solid rgba(249, 115, 22, 0.2)',
          borderTopColor: 'var(--accent-primary)',
          borderRadius: '50%'
        }}
      />
      <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{message}</span>
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const selectedFood = useSelector((state) => state.food.selectedFood);

  // Active Experiment Tab: 'all' | 'test' | 'perf' | 'crud' | 'auth'
  const [activeTab, setActiveTab] = useState('all');

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [networkCount, setNetworkCount] = useState(0);

  // ==========================================
  // EXPERIMENT 2d: Initialize Progressive Web Application Service Worker
  // ==========================================
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Initial Food Menu Fetch on Mount (Exp 1b)
  useEffect(() => {
    dispatch(fetchFoods({ search: '', category: 'All' }));
  }, [dispatch]);

  // Global Event Subscriptions for Interceptors and Auth
  useEffect(() => {
    const unsubUnauth = eventBus.on('auth:unauthorized', (data) => {
      setLoginPrompt(data.message || 'Session expired. Please log in again.');
      setIsLoginOpen(true);
      eventBus.emit('toast', {
        type: 'warning',
        message: '⚠️ 401 Unauthorized: Session expired or invalid token.'
      });
    });

    const unsubNet = eventBus.on('network:request', () => {
      setNetworkCount((c) => c + 1);
    });

    return () => {
      unsubUnauth();
      unsubNet();
    };
  }, []);

  // ==========================================
  // EXPERIMENT 2e: Keyboard Accessibility Navigation (Esc closes modals)
  // ==========================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsLoginOpen(false);
        setIsCheckoutOpen(false);
        setIsInspectorOpen(false);
        if (selectedFood) {
          dispatch(clearSelectedFood());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFood, dispatch]);

  // Memoized handlers using useCallback to prevent unnecessary re-renders (Exp 2c)
  const handleOpenLogin = useCallback((prompt = '') => {
    setLoginPrompt(prompt);
    setIsLoginOpen(true);
  }, []);

  const handleSelectDetails = useCallback((foodId) => {
    dispatch(fetchFoodDetails(foodId));
  }, [dispatch]);

  const handleProceedToCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);

  const handleAddToCart = useCallback((item) => {
    dispatch(addToCart(item));
  }, [dispatch]);

  return (
    <div style={appContainerStyle}>
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLogin={() => handleOpenLogin()}
        onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
        inspectorOpen={isInspectorOpen}
        networkCount={networkCount}
      />

      {/* Main Landmark Area */}
      <main id="main-content" style={mainContentStyle} role="main" tabIndex={-1}>
        {/* Dynamic Experiment Objectives Banner */}
        <ExperimentBanner activeTab={activeTab} onSwitchTab={setActiveTab} />

        {/* View Switcher with Code Splitting & Suspense */}
        <Suspense fallback={<LoadingFallback message="Loading view module..." />}>
          {activeTab === 'all' && (
            <StorefrontView
              onSelectDetails={handleSelectDetails}
              onAddToCart={handleAddToCart}
              showAdminActions={false}
            />
          )}

          {activeTab === 'test' && (
            <TestRunnerView />
          )}

          {activeTab === 'perf' && (
            <PerformanceAuditView />
          )}

          {activeTab === 'crud' && (
            <CrudPanel onOpenLogin={handleOpenLogin} />
          )}

          {activeTab === 'auth' && (
            <AuthLabView onOpenLogin={handleOpenLogin} />
          )}
        </Suspense>
      </main>

      {/* Modals and Drawers with Lazy Loading */}
      <Suspense fallback={null}>
        {selectedFood && <FoodDetailModal />}

        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />
        )}
      </Suspense>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleProceedToCheckout}
        onOpenLogin={handleOpenLogin}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setLoginPrompt('');
        }}
        promptMessage={loginPrompt}
      />

      <LiveInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />

      {/* Accessible Footer */}
      <footer style={footerStyle} role="contentinfo">
        <div style={footerInnerStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
              Foodie | Food Ordering Web Application
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Component Testing (Jest & RTL), Performance Optimization, PWA, Accessibility & Security Suite.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setIsInspectorOpen(true)}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              aria-label="Open live architecture inspector"
            >
              Open Live Inspector
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

const appContainerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
};

const mainContentStyle = {
  flex: 1,
  maxWidth: '1440px',
  width: '100%',
  margin: '0 auto',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  outline: 'none'
};

const footerStyle = {
  marginTop: '40px',
  borderTop: '1px solid var(--border-subtle)',
  background: 'rgba(11, 15, 25, 0.8)',
  backdropFilter: 'blur(10px)'
};

const footerInnerStyle = {
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '16px'
};
