import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios, retryAttempt } from '../config/axios/axiosConfig';
import { CATEGORIES_DATA } from '../config/links/urls';

export const getAllCategories = createAsyncThunk(
  'categories/getAllCategories',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(CATEGORIES_DATA.all);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : 'Network error',
      );
    }
  },
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(CATEGORIES_DATA.create, data);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  categories: [],
  status: 'idle',
  error: null,
  response: null,
};

export const cateogrySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
      state.error = null;
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.status = 'success';
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = 'success';
        state.response = action.payload;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = cateogrySlice.actions;
export default cateogrySlice.reducer;
