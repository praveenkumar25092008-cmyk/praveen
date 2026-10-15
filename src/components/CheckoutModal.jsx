import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder, clearOrderStatus } from '../store/authSlice';
import { clearCart, selectCartItems, selectCartTotal } from '../store/cartSlice';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Sparkles
} from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { user, isOrderLoading, orderSuccess, orderError } = useSelector((state) => state.auth);

  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield');
  const [phone, setPhone] = useState('+1 (555) 382-9102');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(clearOrderStatus());
    setOrderConfirmed(false);
    onClose();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const orderPayload = {
      items: cartItems,
      total: cartTotal,
      deliveryAddress: address,
      contactPhone: phone,
      paymentMethod
    };

    const action = await dispatch(placeOrder(orderPayload));
    if (placeOrder.fulfilled.match(action)) {
      dispatch(clearCart());
      setOrderConfirmed(true);
    }
  };

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div
        className="glass-panel"
        style={modalContainerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={iconBadgeStyle}>
              <Receipt size={18} color="#f97316" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                {orderConfirmed ? 'Order Confirmed!' : 'Protected Checkout'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Protected REST API: POST /api/orders (Experiment 4f)
              </span>
            </div>
          </div>
          <button style={closeButtonStyle} onClick={handleClose}>
            <X size={18} color="#94a3b8" />
          </button>
        </div>

        {/* Order Confirmed View */}
        {orderConfirmed && orderSuccess ? (
          <div style={confirmedContainerStyle}>
            <div style={successIconCircleStyle}>
              <CheckCircle2 size={46} color="#10b981" />
            </div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginTop: '14px' }}>
              Order Successfully Placed!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', maxWidth: '340px' }}>
              Your gourmet meals are being prepared. Axios successfully sent your Bearer token to the protected order API.
            </p>

            {/* Receipt Box */}
            <div style={receiptBoxStyle}>
              <div style={receiptRowStyle}>
                <span style={receiptLabelStyle}>Order ID:</span>
                <span style={{ ...receiptValueStyle, fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}>
                  {orderSuccess.orderId}
                </span>
              </div>
              <div style={receiptRowStyle}>
                <span style={receiptLabelStyle}>Customer:</span>
                <span style={receiptValueStyle}>{user?.name}</span>
              </div>
              <div style={receiptRowStyle}>
                <span style={receiptLabelStyle}>Items Count:</span>
                <span style={receiptValueStyle}>{orderSuccess.itemsCount} dishes</span>
              </div>
              <div style={receiptRowStyle}>
                <span style={receiptLabelStyle}>Estimated Arrival:</span>
                <span style={{ ...receiptValueStyle, color: '#34d399' }}>{orderSuccess.estimatedDelivery}</span>
              </div>
              <div style={receiptDividerStyle} />
              <div style={receiptRowStyle}>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>Total Paid:</span>
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff' }}>
                  ${Number(orderSuccess.total).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="btn-primary"
              style={{ padding: '12px 28px', marginTop: '16px' }}
            >
              <Sparkles size={16} /> Return to Menu
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} style={formStyle}>
            {/* Authenticated user badge */}
            <div style={userBadgeRowStyle}>
              <ShieldCheck size={16} color="#10b981" />
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                Ordering as <strong>{user?.name}</strong> ({user?.email})
              </span>
            </div>

            {/* Error Message */}
            {orderError && (
              <div style={errorStyle}>
                <AlertTriangle size={16} color="#ef4444" />
                <span style={{ fontSize: '0.82rem', color: '#fca5a5' }}>{orderError}</span>
              </div>
            )}

            {/* Delivery Details */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Delivery Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Contact Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Payment Method */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Payment Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <label
                  style={{
                    ...paymentOptionStyle,
                    borderColor: paymentMethod === 'card' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    background: paymentMethod === 'card' ? 'rgba(249, 115, 22, 0.12)' : 'rgba(255, 255, 255, 0.03)'
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    style={{ display: 'none' }}
                  />
                  <CreditCard size={18} color={paymentMethod === 'card' ? '#f97316' : '#94a3b8'} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Credit Card</span>
                </label>

                <label
                  style={{
                    ...paymentOptionStyle,
                    borderColor: paymentMethod === 'cod' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    background: paymentMethod === 'cod' ? 'rgba(249, 115, 22, 0.12)' : 'rgba(255, 255, 255, 0.03)'
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ display: 'none' }}
                  />
                  <Truck size={18} color={paymentMethod === 'cod' ? '#f97316' : '#94a3b8'} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cash on Delivery</span>
                </label>
              </div>
            </div>

            {/* Order Summary Recap */}
            <div style={recapBoxStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items in Cart:</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{cartItems.length} dishes</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.98rem', fontWeight: 700, marginTop: '6px' }}>
                <span style={{ color: '#ffffff' }}>Total to Charge:</span>
                <span style={{ color: 'var(--accent-secondary)', fontSize: '1.2rem' }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button type="button" onClick={handleClose} className="btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 2, padding: '12px' }}
                disabled={isOrderLoading || cartItems.length === 0}
                id="submit-order-btn"
              >
                {isOrderLoading ? (
                  <>
                    <div
                      className="animate-spin"
                      style={{ width: 16, height: 16, border: '2px solid rgba(255, 255, 255, 0.3)', borderTopColor: '#ffffff', borderRadius: '50%' }}
                    />
                    <span>Submitting Order (Bearer Token)...</span>
                  </>
                ) : (
                  <span>Confirm Order (${cartTotal.toFixed(2)})</span>
                )}
              </button>
            </div>
          </form>
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
  zIndex: 1200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};

const modalContainerStyle = {
  width: '100%',
  maxWidth: '500px',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--bg-secondary)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: 'var(--shadow-lg)',
  overflow: 'hidden'
};

const headerStyle = {
  padding: '18px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
};

const iconBadgeStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  background: 'rgba(249, 115, 22, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(249, 115, 22, 0.3)'
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

const userBadgeRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 14px',
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.25)',
  borderRadius: 'var(--radius-md)'
};

const errorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 14px',
  background: 'rgba(239, 68, 68, 0.15)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: 'var(--radius-md)'
};

const formStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const fieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--text-muted)'
};

const inputStyle = {
  background: 'var(--bg-input)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 14px',
  color: 'var(--text-main)',
  fontSize: '0.9rem',
  width: '100%'
};

const paymentOptionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '12px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid',
  cursor: 'pointer',
  transition: 'all 0.15s ease'
};

const recapBoxStyle = {
  padding: '12px 16px',
  background: 'rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: 'var(--radius-md)'
};

const confirmedContainerStyle = {
  padding: '36px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const successIconCircleStyle = {
  width: '74px',
  height: '74px',
  borderRadius: '50%',
  background: 'rgba(16, 185, 129, 0.15)',
  border: '2px solid rgba(16, 185, 129, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const receiptBoxStyle = {
  width: '100%',
  marginTop: '20px',
  padding: '16px 20px',
  background: 'rgba(0, 0, 0, 0.4)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const receiptRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.84rem'
};

const receiptLabelStyle = {
  color: 'var(--text-muted)'
};

const receiptValueStyle = {
  fontWeight: 600,
  color: '#f8fafc'
};

const receiptDividerStyle = {
  height: '1px',
  background: 'rgba(255, 255, 255, 0.08)',
  margin: '4px 0'
};
