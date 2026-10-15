import React from 'react';
import {
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const EXPERIMENT_DATA = {
  all: {
    title: 'Foodie | Gourmet Food Ordering Suite',
    subtitle: 'Integrated end-to-end architecture showcasing Component Testing, Performance, PWA, REST APIs & Redux.',
    badge: 'Integrated System',
    color: '#f97316',
    objectives: [
      'Exp 1: Component Testing with Jest & React Testing Library (FoodCard, FoodList, Cart)',
      'Exp 2: Performance optimization, React.lazy code splitting, PWA, accessibility & security',
      'CRUD Operations: REST API mutations (GET, POST, PUT, DELETE) with async error handling',
      'Auth & Tokens: JWT authentication, Axios request/response interceptors & protected APIs'
    ]
  },
  test: {
    title: 'Experiment 1: Implement Component Testing for Food Ordering Application',
    subtitle: 'Topics: Jest, React Testing Library, Component Testing',
    badge: 'Experiment 1',
    color: '#38bdf8',
    objectives: [
      'a) Create test cases for FoodCard, FoodList, and Cart components',
      'b) Test whether food information is rendered correctly',
      'c) Test search and category filtering functionality',
      'd) Test add-to-cart and remove-from-cart actions',
      'e) Use Jest for unit testing',
      'f) Use React Testing Library to render and interact with components',
      'g) Verify the test results (13/13 passing)'
    ]
  },
  perf: {
    title: 'Experiment 2: Implement Performance Optimization and Accessibility',
    subtitle: 'Topics: Performance Optimization, Lazy Loading, Code Splitting, PWA, Accessibility, Security',
    badge: 'Experiment 2',
    color: '#fbbf24',
    objectives: [
      'a) Implement lazy loading for food-detail and checkout components (React.lazy & Suspense)',
      'b) Apply code splitting using dynamic imports (Vite chunks)',
      'c) Optimize images (decoding="async", loading="lazy") and reduce re-renders (React.memo)',
      'd) Convert the application into a basic Progressive Web Application (manifest.json, sw.js)',
      'e) Add accessible labels (ARIA roles, landmarks) and keyboard navigation (Tab, Esc)',
      'f) Apply front-end security practices such as input validation and safe API handling'
    ]
  },
  crud: {
    title: 'Experiment 3: Food Ordering CRUD Operations using REST APIs',
    subtitle: 'Topics: Axios, Fetch API, CRUD, Async Operations, Loading and Error States',
    badge: 'Experiment 3',
    color: '#34d399',
    objectives: [
      'a) Retrieve food items using GET operation (/api/foods)',
      'b) Add a new food item using POST (/api/foods)',
      'c) Update food information using PUT or PATCH (/api/foods/:id)',
      'd) Delete a food item using DELETE (/api/foods/:id)',
      'e) Handle asynchronous API responses using async/await',
      'f) Display loading indicators during API operations',
      'g) Handle API errors and display user-friendly messages',
      'h) Refresh the food list after successful CRUD operations'
    ]
  },
  auth: {
    title: 'Experiment 4: Authentication & Token Management with Axios Interceptors',
    subtitle: 'Topics: Authentication, Tokens, Protected API, Axios Interceptors',
    badge: 'Experiment 4',
    color: '#a855f7',
    objectives: [
      'a) Create a login form for user authentication',
      'b) Send login credentials to authentication API (POST /api/auth/login)',
      'c) Store authentication token (fake JWT) after successful login',
      'd) Attach token to API requests using Axios request interceptor (Authorization: Bearer)',
      'e) Implement logout functionality and remove stored token',
      'f) Restrict cart checkout and CRUD APIs to authenticated users',
      'g) Handle authentication errors and expired tokens (Axios 401 response interceptor)',
      'h) Display loading and error states during authentication'
    ]
  }
};

export default function ExperimentBanner({ activeTab, onSwitchTab }) {
  const data = EXPERIMENT_DATA[activeTab] || EXPERIMENT_DATA.all;

  return (
    <header className="glass-panel" style={bannerContainerStyle}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              className="badge"
              style={{
                background: `rgba(${activeTab === 'test' ? '56, 189, 248' : activeTab === 'perf' ? '251, 191, 36' : activeTab === 'crud' ? '52, 211, 153' : activeTab === 'auth' ? '168, 85, 247' : '249, 115, 22'}, 0.15)`,
                color: data.color,
                border: `1px solid ${data.color}`
              }}
            >
              {data.badge}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Lab Verification Active
            </span>
          </div>

          <h1 style={titleStyle}>{data.title}</h1>
          <p style={subtitleStyle}>{data.subtitle}</p>
        </div>

        {activeTab !== 'all' && (
          <button
            onClick={() => onSwitchTab('all')}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            aria-label="Back to Storefront"
          >
            <span>Back to Storefront</span>
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Objectives Checklist Grid */}
      <div style={objectivesGridStyle} role="list" aria-label="Experiment Objectives Checklist">
        {data.objectives.map((obj, i) => (
          <div key={i} role="listitem" style={objectiveCardStyle}>
            <CheckCircle size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
            <span style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.4 }}>
              {obj}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
}

const bannerContainerStyle = {
  padding: '20px 24px',
  borderRadius: 'var(--radius-xl)',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  background: 'linear-gradient(135deg, rgba(22, 30, 49, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.1)'
};

const titleStyle = {
  fontSize: '1.45rem',
  color: '#ffffff',
  marginTop: '8px',
  lineHeight: 1.2
};

const subtitleStyle = {
  fontSize: '0.88rem',
  color: 'var(--text-muted)',
  marginTop: '4px'
};

const objectivesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '8px',
  paddingTop: '12px',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
};

const objectiveCardStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  background: 'rgba(255, 255, 255, 0.03)',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};
