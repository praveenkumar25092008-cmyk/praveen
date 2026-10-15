import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount, selectCartSubtotal } from '../store/cartSlice';
import { logout } from '../store/authSlice';
import { resetDatabase } from '../store/foodSlice';
import {
  UtensilsCrossed,
  ShoppingCart,
  User,
  LogOut,
  Activity,
  RotateCcw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenCart,
  onOpenLogin,
  onToggleInspector,
  inspectorOpen,
  networkCount
}) {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const cartSubtotal = useSelector(selectCartSubtotal);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleResetDB = () => {
    if (window.confirm('Reset food menu database back to default seed items?')) {
      dispatch(resetDatabase());
    }
  };

  return (
    <header className="glass-panel" style={navHeaderStyle}>
      <div style={navInnerStyle}>
        {/* Brand / Logo */}
        <div style={brandContainerStyle} onClick={() => setActiveTab('all')}>
          <div style={logoIconWrapperStyle}>
            <UtensilsCrossed size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={brandTitleStyle}>Foodie</span>
              <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                Lab Suite
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
              Experiments 1 — 4 Architecture
            </div>
          </div>
        </div>

        {/* Experiment Tab Navigation */}
        <nav style={tabsNavStyle} role="tablist" aria-label="Laboratory Experiments Navigation">
          <button
            role="tab"
            aria-selected={activeTab === 'all'}
            style={activeTab === 'all' ? activeTabStyle : tabButtonStyle}
            onClick={() => setActiveTab('all')}
            title="Complete Integrated Storefront"
          >
            <Sparkles size={15} aria-hidden="true" />
            <span>Storefront</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'test'}
            style={activeTab === 'test' ? activeTabStyle : tabButtonStyle}
            onClick={() => setActiveTab('test')}
            title="Experiment 1: Component Testing with Jest and React Testing Library"
          >
            <span style={pillNumberStyle}>1</span>
            <span>Component Tests</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'perf'}
            style={activeTab === 'perf' ? activeTabStyle : tabButtonStyle}
            onClick={() => setActiveTab('perf')}
            title="Experiment 2: Performance, Lazy Loading, PWA, Accessibility & Security"
          >
            <span style={pillNumberStyle}>2</span>
            <span>Perf & PWA</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'crud'}
            style={activeTab === 'crud' ? activeTabStyle : tabButtonStyle}
            onClick={() => setActiveTab('crud')}
            title="CRUD Operations (GET, POST, PUT, DELETE) via REST APIs"
          >
            <span style={pillNumberStyle}>3</span>
            <span>CRUD Admin</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'auth'}
            style={activeTab === 'auth' ? activeTabStyle : tabButtonStyle}
            onClick={() => setActiveTab('auth')}
            title="Authentication, Tokens, Protected APIs, Axios Interceptors"
          >
            <span style={pillNumberStyle}>4</span>
            <span>Auth & Tokens</span>
          </button>
        </nav>

        {/* Right Actions: Monitor, Reset, Cart, Auth */}
        <div style={rightActionsStyle}>
          {/* Live Inspector Toggle */}
          <button
            onClick={onToggleInspector}
            style={{
              ...iconActionStyle,
              background: inspectorOpen ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              borderColor: inspectorOpen ? 'var(--accent-primary)' : 'var(--border-subtle)'
            }}
            title="Open Live Axios & Redux Inspector"
          >
            <Activity size={17} color={inspectorOpen ? '#f97316' : '#94a3b8'} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: inspectorOpen ? '#f97316' : '#cbd5e1' }}>
              Live Log
            </span>
            {networkCount > 0 && (
              <span style={pulseDotStyle} />
            )}
          </button>

          {/* Reset Seed Database */}
          <button
            onClick={handleResetDB}
            style={iconOnlyButtonStyle}
            title="Reset menu database to default seed items"
          >
            <RotateCcw size={16} color="#94a3b8" />
          </button>

          {/* Cart Button with Derived Badge */}
          <button onClick={onOpenCart} style={cartTriggerButtonStyle} id="cart-button">
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={19} color="#ffffff" />
              {cartCount > 0 && (
                <span style={cartBadgeStyle}>{cartCount}</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', fontWeight: 600 }}>
                Cart
              </span>
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
                ${cartSubtotal.toFixed(2)}
              </span>
            </div>
          </button>

          {/* Authentication State */}
          {isAuthenticated && user ? (
            <div style={userBadgeContainerStyle}>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={user.name}
                style={userAvatarStyle}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.68rem', color: user.role === 'admin' ? '#fbbf24' : '#34d399', display: 'flex', alignItems: 'center', gap: 3 }}>
                  {user.role === 'admin' && <ShieldCheck size={11} />}
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => dispatch(logout())}
                style={logoutButtonStyle}
                title="Log out and remove authentication token (Exp 4e)"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              id="login-button"
            >
              <User size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

const navHeaderStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  borderBottom: '1px solid var(--border-subtle)',
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  borderRadius: 0
};

const navInnerStyle = {
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '12px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  flexWrap: 'wrap'
};

const brandContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer'
};

const logoIconWrapperStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  background: 'var(--accent-gradient)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)'
};

const brandTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  background: 'linear-gradient(135deg, #ffffff 40%, #fdba74 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const tabsNavStyle = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(0, 0, 0, 0.3)',
  padding: '4px',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-subtle)',
  gap: '4px'
};

const tabButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '7px 13px',
  borderRadius: 'var(--radius-md)',
  fontSize: '0.82rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  transition: 'all var(--transition-fast)'
};

const activeTabStyle = {
  ...tabButtonStyle,
  background: 'var(--accent-gradient)',
  color: '#ffffff',
  boxShadow: '0 2px 10px rgba(249, 115, 22, 0.3)'
};

const pillNumberStyle = {
  width: '17px',
  height: '17px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.2)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.68rem',
  fontWeight: 700
};

const rightActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const iconActionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '7px 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid',
  cursor: 'pointer',
  position: 'relative'
};

const iconOnlyButtonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-subtle)',
  cursor: 'pointer'
};

const cartTriggerButtonStyle = {
  background: 'var(--accent-gradient)',
  border: 'none',
  padding: '7px 14px',
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)',
  transition: 'transform var(--transition-fast)'
};

const cartBadgeStyle = {
  position: 'absolute',
  top: '-7px',
  right: '-9px',
  background: '#111827',
  color: '#fbbf24',
  fontSize: '0.7rem',
  fontWeight: 800,
  minWidth: '18px',
  height: '18px',
  borderRadius: '9px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid #f97316',
  padding: '0 3px'
};

const pulseDotStyle = {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  background: '#10b981',
  boxShadow: '0 0 8px #10b981'
};

const userBadgeContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '5px 10px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)'
};

const userAvatarStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '1px solid rgba(255, 255, 255, 0.2)'
};

const logoutButtonStyle = {
  color: '#94a3b8',
  padding: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
};
