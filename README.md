# 🍔 Foodie | Food Ordering Web Application
### Comprehensive Academic Lab Suite (Component Testing, Performance, PWA, A11y, REST APIs & Redux)

A high-fidelity Food Ordering Progressive Web Application (PWA) built with **React 19**, **Redux Toolkit**, **Axios**, **Jest**, and **React Testing Library**.

---

## 🚀 Quick Start

### 1. Start Development Server
```bash
npm run dev
```
Open **http://localhost:5174/** in your browser.

### 2. Run Automated Jest Component Test Suite
```bash
npm test
```
To run tests with code coverage:
```bash
npm test -- --coverage
```

### 3. Production Build & Linting
```bash
npm run lint
npm run build
```

---

## 🧪 Experiments Summary & Verification

### Experiment 1: Implement Component Testing for Food Ordering Application
- **Topics**: `Jest`, `React Testing Library`, `Component Testing`
- **Test Files**:
  - [`src/__tests__/FoodCard.test.jsx`](src/__tests__/FoodCard.test.jsx):
    - Food info rendering (title, description, price, rating, review count, calories, prep time, dietary badges).
    - `onSelectDetails` callback on "Details" button click.
    - `onAddToCart` callback on "Add" button click.
  - [`src/__tests__/FoodList.test.jsx`](src/__tests__/FoodList.test.jsx):
    - Rendering multiple food items with reusable `FoodCard` components.
    - Search query input handling and sanitization.
    - Category filtering selection callback.
    - Loading skeleton verification when `isLoading=true`.
    - Error state display with retry trigger.
    - Empty state message rendering.
  - [`src/__tests__/Cart.test.jsx`](src/__tests__/Cart.test.jsx):
    - Empty cart message and prompt.
    - Cart items list and unit/line price rendering.
    - Derived state calculations: subtotal, 5% sales tax, free delivery threshold, and total amount.
    - Item quantity increment and decrement actions.
    - Item removal (`removeFromCart`) and `clearCart` actions.

#### Verification:
Run `npm test` in the terminal to execute all 13 test cases across 3 suites:
```bash
PASS src/__tests__/FoodCard.test.jsx
PASS src/__tests__/FoodList.test.jsx
PASS src/__tests__/Cart.test.jsx

Test Suites: 3 passed, 3 total
Tests:       13 passed, 13 total
```
You can also inspect and run the tests interactively inside the web app via the **"Component Tests"** tab!

---

### Experiment 2: Implement Performance Optimization and Accessibility
- **Topics**: `Performance Optimization`, `Lazy Loading`, `Code Splitting`, `PWA`, `Accessibility`, `Security`
- **Implementation**:
  - **a) Lazy Loading**: `FoodDetailModal` and `CheckoutModal` are loaded on-demand via `React.lazy` and wrapped in `<Suspense fallback={<LoadingFallback />}>` in [`src/App.jsx`](src/App.jsx).
  - **b) Code Splitting**: Dynamic imports split heavy dialogs and secondary views into separate on-demand bundle chunks (`FoodDetailModal-*.js`, `CheckoutModal-*.js`, `CrudPanel-*.js`, `TestRunnerView-*.js`, `PerformanceAuditView-*.js`).
  - **c) Image & Component Optimization**:
    - `React.memo` applied to [`FoodCard.jsx`](src/components/FoodCard.jsx) and [`FoodList.jsx`](src/components/FoodList.jsx) to prevent unnecessary re-renders.
    - `useCallback` memoizes event handlers in `App.jsx`.
    - `<img>` tags use `loading="lazy"` and `decoding="async"` with WebP auto-formatting.
  - **d) Progressive Web Application (PWA)**:
    - Web App Manifest: [`public/manifest.json`](public/manifest.json) configured for standalone display, icons, and theme color.
    - Service Worker: [`public/sw.js`](public/sw.js) pre-caches the app shell and provides cache-first / network-first strategies.
    - Service Worker Registration: [`src/serviceWorkerRegistration.js`](src/serviceWorkerRegistration.js) manages lifecycle and online/offline transitions.
  - **e) Accessibility (A11y)**:
    - Screen-reader skip-link (`.skip-link`) in `index.html`.
    - Semantic ARIA roles: `role="region"`, `role="search"`, `role="list"`, `role="listitem"`, `role="article"`, `role="dialog"`, `role="status"`.
    - Keyboard navigation: Modals and drawers close on <kbd>Escape</kbd>; tabs and buttons have high-contrast `:focus-visible` outline rings.
  - **f) Front-End Security**:
    - Input sanitization utility in [`src/utils/security.js`](src/utils/security.js) stripping malicious HTML and script tags to mitigate XSS attacks.
    - Validation for email, price limits, and image URLs.
    - Client-side rate-limiting checks for API calls.

---

### Additional Laboratory Modules Included:
- **Food Ordering REST API CRUD Operations (GET, POST, PUT, DELETE)**:
  - Accessible via the **"CRUD Admin"** tab in [`src/components/CrudPanel.jsx`](src/components/CrudPanel.jsx).
- **Authentication, Tokens & Axios Interceptors**:
  - Accessible via the **"Auth & Tokens"** tab in [`src/components/AuthLabView.jsx`](src/components/AuthLabView.jsx), featuring Bearer token injection and 401 token expiration handling.
- **Redux Cart State & Custom Middleware**:
  - Accessible via the top-right **Cart Drawer** in [`src/components/CartDrawer.jsx`](src/components/CartDrawer.jsx) with derived calculations and live middleware logging.

---

## 👥 Demo Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Chef (Admin)** | `admin@foodie.com` | `admin123` | Full CRUD privileges (GET, POST, PUT, DELETE) + Ordering |
| **Customer** | `user@foodie.com` | `user123` | Cart, Protected Checkout & Order Placement |
