import React, { useState, useEffect } from 'react';
import { eventBus } from '../services/eventBus';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = eventBus.on('toast', (toast) => {
      const id = Date.now() + Math.random();
      const newToast = { id, ...toast };
      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    });

    return () => unsubscribe();
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div style={containerStyle}>
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            style={{
              ...toastItemStyle,
              borderColor: isSuccess ? 'rgba(16, 185, 129, 0.4)' : isError ? 'rgba(239, 68, 68, 0.4)' : isWarning ? 'rgba(245, 158, 11, 0.4)' : 'rgba(59, 130, 246, 0.4)',
              background: 'rgba(17, 24, 39, 0.95)',
              boxShadow: isSuccess ? '0 8px 24px rgba(16, 185, 129, 0.2)' : isError ? '0 8px 24px rgba(239, 68, 68, 0.2)' : '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ flexShrink: 0 }}>
              {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
              {isError && <XCircle size={18} color="#ef4444" />}
              {isWarning && <AlertTriangle size={18} color="#f59e0b" />}
              {!isSuccess && !isError && !isWarning && <Info size={18} color="#3b82f6" />}
            </div>
            <div style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500, color: '#f8fafc' }}>
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: '#94a3b8', cursor: 'pointer', padding: 2 }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

const containerStyle = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  maxWidth: '400px',
  width: 'calc(100% - 48px)',
  pointerEvents: 'none'
};

const toastItemStyle = {
  pointerEvents: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '12px',
  backdropFilter: 'blur(16px)',
  border: '1px solid',
  animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
};
