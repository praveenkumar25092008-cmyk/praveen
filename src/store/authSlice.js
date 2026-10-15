import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../services/api';
import { eventBus } from '../services/eventBus';

// Load stored user & token on startup
const getInitialAuth = () => {
  try {
    const token = localStorage.getItem('auth_token');
    const userRaw = localStorage.getItem('auth_user');
    if (token && userRaw) {
      return {
        token,
        user: JSON.parse(userRaw),
        isAuthenticated: true
      };
    }
  } catch (e) {
    console.warn('Failed to parse cached auth state:', e);
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false
  };
};

// ==========================================
// EXPERIMENT 4b: Send credentials to Auth API
// EXPERIMENT 4c: Store token after successful login
// ==========================================
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Store in browser storage (Exp 4c)
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      return { token, user };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Authentication failed';
      return rejectWithValue(message);
    }
  }
);

// Verify current session with GET /api/auth/me
export const verifySession = createAsyncThunk(
  'auth/verifySession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Session expired');
    }
  }
);

// EXPERIMENT 4f: Place order (Protected API)
export const placeOrder = createAsyncThunk(
  'auth/placeOrder',
  async (orderPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/orders', orderPayload);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Order failed';
      return rejectWithValue(message);
    }
  }
);

const initialAuth = getInitialAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialAuth.user,
    token: initialAuth.token,
    isAuthenticated: initialAuth.isAuthenticated,
    isLoading: false,
    error: null,
    isOrderLoading: false,
    orderSuccess: null,
    orderError: null
  },
  reducers: {
    // EXPERIMENT 4e: Logout and remove stored token
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      eventBus.emit('auth:logout', 'You have been logged out.');
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    clearOrderStatus: (state) => {
      state.orderSuccess = null;
      state.orderError = null;
    },

    // EXPERIMENT 4g: Simulated Expired Token for testing 401 response interceptor
    simulateExpiredToken: (state) => {
      const expiredToken = `expired-token-simulated-${Date.now()}`;
      state.token = expiredToken;
      localStorage.setItem('auth_token', expiredToken);
    }
  },
  extraReducers: (builder) => {
    // loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });

    // verifySession
    builder
      .addCase(verifySession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifySession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      });

    // placeOrder
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.orderError = null;
        state.orderSuccess = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderSuccess = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.orderError = action.payload || 'Failed to place order';
      });
  }
});

export const { logout, clearAuthError, clearOrderStatus, simulateExpiredToken } = authSlice.actions;

export default authSlice.reducer;
