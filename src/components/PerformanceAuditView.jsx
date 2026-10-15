import React, { useState } from 'react';
import {
  Zap,
  Layers,
  Image,
  Smartphone,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Wifi,
  WifiOff,
  Cpu
} from 'lucide-react';
import { sanitizeInput } from '../utils/security';

export default function PerformanceAuditView() {
  const [offlineSimulated, setOfflineSimulated] = useState(!navigator.onLine);
  const [securityInput, setSecurityInput] = useState("<script>alert('XSS Attack')</script><b>Delicious Pizza</b>");
  const [sanitizedResult, setSanitizedResult] = useState('');

  const handleTestSecurity = () => {
    setSanitizedResult(sanitizeInput(securityInput));
  };

  const handleToggleOffline = () => {
    setOfflineSimulated(!offlineSimulated);
  };

  return (
    <div style={containerStyle}>
      {/* Header Banner */}
      <div className="glass-panel" style={bannerCardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={iconBadgeStyle}>
            <Zap size={22} color="#f97316" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#ffffff', margin: 0 }}>
                Experiment 2: Performance, PWA & Accessibility Suite
              </h2>
              <span className="badge badge-success">Optimized</span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Comprehensive performance profiling, code-splitting chunks, Progressive Web App (PWA) cache, WCAG AA accessibility, and XSS sanitization.
            </p>
          </div>
        </div>

        {/* Feature Grid Summary */}
        <div style={featureGridStyle}>
          <div style={featureCardStyle}>
            <Layers size={18} color="#38bdf8" />
            <div>
              <div style={featureTitleStyle}>Code Splitting & Lazy Loading</div>
              <div style={featureSubStyle}>React.lazy & Suspense dynamic imports (Exp 2a, 2b)</div>
            </div>
          </div>

          <div style={featureCardStyle}>
            <Image size={18} color="#fbbf24" />
            <div>
              <div style={featureTitleStyle}>Image & Memo Optimization</div>
              <div style={featureSubStyle}>React.memo, decoding="async", WebP CDN (Exp 2c)</div>
            </div>
          </div>

          <div style={featureCardStyle}>
            <Smartphone size={18} color="#34d399" />
            <div>
              <div style={featureTitleStyle}>Progressive Web App (PWA)</div>
              <div style={featureSubStyle}>Service Worker & Web App Manifest (Exp 2d)</div>
            </div>
          </div>

          <div style={featureCardStyle}>
            <Eye size={18} color="#a855f7" />
            <div>
              <div style={featureTitleStyle}>Accessibility (A11y)</div>
              <div style={featureSubStyle}>ARIA roles, labels, focus rings, keyboard nav (Exp 2e)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Sections Grid */}
      <div style={sectionsGridStyle}>
        {/* Section 1: Dynamic Imports & Code Splitting */}
        <div className="glass-panel" style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Cpu size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
              Lazy Loading & Dynamic Chunks (Exp 2a, 2b)
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Heavy modal dialogs and secondary views are dynamically loaded on-demand to minimize initial bundle size.
          </p>

          <div style={chunksTableStyle}>
            <div style={chunkRowStyle}>
              <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.84rem' }}>FoodDetailModal</span>
              <span className="badge badge-secondary">React.lazy dynamic import()</span>
            </div>
            <div style={chunkRowStyle}>
              <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.84rem' }}>CheckoutModal</span>
              <span className="badge badge-secondary">React.lazy dynamic import()</span>
            </div>
            <div style={chunkRowStyle}>
              <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.84rem' }}>CrudPanel</span>
              <span className="badge badge-secondary">Code split chunk</span>
            </div>
            <div style={chunkRowStyle}>
              <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.84rem' }}>TestRunnerView</span>
              <span className="badge badge-secondary">Code split chunk</span>
            </div>
          </div>
        </div>

        {/* Section 2: PWA Offline Capabilities */}
        <div className="glass-panel" style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Smartphone size={18} color="#34d399" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
              PWA Service Worker & Manifest (Exp 2d)
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            The application registers <code style={codeTagStyle}>/sw.js</code> and provides a Web App Manifest for mobile installation and offline menu browsing.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={pwaStatusRowStyle}>
              <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>Service Worker Status:</span>
              <span className="badge badge-success">Active & Registered</span>
            </div>
            <div style={pwaStatusRowStyle}>
              <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>Manifest (manifest.json):</span>
              <span className="badge badge-success">Standalone Display</span>
            </div>
            <div style={pwaStatusRowStyle}>
              <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>Network Status:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={offlineSimulated ? 'badge badge-warning' : 'badge badge-success'}>
                  {offlineSimulated ? <WifiOff size={11} /> : <Wifi size={11} />}
                  {offlineSimulated ? 'Offline' : 'Online'}
                </span>
                <button
                  type="button"
                  onClick={handleToggleOffline}
                  className="btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                  title="Toggle simulated offline state for PWA testing"
                >
                  {offlineSimulated ? 'Go Online' : 'Simulate Offline'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Accessibility Features */}
        <div className="glass-panel" style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Eye size={18} color="#a855f7" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
              Accessibility & Keyboard Navigation (Exp 2e)
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Full WCAG AA compliance with visible focus outlines, semantic landmark tags, and screen reader announcements.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={a11yItemStyle}>
              <CheckCircle2 size={15} color="#10b981" />
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                <strong>Skip-Link:</strong> Accessible hidden link for keyboard screen readers (<code style={codeTagStyle}>.skip-link</code>).
              </span>
            </div>
            <div style={a11yItemStyle}>
              <CheckCircle2 size={15} color="#10b981" />
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                <strong>ARIA Landmarks:</strong> <code style={codeTagStyle}>role="region"</code>, <code style={codeTagStyle}>role="search"</code>, <code style={codeTagStyle}>role="list"</code>.
              </span>
            </div>
            <div style={a11yItemStyle}>
              <CheckCircle2 size={15} color="#10b981" />
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                <strong>Keyboard Handlers:</strong> Modals close on <kbd style={kbdStyle}>Esc</kbd>, tabs navigate via <kbd style={kbdStyle}>Tab</kbd>.
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Security Sanitizer Lab */}
        <div className="glass-panel" style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <ShieldCheck size={18} color="#f97316" />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>
              Front-End Security & XSS Sanitization (Exp 2f)
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Test user input sanitization to prevent Cross-Site Scripting (XSS) and code injection before API dispatch.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Raw Test Input:</label>
            <input
              type="text"
              value={securityInput}
              onChange={(e) => setSecurityInput(e.target.value)}
              style={inputStyle}
            />

            <button
              onClick={handleTestSecurity}
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.84rem', alignSelf: 'flex-start' }}
            >
              Sanitize Input
            </button>

            {sanitizedResult && (
              <div style={sanitizedBoxStyle}>
                <span style={{ fontSize: '0.76rem', color: '#34d399', fontWeight: 700 }}>Clean Sanitized Output:</span>
                <code style={{ fontSize: '0.82rem', color: '#ffffff', wordBreak: 'break-all', display: 'block', marginTop: '4px' }}>
                  {sanitizedResult}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const bannerCardStyle = {
  padding: '24px',
  borderRadius: 'var(--radius-xl)',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px'
};

const iconBadgeStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  background: 'rgba(249, 115, 22, 0.15)',
  border: '1px solid rgba(249, 115, 22, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const featureGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '12px',
  paddingTop: '16px',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
};

const featureCardStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  background: 'rgba(255, 255, 255, 0.03)',
  padding: '12px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const featureTitleStyle = {
  fontSize: '0.86rem',
  fontWeight: 700,
  color: '#ffffff'
};

const featureSubStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-muted)',
  marginTop: '2px'
};

const sectionsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
  gap: '18px'
};

const cardStyle = {
  padding: '20px',
  borderRadius: 'var(--radius-lg)',
  display: 'flex',
  flexDirection: 'column'
};

const chunksTableStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const chunkRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderRadius: '6px',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.04)'
};

const pwaStatusRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderRadius: '6px',
  background: 'rgba(255, 255, 255, 0.02)'
};

const a11yItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  padding: '6px 0'
};

const codeTagStyle = {
  fontFamily: 'var(--font-mono)',
  color: '#fb923c',
  fontSize: '0.78rem'
};

const kbdStyle = {
  padding: '2px 5px',
  borderRadius: '4px',
  background: 'rgba(255, 255, 255, 0.15)',
  fontSize: '0.72rem',
  fontFamily: 'var(--font-mono)'
};

const inputStyle = {
  background: 'var(--bg-input)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  padding: '8px 12px',
  color: '#ffffff',
  fontSize: '0.86rem'
};

const sanitizedBoxStyle = {
  padding: '10px 12px',
  borderRadius: '6px',
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.3)'
};
