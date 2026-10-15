import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTax,
  selectCartDeliveryFee,
  selectCartTotal,
  selectCartCount,
  removeFromCart,
  updateQuantity,
  clearCart
} from '../store/cartSlice';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Lock
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  onProceedToCheckout,
  onOpenLogin
}) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalUnits = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);
  const tax = useSelector(selectCartTax);
  const deliveryFee = useSelector(selectCartDeliveryFee);
  const total = useSelector(selectCartTotal);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isOpen) return null;

  const freeDeliveryThreshold = 35;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      onOpenLogin('Please sign in to place an order and checkout (Experiment 4 requirement).');
    } else {
      onProceedToCheckout();
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        className="glass-panel"
        style={drawerContainerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={drawerHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={cartIconCircleStyle}>
              <ShoppingBag size={18} color="#f97316" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                Your Food Cart
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {totalUnits} {totalUnits === 1 ? 'item' : 'items'} in order
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cartItems.length > 0 && (
              <button
                onClick={() => dispatch(clearCart())}
                style={clearCartButtonStyle}
                title="Clear all items (clearCart action)"
              >
                Clear All
              </button>
            )}
            <button style={closeButtonStyle} onClick={onClose}>
              <X size={20} color="#94a3b8" />
            </button>
          </div>
        </div>

        {/* Free Delivery Incentive Progress */}
        {cartItems.length > 0 && (
          <div style={deliveryBannerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: remainingForFreeDelivery === 0 ? '#34d399' : '#fbbf24' }}>
                <Truck size={14} />
                {remainingForFreeDelivery === 0
                  ? '🎉 Free delivery unlocked!'
                  : `Add $${remainingForFreeDelivery.toFixed(2)} more for FREE delivery`}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>Threshold: $35.00</span>
            </div>
            <div style={progressBarTrackStyle}>
              <div
                style={{
                  ...progressBarFillStyle,
                  width: `${freeDeliveryProgress}%`,
                  background: remainingForFreeDelivery === 0 ? 'var(--color-success)' : 'var(--accent-gradient)'
                }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div style={itemsListContainerStyle}>
          {cartItems.length === 0 ? (
            /* Empty Cart State (Exp 2g) */
            <div style={emptyStateStyle}>
              <div style={emptyIconCircleStyle}>
                <ShoppingBag size={48} color="#64748b" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginTop: '12px' }}>
                Your cart is empty
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '280px' }}>
                Looks like you haven't added any appetizing meals yet. Explore our chef-crafted menu!
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
                style={{ marginTop: '16px', padding: '10px 20px' }}
              >
                <Sparkles size={16} /> Explore Menu
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} style={cartItemRowStyle}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={itemThumbStyle}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={itemTitleStyle} title={item.name}>
                      {item.name}
                    </h4>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      style={removeButtonStyle}
                      title="Remove from cart (removeFromCart action)"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    ${Number(item.price).toFixed(2)} each
                  </div>

                  {/* Quantity Controller & Subtotal */}
                  <div style={itemActionRowStyle}>
                    <div style={qtyButtonGroupStyle}>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                        style={qtySmallButtonStyle}
                        title="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span style={qtyValueStyle}>{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                        style={qtySmallButtonStyle}
                        title="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <span style={itemLineTotalStyle}>
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Order Summary & Checkout (Exp 2d Derived State) */}
        {cartItems.length > 0 && (
          <div style={drawerFooterStyle}>
            {/* Calculation Breakdown */}
            <div style={summaryBreakdownStyle}>
              <div style={summaryRowStyle}>
                <span style={summaryLabelStyle}>Subtotal</span>
                <span style={summaryValueStyle}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={summaryRowStyle}>
                <span style={summaryLabelStyle}>Estimated Tax (5%)</span>
                <span style={summaryValueStyle}>${tax.toFixed(2)}</span>
              </div>
              <div style={summaryRowStyle}>
                <span style={summaryLabelStyle}>Delivery Fee</span>
                <span style={summaryValueStyle}>
                  {deliveryFee === 0 ? (
                    <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div style={totalDividerStyle} />
              <div style={{ ...summaryRowStyle, marginTop: '4px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Total Amount</span>
                <span style={finalTotalValueStyle}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckoutClick}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.96rem' }}
              id="proceed-checkout-btn"
            >
              {!isAuthenticated ? (
                <>
                  <Lock size={17} /> Sign In to Checkout (${total.toFixed(2)})
                </>
              ) : (
                <>
                  <span>Checkout Now</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <div style={secureNoticeStyle}>
              <ShieldCheck size={13} color="#10b981" />
              <span>State synchronized with browser localStorage</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  zIndex: 1100,
  display: 'flex',
  justifyContent: 'flex-end'
};

const drawerContainerStyle = {
  width: '100%',
  maxWidth: '460px',
  height: '100%',
  background: 'var(--bg-secondary)',
  borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  animation: 'fadeIn 0.25s ease-out'
};

const drawerHeaderStyle = {
  padding: '18px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
};

const cartIconCircleStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  background: 'rgba(249, 115, 22, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(249, 115, 22, 0.3)'
};

const clearCartButtonStyle = {
  fontSize: '0.78rem',
  color: '#f87171',
  background: 'rgba(239, 68, 68, 0.1)',
  padding: '5px 10px',
  borderRadius: '6px',
  cursor: 'pointer'
};

const closeButtonStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.05)',
  cursor: 'pointer'
};

const deliveryBannerStyle = {
  padding: '10px 20px',
  background: 'rgba(0, 0, 0, 0.25)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const progressBarTrackStyle = {
  width: '100%',
  height: '6px',
  background: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '999px',
  overflow: 'hidden'
};

const progressBarFillStyle = {
  height: '100%',
  borderRadius: '999px',
  transition: 'width 0.4s ease'
};

const itemsListContainerStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const emptyStateStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px'
};

const emptyIconCircleStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.04)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px dashed rgba(255, 255, 255, 0.15)'
};

