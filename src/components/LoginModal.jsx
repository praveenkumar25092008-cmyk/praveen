import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../store/authSlice';
import {
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose, promptMessage }) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('admin@foodie.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(clearAuthError());
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      handleClose();
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    dispatch(clearAuthError());
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
              <KeyRound size={20} color="#f97316" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                Sign In / Authentication
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Experiment 4: Token Management & Protected API
              </span>
            </div>
          </div>
          <button style={closeButtonStyle} onClick={handleClose}>
            <X size={18} color="#94a3b8" />
          </button>
        </div>

        {/* Prompt message if triggered by protected action (e.g. checkout or CRUD) */}
        {promptMessage && (
          <div style={promptNoticeStyle}>
            <Lock size={15} color="#fbbf24" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: '#fef08a' }}>{promptMessage}</span>
          </div>
        )}

        {/* Error message from API (Exp 4h) */}
        {error && (
          <div style={errorNoticeStyle}>
            <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: '#fca5a5' }}>{error}</span>
          </div>
        )}

        {/* Quick Demo Credentials */}
        <div style={demoCredentialsBoxStyle}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Demo Accounts (1-Click Fill):
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@foodie.com', 'admin123')}
              style={demoAccountButtonStyle}
              title="Fill Admin Credentials"
            >
              <ShieldCheck size={14} color="#f59e0b" />
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>Chef Antoine</div>
                <div style={{ fontSize: '0.68rem', color: '#fbbf24' }}>Admin (Full CRUD)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('user@foodie.com', 'user123')}
              style={demoAccountButtonStyle}
              title="Fill Customer Credentials"
            >
              <UserCheck size={14} color="#34d399" />
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>Sarah Jenkins</div>
                <div style={{ fontSize: '0.68rem', color: '#34d399' }}>Customer (Ordering)</div>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Email */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{ ...inputStyle, paddingLeft: '36px' }}
                id="login-email-input"
              />
            </div>
          </div>

          {/* Password */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ ...inputStyle, paddingLeft: '36px', paddingRight: '36px' }}
                id="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeButtonStyle}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
              </button>
            </div>
          </div>

          {/* Educational Note */}
          <div style={eduBadgeStyle}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              On successful login, the REST API returns a JWT token which is stored in <code style={codeTagStyle}>localStorage</code> and automatically attached to requests by the Axios Request Interceptor.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.94rem', marginTop: '6px' }}
            disabled={isLoading}
            id="login-submit-btn"
          >
            {isLoading ? (
              <>
                <div
                  className="animate-spin"
                  style={{ width: 16, height: 16, border: '2px solid rgba(255, 255, 255, 0.3)', borderTopColor: '#ffffff', borderRadius: '50%' }}
                />
                <span>Authenticating with REST API...</span>
              </>
            ) : (
              <span>Sign In & Generate Token</span>
            )}
          </button>
        </form>
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
  maxWidth: '440px',
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

const promptNoticeStyle = {
  padding: '10px 18px',
  background: 'rgba(245, 158, 11, 0.12)',
  borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const errorNoticeStyle = {
  padding: '10px 18px',
  background: 'rgba(239, 68, 68, 0.15)',
  borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const demoCredentialsBoxStyle = {
  padding: '14px 20px',
  background: 'rgba(0, 0, 0, 0.25)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
};

const demoAccountButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 10px',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  cursor: 'pointer',
  transition: 'all 0.15s ease'
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

const eyeButtonStyle = {
  position: 'absolute',
  right: 12,
  top: 10,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
};

const eduBadgeStyle = {
  padding: '8px 10px',
  borderRadius: '6px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)'
};

const codeTagStyle = {
  fontFamily: 'var(--font-mono)',
  color: '#fb923c',
  fontSize: '0.72rem'
};
