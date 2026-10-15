import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  logout,
  simulateExpiredToken
} from '../store/authSlice';
import { apiClient } from '../services/api';
import {
  ShieldCheck,
  ShieldAlert,
  LogOut,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Send,
  Lock,
  Unlock,
  UserCheck,
  FileText
} from 'lucide-react';

export default function AuthLabView({ onOpenLogin }) {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  // Test calling a protected endpoint (GET /api/auth/me)
  const handleTestProtectedMe = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const response = await apiClient.get('/auth/me');
      setTestResult({
        status: response.status,
        success: true,
        endpoint: 'GET /api/auth/me',
        data: response.data,
        message: 'Request authorized successfully with Bearer token!'
      });
    } catch (err) {
      setTestResult({
        status: err.response?.status || 500,
        success: false,
        endpoint: 'GET /api/auth/me',
        data: err.response?.data,
        message: err.response?.data?.message || err.message
      });
    } finally {
      setTestLoading(false);
    }
  };

  // Test calling protected order endpoint (POST /api/orders)
  const handleTestProtectedOrder = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const response = await apiClient.post('/orders', {
        items: [{ id: 'test-dish', name: 'Truffle Pasta', price: 18.5, quantity: 1 }],
        total: 18.5
      });
      setTestResult({
        status: response.status,
        success: true,
        endpoint: 'POST /api/orders',
        data: response.data,
        message: 'Order created successfully under authenticated user account!'
      });
    } catch (err) {
      setTestResult({
        status: err.response?.status || 500,
        success: false,
        endpoint: 'POST /api/orders',
        data: err.response?.data,
        message: err.response?.data?.message || err.message
      });
    } finally {
      setTestLoading(false);
    }
  };

  // Test simulating expired token (Exp 4g)
  const handleTestExpiredToken = async () => {
    setTestLoading(true);
    setTestResult(null);
    // 1. Invalidate token
    dispatch(simulateExpiredToken());
    try {
      // 2. Call protected API to watch Axios Response Interceptor catch 401
      await apiClient.get('/auth/me');
    } catch (err) {
      setTestResult({
        status: 401,
        success: false,
        endpoint: 'GET /api/auth/me (Expired Token Test)',
        data: err.response?.data,
        message: 'Axios Response Interceptor caught 401 Unauthorized! Token was invalidated.'
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Current Session State Card */}
      <div className="glass-panel" style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                ...statusCircleStyle,
                background: isAuthenticated ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                borderColor: isAuthenticated ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'
              }}
            >
              {isAuthenticated ? <Unlock size={22} color="#10b981" /> : <Lock size={22} color="#ef4444" />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                  Authentication State: {isAuthenticated ? 'Authenticated' : 'Anonymous / Not Logged In'}
                </h3>
                <span className={isAuthenticated ? 'badge badge-success' : 'badge badge-danger'}>
                  {isAuthenticated ? 'Session Active' : 'No Token'}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                {isAuthenticated
                  ? `Signed in as ${user?.name} (${user?.email}) with role: ${user?.role?.toUpperCase()}`
                  : 'No active JWT token found in localStorage. Protected API calls will be rejected with 401.'}
              </p>
            </div>
          </div>

          {/* Quick Session Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {isAuthenticated ? (
              <button
                onClick={() => dispatch(logout())}
                className="btn-danger"
                style={{ padding: '8px 16px' }}
                title="Log out and purge authentication token (Exp 4e)"
              >
                <LogOut size={16} /> Logout & Clear Token
              </button>
            ) : (
              <button
                onClick={() => onOpenLogin()}
                className="btn-primary"
                style={{ padding: '8px 16px' }}
              >
                <LogIn size={16} /> Open Login Form
              </button>
            )}
          </div>
        </div>

        {/* Token Inspection Box (Exp 4c, 4d) */}
        <div style={tokenInspectionBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Stored JWT Authentication Token (localStorage.getItem('auth_token'))
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Bearer Token
            </span>
          </div>
          <div style={tokenRawStyle}>
            {token ? (
              <code style={{ color: '#34d399', wordBreak: 'break-all' }}>{token}</code>
            ) : (
              <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                null (User is not authenticated. Login to generate a token.)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive API Interceptor Testing Suite */}
      <div style={testingGridStyle}>
        {/* Left: Interactive Experiment Controls */}
        <div className="glass-panel" style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Terminal size={20} color="#f97316" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
              Interceptor & Protection Test Suite
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Execute real HTTP requests via Axios to test how the <strong>Request Interceptor</strong> automatically attaches the Bearer token, and how the <strong>Response Interceptor</strong> intercepts errors.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Quick Login Helpers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => dispatch(loginUser({ email: 'admin@foodie.com', password: 'admin123' }))}
                className="btn-secondary"
                disabled={isLoading}
                style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
              >
                <ShieldCheck size={16} color="#f59e0b" />
                <span style={{ fontSize: '0.82rem' }}>Login as Chef (Admin)</span>
              </button>

              <button
                onClick={() => dispatch(loginUser({ email: 'user@foodie.com', password: 'user123' }))}
                className="btn-secondary"
                disabled={isLoading}
                style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
              >
                <UserCheck size={16} color="#34d399" />
                <span style={{ fontSize: '0.82rem' }}>Login as Sarah (Customer)</span>
              </button>
            </div>

            {/* Test 1: GET /api/auth/me */}
            <button
              onClick={handleTestProtectedMe}
              className="btn-secondary"
              disabled={testLoading}
              style={{ justifyContent: 'space-between', padding: '10px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={15} color="#38bdf8" />
                <span style={{ fontSize: '0.86rem' }}>Test Protected: <strong>GET /api/auth/me</strong></span>
              </div>
              <span className="badge badge-secondary" style={{ fontSize: '0.68rem' }}>Exp 4d</span>
            </button>

            {/* Test 2: POST /api/orders */}
            <button
              onClick={handleTestProtectedOrder}
              className="btn-secondary"
              disabled={testLoading}
              style={{ justifyContent: 'space-between', padding: '10px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={15} color="#34d399" />
                <span style={{ fontSize: '0.86rem' }}>Test Protected: <strong>POST /api/orders</strong></span>
              </div>
              <span className="badge badge-secondary" style={{ fontSize: '0.68rem' }}>Exp 4f</span>
            </button>

            {/* Test 3: Simulate 401 Expired Token */}
            <button
              onClick={handleTestExpiredToken}
              className="btn-danger"
              disabled={testLoading}
              style={{ justifyContent: 'space-between', padding: '10px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={15} />
                <span style={{ fontSize: '0.86rem' }}>Simulate Expired Token (401 Interception)</span>
              </div>
              <span className="badge badge-danger" style={{ fontSize: '0.68rem' }}>Exp 4g</span>
            </button>
          </div>
        </div>

        {/* Right: Real-time Terminal / Response Inspector */}
        <div className="glass-panel" style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
                API Response Inspector
              </h3>
            </div>
            {testResult && (
              <span className={testResult.success ? 'badge badge-success' : 'badge badge-danger'}>
                HTTP {testResult.status}
              </span>
            )}
          </div>

          {testLoading ? (
            <div style={terminalLoadingStyle}>
              <div
                className="animate-spin"
                style={{ width: 28, height: 28, border: '2px solid rgba(249, 115, 22, 0.3)', borderTopColor: '#f97316', borderRadius: '50%' }}
              />
              <span style={{ fontSize: '0.86rem', color: '#cbd5e1', marginTop: '10px' }}>
                Axios transmitting request through interceptors...
              </span>
            </div>
          ) : testResult ? (
            <div style={terminalOutputStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {testResult.success ? <CheckCircle2 size={16} color="#10b981" /> : <AlertCircle size={16} color="#ef4444" />}
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: testResult.success ? '#34d399' : '#f87171' }}>
                  {testResult.endpoint}
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#e2e8f0', marginBottom: '10px' }}>
                {testResult.message}
              </div>

              <div style={codeBoxStyle}>
                <pre style={preStyle}>
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div style={terminalEmptyStyle}>
              <Terminal size={36} color="#64748b" />
              <span style={{ marginTop: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Click any of the test buttons to execute an Axios request.
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Headers, Bearer token, and JSON response will appear here.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px'
};

const cardStyle = {
  padding: '22px 24px',
  borderRadius: 'var(--radius-xl)',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const statusCircleStyle = {
  width: '46px',
  height: '46px',
  borderRadius: '12px',
  border: '1px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const tokenInspectionBoxStyle = {
  background: 'rgba(0, 0, 0, 0.4)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '12px 16px'
};

const tokenRawStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.82rem',
  background: 'rgba(0, 0, 0, 0.3)',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const testingGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
  gap: '18px'
};

const terminalLoadingStyle = {
  minHeight: '220px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const terminalEmptyStyle = {
  minHeight: '220px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
};

const terminalOutputStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const codeBoxStyle = {
  background: '#070b13',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '8px',
  padding: '12px 16px',
  maxHeight: '220px',
  overflowY: 'auto'
};

const preStyle = {
  margin: 0,
  fontFamily: 'var(--font-mono)',
  fontSize: '0.78rem',
  color: '#cbd5e1',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all'
};