const cartItemRowStyle = {
  display: 'flex',
  gap: '12px',
  padding: '12px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: 'var(--radius-md)'
};

const itemThumbStyle = {
  width: '68px',
  height: '68px',
  borderRadius: '8px',
  objectFit: 'cover',
  flexShrink: 0,
  border: '1px solid rgba(255, 255, 255, 0.1)'
};

const itemTitleStyle = {
  fontSize: '0.92rem',
  fontWeight: 700,
  color: '#ffffff',
  margin: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const removeButtonStyle = {
  color: '#94a3b8',
  padding: '2px',
  cursor: 'pointer'
};

const itemActionRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '8px'
};

const qtyButtonGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  background: 'rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '6px',
  padding: '2px'
};

const qtySmallButtonStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  background: 'rgba(255, 255, 255, 0.06)',
  cursor: 'pointer'
};

const qtyValueStyle = {
  width: '24px',
  textAlign: 'center',
  fontSize: '0.84rem',
  fontWeight: 700
};

const itemLineTotalStyle = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#ffffff'
};

const drawerFooterStyle = {
  padding: '18px 20px',
  background: 'rgba(15, 23, 42, 0.95)',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const summaryBreakdownStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const summaryLabelStyle = {
  fontSize: '0.86rem',
  color: 'var(--text-muted)'
};

const summaryValueStyle = {
  fontSize: '0.88rem',
  fontWeight: 600,
  color: '#f8fafc'
};

const totalDividerStyle = {
  height: '1px',
  background: 'rgba(255, 255, 255, 0.08)',
  margin: '4px 0'
};

const finalTotalValueStyle = {
  fontSize: '1.35rem',
  fontWeight: 800,
  fontFamily: 'var(--font-heading)',
  color: 'var(--accent-secondary)'
};

const secureNoticeStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontSize: '0.74rem',
  color: 'var(--text-dim)'
};
