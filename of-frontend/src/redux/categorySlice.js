import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios, retryAttempt } from '../config/axios/axiosConfig';
import { CATEGORIES_DATA } from '../config/links/urls';

export const getAllCategories = createAsyncThunk(
  'categories/getAllCategories',
  async ({ page = 0, size = -1 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(CATEGORIES_DATA.all, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : 'Network error',
      );
    }
  },
);

export const getCategoryById = createAsyncThunk(
  'categories/getCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(CATEGORIES_DATA.byId + id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const editCategory = createAsyncThunk(
  'categories/editCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        CATEGORIES_DATA.edit + data.id,
        data.category,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(CATEGORIES_DATA.create, data);
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
      const response = await axios.delete(CATEGORIES_DATA.delete + data);
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
  category: {},
  status: 'idle',
  pagination: {
    currentPage: 0,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  },
  toast: {
    status: null,
    error: null,
    response: null,
  },
};

export const cateogrySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetToastStatus(state) {
      state.toast.status = null;
      state.toast.error = null;
      state.toast.response = null;
    },
    resetCategories(state) {
      state.categories = [];
      state.toast.status = null;
      state.toast.response = null;
    },
    filterCategory(state, { payload }) {
      state.categories = state.allCategories.filter((category) => {
        return Object.entries(category).some(([_, value]) => {
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(String(payload).toLowerCase());
        });
      });
    },
    setPage(state, { payload }) {
      state.pagination.currentPage = payload;
    },
    setItemsPerPage(state, { payload }) {
      state.pagination.itemsPerPage = payload;
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
      .addCase(getAllCategories.fulfilled, (state, { payload }) => {
        const { content, itemsPerPage, totalItems, totalPages, currentPage } =
          payload;
        state.status = 'success';
        state.categories = content;
        state.allCategories = content;
        state.pagination.currentPage = currentPage;
        state.pagination.itemsPerPage = itemsPerPage;
        state.pagination.totalItems = totalItems;
        state.pagination.totalPages = totalPages;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.toast.error = action.error.message;
      })
      .addCase(getCategoryById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.status = 'success';
        state.category = action.payload;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.toast.error = action.error.message;
      })
      .addCase(createCategory.pending, (state) => {
        state.toast.status = 'loading';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.toast.status = 'created';
        state.toast.response = action.payload;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.toast.status = 'failed';
        state.toast.response = action.payload || 'generic error';
        state.toast.error = action.error.message;
      })
      .addCase(editCategory.pending, (state) => {
        state.toast.status = 'loading';
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.toast.status = 'created';
        state.toast.response = action.payload;
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.toast.status = 'failed';
        state.toast.response = action.payload || 'generic error';
        state.toast.error = action.error.message;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.toast.status = 'deleted';
        state.toast.response = action.payload.response || 'generic error';
        state.categories = state.categories.filter(
          (category) => category.id != action.payload.id,
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.toast.status = 'failed';
        state.toast.response = action.payload || 'generic error';
      });
  },
});

export const {
  resetToastStatus,
  resetCategories,
  filterCategory,
  orderCategories,
  setPage,
  setItemsPerPage,
} = cateogrySlice.actions;
export default cateogrySlice.reducer;
