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

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(CATEGORIES_DATA.delete + data);
      console.log(response);
      return { id: data, response: response.data };
    } catch (error) {
      console.log(error.response);
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  categories: [],
  allCategories: [],
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
    filterCategory(state, { payload }) {
      state.categories = state.allCategories.filter((category) => {
        return Object.entries(category).some(([_, value]) => {
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(String(payload).toLowerCase());
        });
      });
    },
    orderCategories(state, { payload }) {
      const { column, direction } = payload;
      state.categories = state.categories.sort((a, b) => {
        if (typeof a[column] === 'number' && typeof b[column] === 'number') {
          return direction === 'DESC'
            ? b[column] - a[column]
            : a[column] - b[column];
        }
        if (column === 'createdAt') {
          const dateA = new Date(a[column]);
          const dateB = new Date(b[column]);
          return direction === 'DESC' ? dateB - dateA : dateA - dateB;
        }
        const stringA = String(a[column]).toLowerCase();
        const stringB = String(b[column]).toLowerCase();
        if (direction === 'DESC') {
          return stringB.localeCompare(stringA);
        } else {
          return stringA.localeCompare(stringB);
        }
      });
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
        state.allCategories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = 'created';
        state.response = action.payload;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = 'deleted';
        state.response = action.payload.response || 'generic error';
        state.categories = state.categories.filter(
          (category) => category.id != action.payload.id,
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
      });
  },
});

export const { resetStatus, filterCategory, orderCategories } =
  cateogrySlice.actions;
export default cateogrySlice.reducer;
