import axios from 'axios';
import { mockBackend } from './mockBackend';
import { eventBus } from './eventBus';

// Create central Axios instance
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Configure Axios Adapter to route requests through our mockBackend while running
// full Axios interceptors, lifecycle hooks, and error propagation.
apiClient.defaults.adapter = async (config) => {
  const { url = '', method = 'get', data, params, headers } = config;
  const parsedData = typeof data === 'string' && data ? JSON.parse(data) : data || {};
  const authHeader = headers?.Authorization || headers?.authorization;

  // Clean URL
  const path = url.replace(/^\/api/, '');

  try {
    let result;

    // Route: GET /api/foods
    if (path === '/foods' || path === '/foods/' || path === '') {
      if (method.toLowerCase() === 'get') {
        result = await mockBackend.getFoods(params);
      } else if (method.toLowerCase() === 'post') {
        result = await mockBackend.createFood(parsedData, authHeader);
      }
    }
    // Route: /api/foods/:id
    else if (path.startsWith('/foods/')) {
      const id = path.split('/')[2];
      if (method.toLowerCase() === 'get') {
        result = await mockBackend.getFoodById(id);
      } else if (method.toLowerCase() === 'put' || method.toLowerCase() === 'patch') {
        result = await mockBackend.updateFood(id, parsedData, authHeader);
      } else if (method.toLowerCase() === 'delete') {
        result = await mockBackend.deleteFood(id, authHeader);
      }
    }
    // Route: POST /api/auth/login
    else if (path === '/auth/login' && method.toLowerCase() === 'post') {
      result = await mockBackend.login(parsedData);
    }
    // Route: GET /api/auth/me
    else if (path === '/auth/me' && method.toLowerCase() === 'get') {
      result = await mockBackend.getProfile(authHeader);
    }
    // Route: POST /api/orders
    else if (path === '/orders' && method.toLowerCase() === 'post') {
      result = await mockBackend.placeOrder(parsedData, authHeader);
    }
    // Route: POST /api/database/reset
    else if (path === '/database/reset') {
      const foods = await mockBackend.resetDatabase();
      result = { status: 200, data: foods, message: 'Database reset to default' };
    }
    else {
      throw {
        response: {
          status: 404,
          data: { message: `Endpoint ${method.toUpperCase()} /api${path} not found.` }
        }
      };
    }

    return {
      data: result.data !== undefined ? result.data : result,
      status: result.status || 200,
      statusText: result.statusText || 'OK',
      headers: { 'content-type': 'application/json' },
      config
    };
  } catch (err) {
    if (err.response) {
      const errorObj = new Error(err.response.data?.message || 'API Request failed');
      errorObj.response = {
        data: err.response.data,
        status: err.response.status,
        statusText: err.response.status === 401 ? 'Unauthorized' : 'Error',
        headers: {},
        config
      };
      errorObj.config = config;
      return Promise.reject(errorObj);
    }
    return Promise.reject(err);
  }
};

// ==========================================
// EXPERIMENT 4d: AXIOS REQUEST INTERCEPTOR
// Attaches Bearer token to outgoing requests
// and broadcasts to the Live Network Inspector
// ==========================================
apiClient.interceptors.request.use(
  (config) => {
    // 1. Retrieve token from browser storage
    const token = localStorage.getItem('auth_token');

    // 2. Attach Authorization header if token exists
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Emit log to Network Inspector drawer
    eventBus.emit('network:request', {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      method: (config.method || 'GET').toUpperCase(),
      url: `/api${config.url.replace(/^\/api/, '')}`,
      headers: { ...config.headers },
      data: config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : null,
      params: config.params
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// EXPERIMENT 4g: AXIOS RESPONSE INTERCEPTOR
// Handles responses & 401 Unauthorized / Token Expiration
// ==========================================
apiClient.interceptors.response.use(
  (response) => {
    // Broadcast successful response to Network Inspector
    eventBus.emit('network:response', {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      url: response.config.url,
      method: (response.config.method || 'GET').toUpperCase(),
      status: response.status,
      data: response.data
    });

    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.message || error.message || 'An error occurred';

    // Broadcast error response to Network Inspector
    eventBus.emit('network:error', {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      url: error.config?.url,
      method: (error.config?.method || 'GET').toUpperCase(),
      status: status || 500,
      message,
      data: error.response?.data
    });

    // Handle 401 Unauthorized (Expired or invalid token)
    if (status === 401) {
      console.warn('[Axios Interceptor] 401 Unauthorized detected. Clearing session.');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      eventBus.emit('auth:unauthorized', {
        message: message || 'Session expired or authentication failed. Please login again.'
      });
    }

    return Promise.reject(error);
  }
);
