import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { eventBus } from '../services/eventBus';
import { simulateExpiredToken } from '../store/authSlice';
import { apiClient } from '../services/api';
import {
  Activity,
  Layers,
  Globe,
  Trash2,
  X,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  Key,
  AlertCircle
} from 'lucide-react';

export default function LiveInspector({ isOpen, onClose }) {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('network'); // 'network' | 'redux'
  const [networkLogs, setNetworkLogs] = useState([]);
  const [reduxLogs, setReduxLogs] = useState([]);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    // Listen to network events from Axios interceptors
    const unsubs = [
      eventBus.on('network:request', (data) => {
        setNetworkLogs((prev) => [
          { type: 'REQUEST', ...data },
          ...prev.slice(0, 49)
        ]);
      }),
      eventBus.on('network:response', (data) => {
        setNetworkLogs((prev) => [
          { type: 'RESPONSE', ...data },
          ...prev.slice(0, 49)
        ]);
      }),
      eventBus.on('network:error', (data) => {
        setNetworkLogs((prev) => [
          { type: 'ERROR', ...data },
          ...prev.slice(0, 49)
        ]);
      }),
      // Listen to Redux middleware cart events
      eventBus.on('redux:cart_action', (data) => {
        setReduxLogs((prev) => [data, ...prev.slice(0, 49)]);
      })
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  if (!isOpen) return null;

  // EXPERIMENT 4g: Simulate Expired Token test
  const handleSimulateExpiredToken = async () => {
    setSimulating(true);
    // 1. Inject expired token
    dispatch(simulateExpiredToken());
    try {
      // 2. Make protected call to trigger 401
      await apiClient.get('/auth/me');
    } catch (err) {
      console.log('Intercepted 401 simulation:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleClearLogs = () => {
    if (activeTab === 'network') setNetworkLogs([]);
    else setReduxLogs([]);
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        className="glass-panel"
        style={drawerContainerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={drawerHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={iconBadgeStyle}>
              <Activity size={18} color="#f97316" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>
                Live Architectural Inspector
              </h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Real-time Axios Interceptor & Redux Middleware Monitor
              </span>
            </div>
          </div>
          <button style={closeButtonStyle} onClick={onClose}>
            <X size={18} color="#94a3b8" />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={tabSelectorStyle}>
          <button
            onClick={() => setActiveTab('network')}
            style={activeTab === 'network' ? tabActiveStyle : tabInactiveStyle}
          >
            <Globe size={15} />
            <span>Axios Network Logs ({networkLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('redux')}
            style={activeTab === 'redux' ? tabActiveStyle : tabInactiveStyle}
          >
            <Layers size={15} />
            <span>Redux Middleware ({reduxLogs.length})</span>
          </button>
        </div>

        {/* Action Bar */}
        <div style={actionsBarStyle}>
          {activeTab === 'network' && (
            <button
              onClick={handleSimulateExpiredToken}
              disabled={simulating}
              className="btn-danger"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              title="Test Axios response interceptor 401 token expiry handling"
            >
              <ShieldAlert size={14} />
              <span>Simulate Expired Token (401)</span>
            </button>
          )}

          <div style={{ flex: 1 }} />

          <button
            onClick={handleClearLogs}
            style={clearLogsBtnStyle}
            title="Clear logs"
          >
            <Trash2 size={13} /> Clear
          </button>
        </div>

        {/* Logs Container */}
        <div style={logsContainerStyle}>
          {activeTab === 'network' ? (
            /* Network logs */
            networkLogs.length === 0 ? (
              <div style={emptyLogsStyle}>
                <Globe size={40} color="#64748b" />
                <span style={{ marginTop: '8px' }}>No Axios requests recorded yet.</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                  Interact with the app (browse, search, add food) to see Axios traffic.
                </span>
              </div>
            ) : (
              networkLogs.map((log) => {
                const isReq = log.type === 'REQUEST';
                const isErr = log.type === 'ERROR';
                const hasAuth = log.headers?.Authorization;

                return (
                  <div
                    key={log.id}
                    style={{
                      ...logItemCardStyle,
                      borderColor: isErr ? 'rgba(239, 68, 68, 0.3)' : isReq ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isReq ? (
                          <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                            <ArrowUpRight size={11} /> REQUEST
                          </span>
                        ) : isErr ? (
                          <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                            <AlertCircle size={11} /> {log.status || 500} ERROR
                          </span>
                        ) : (
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                            <ArrowDownLeft size={11} /> {log.status || 200} OK
                          </span>
                        )}

                        <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#fb923c' }}>
                          {log.method}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#f8fafc' }}>
                          {log.url}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {log.timestamp}
                      </span>
                    </div>

                    {/* Authorization Header Banner (Exp 4d) */}
                    {isReq && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem' }}>
                        <Key size={12} color={hasAuth ? '#34d399' : '#94a3b8'} />
                        <span style={{ color: 'var(--text-muted)' }}>Authorization:</span>
                        {hasAuth ? (
                          <code style={{ color: '#34d399', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                            {String(log.headers.Authorization).substring(0, 30)}...
                          </code>
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>None (Public endpoint)</span>
                        )}
                      </div>
                    )}

                    {/* Error message */}
                    {isErr && (
                      <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#fca5a5' }}>
                        Message: {log.message}
                      </div>
                    )}

                    {/* Data preview */}
                    {log.data && (
                      <div style={payloadBoxStyle}>
                        <pre style={codePreStyle}>
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            )
          ) : (
            /* Redux logs */
            reduxLogs.length === 0 ? (
              <div style={emptyLogsStyle}>
                <Layers size={40} color="#64748b" />
                <span style={{ marginTop: '8px' }}>No Redux cart middleware events yet.</span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                  Add, update or clear items in the cart to see middleware interception.
                </span>
              </div>
            ) : (
              reduxLogs.map((log) => (
                <div key={log.id} style={logItemCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                        INTERCEPTED
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.82rem', color: '#fbbf24' }}>
                        {log.type}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {log.timestamp}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    <span>Total units: <strong style={{ color: '#ffffff' }}>{log.totalUnits}</strong></span>
                    <span>Distinct items: <strong style={{ color: '#ffffff' }}>{log.itemsCount}</strong></span>
                    <span style={{ color: '#34d399' }}>✓ Synced to localStorage</span>
                  </div>

                  {log.payload && (
                    <div style={payloadBoxStyle}>
                      <pre style={codePreStyle}>
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )
          )}
        </div>
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
  background: 'rgba(0, 0, 0, 0.65)',
  backdropFilter: 'blur(6px)',
  zIndex: 1300,
  display: 'flex',
  justifyContent: 'flex-end'
};

const drawerContainerStyle = {
  width: '100%',
  maxWidth: '560px',
  height: '100%',
  background: 'var(--bg-secondary)',
  borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  animation: 'fadeIn 0.25s ease-out'
};

const drawerHeaderStyle = {
  padding: '16px 20px',
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

const tabSelectorStyle = {
  display: 'flex',
  background: 'rgba(0, 0, 0, 0.3)',
  padding: '4px 20px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  gap: '10px'
};

const tabInactiveStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  fontSize: '0.82rem',
  color: 'var(--text-muted)',
  borderRadius: '6px',
  cursor: 'pointer'
};

const tabActiveStyle = {
  ...tabInactiveStyle,
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#ffffff',
  fontWeight: 600
};

const actionsBarStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 20px',
  background: 'rgba(0, 0, 0, 0.15)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
};

const clearLogsBtnStyle = {
  fontSize: '0.76rem',
  color: 'var(--text-dim)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  borderRadius: '4px',
  background: 'rgba(255, 255, 255, 0.04)',
  cursor: 'pointer'
};

const logsContainerStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const emptyLogsStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-muted)',
  fontSize: '0.88rem'
};

const logItemCardStyle = {
  padding: '12px 14px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  borderRadius: 'var(--radius-md)'
};

const payloadBoxStyle = {
  marginTop: '8px',
  padding: '8px 10px',
  background: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '6px',
  border: '1px solid rgba(255, 255, 255, 0.04)',
  maxHeight: '130px',
  overflowY: 'auto'
};

const codePreStyle = {
  margin: 0,
  fontFamily: 'var(--font-mono)',
  fontSize: '0.72rem',
  color: '#cbd5e1',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all'
};
