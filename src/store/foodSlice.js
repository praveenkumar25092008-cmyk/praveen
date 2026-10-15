import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../services/api';

// ==========================================
// EXPERIMENT 1a, 1c, 3a: GET FOOD ITEMS (Axios + async/await)
// ==========================================
export const fetchFoods = createAsyncThunk(
  'food/fetchFoods',
  async ({ search = '', category = 'All' } = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/foods', {
        params: { search, category }
      });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch food items';
      return rejectWithValue(message);
    }
  }
);

// ==========================================
// EXPERIMENT 1g: GET INDIVIDUAL FOOD DETAILS
// ==========================================
export const fetchFoodDetails = createAsyncThunk(
  'food/fetchFoodDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/foods/${id}`);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch food details';
      return rejectWithValue(message);
    }
  }
);

// ==========================================
// EXPERIMENT 3b: CREATE FOOD ITEM (POST)
// ==========================================
export const createFood = createAsyncThunk(
  'food/createFood',
  async (foodData, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await apiClient.post('/foods', foodData);
      // Refresh current list after successful CRUD (Exp 3h)
      const { filterCategory, searchQuery } = getState().food;
      dispatch(fetchFoods({ category: filterCategory, search: searchQuery }));
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to add food item';
      return rejectWithValue(message);
    }
  }
);

// ==========================================
// EXPERIMENT 3c: UPDATE FOOD ITEM (PUT)
// ==========================================
export const updateFood = createAsyncThunk(
  'food/updateFood',
  async ({ id, data }, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/foods/${id}`, data);
      // Refresh list after successful CRUD (Exp 3h)
      const { filterCategory, searchQuery } = getState().food;
      dispatch(fetchFoods({ category: filterCategory, search: searchQuery }));
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update food item';
      return rejectWithValue(message);
    }
  }
);

// ==========================================
// EXPERIMENT 3d: DELETE FOOD ITEM (DELETE)
// ==========================================
export const deleteFood = createAsyncThunk(
  'food/deleteFood',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/foods/${id}`);
      // Refresh list after successful CRUD (Exp 3h)
      const { filterCategory, searchQuery } = getState().food;
      dispatch(fetchFoods({ category: filterCategory, search: searchQuery }));
      return { id, message: response.data?.message || 'Food item deleted' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete food item';
      return rejectWithValue(message);
    }
  }
);

// Reset Menu Database
export const resetDatabase = createAsyncThunk(
  'food/resetDatabase',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.post('/database/reset');
      dispatch(fetchFoods({ category: 'All', search: '' }));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to reset database');
    }
  }
);

const foodSlice = createSlice({
  name: 'food',
  initialState: {
    items: [],
    categories: ['All', 'Burgers', 'Asian', 'Pizza', 'Mexican', 'Bowls', 'Italian', 'Desserts'],
    selectedCategory: 'All',
    searchQuery: '',
    selectedFood: null,
    // Loading states (Exp 1f, Exp 3f)
    isLoading: false,
    isDetailLoading: false,
    isMutating: false,
    // Error states (Exp 1f, Exp 3g)
    error: null,
    detailError: null,
    mutationError: null,
    lastMutationSuccess: null
  },
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSelectedFood: (state) => {
      state.selectedFood = null;
      state.detailError = null;
    },
    clearMutationStatus: (state) => {
      state.mutationError = null;
      state.lastMutationSuccess = null;
    }
  },
  extraReducers: (builder) => {
    // fetchFoods
    builder
      .addCase(fetchFoods.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred while fetching food menu';
      });

    // fetchFoodDetails
    builder
      .addCase(fetchFoodDetails.pending, (state) => {
        state.isDetailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchFoodDetails.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selectedFood = action.payload;
      })
      .addCase(fetchFoodDetails.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.detailError = action.payload || 'Failed to load food details';
      });

    // createFood
    builder
      .addCase(createFood.pending, (state) => {
        state.isMutating = true;
        state.mutationError = null;
      })
      .addCase(createFood.fulfilled, (state, action) => {
        state.isMutating = false;
        state.lastMutationSuccess = `Added "${action.payload.name}" to menu`;
      })
      .addCase(createFood.rejected, (state, action) => {
        state.isMutating = false;
        state.mutationError = action.payload;
      });

    // updateFood
    builder
      .addCase(updateFood.pending, (state) => {
        state.isMutating = true;
        state.mutationError = null;
      })
      .addCase(updateFood.fulfilled, (state, action) => {
        state.isMutating = false;
        state.lastMutationSuccess = `Updated "${action.payload.name}"`;
      })
      .addCase(updateFood.rejected, (state, action) => {
        state.isMutating = false;
        state.mutationError = action.payload;
      });

    // deleteFood
    builder
      .addCase(deleteFood.pending, (state) => {
        state.isMutating = true;
        state.mutationError = null;
      })
      .addCase(deleteFood.fulfilled, (state) => {
        state.isMutating = false;
        state.lastMutationSuccess = 'Food item removed successfully';
      })
      .addCase(deleteFood.rejected, (state, action) => {
        state.isMutating = false;
        state.mutationError = action.payload;
      });
  }
});

export const {
  setCategory,
  setSearchQuery,
  clearSelectedFood,
  clearMutationStatus
} = foodSlice.actions;

export default foodSlice.reducer;
