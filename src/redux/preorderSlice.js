import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '@/config/axios/axiosConfig';
import { PREORDER_DATA } from '@/config/links/urls';
import MyPreorders from '@/pages/preorders/myPreorders/MyPreorders';

export const getAllPreorders = createAsyncThunk(
  'preorder/getAllPreorders',
  async ({ page = 0, size = -1 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(PREORDER_DATA.all, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getUserPreoders = createAsyncThunk(
  'preorder/getUserPreorders',
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.get(PREORDER_DATA.byUser + user);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message.data);
    }
  },
);

export const deletePreorder = createAsyncThunk(
  'preorder/deletePreorder',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(PREORDER_DATA.delete + data);
      return { id: data, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const countPreordersByStatus = createAsyncThunk(
  'preorder/countPreoordersByStatus',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(PREORDER_DATA.countByStatus + data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updatePreorderStatus = createAsyncThunk(
  'preorder/updatePreorderStatus',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.patch(
        `${PREORDER_DATA.updateStatus}${data.id}/${data.status}`,
      );
      dispatch(getAllPreorders());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const preorderToSale = createAsyncThunk(
  'preorder/preorderToSale',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(PREORDER_DATA.toSale + data);
      dispatch(getAllPreorders());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  preorders: [],
  allPreorders: [],
  myPreorders: [],
  allMyPreorders: [],
  count: 0,
  status: 'idle',
  response: '',
  error: '',
  pagination: {
    currentPage: 0,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  },
  toast: {
    status: null,
    response: null,
    error: null,
  },
};

export const preorderSlice = createSlice({
  name: 'preorders',
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
      state.response = '';
      state.error = '';
    },
    resetToastStatus(state) {
      state.toast.status = null;
      state.toast.response = null;
      state.toast.error = null;
    },
    filterPreorders(state, { payload }) {
      state.preorders = state.allPreorders.filter((preorder) => {
        return Object.entries(preorder).some(([_, value]) => {
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
    orderPreorders(state, { payload }) {
      const { column, direction } = payload;
      state.preorders = state.preorders.sort((a, b) => {
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
    filterByStatus(state, { payload }) {
      if (!payload.length) {
        state.preorders = state.allPreorders;
      } else {
        state.preorders = state.allPreorders.filter((preorder) =>
          payload.includes(preorder.status),
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPreorders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllPreorders.fulfilled, (state, { payload }) => {
        const { content, itemsPerPage, totalItems, totalPages, currentPage } =
          payload;
        state.preorders = content;
        state.allPreorders = content;
        state.status = 'succeeded';
        state.pagination.currentPage = currentPage;
        state.pagination.itemsPerPage = itemsPerPage;
        state.pagination.totalItems = totalItems;
        state.pagination.totalPages = totalPages;
      })
      .addCase(getAllPreorders.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload.message;
        state.response = payload || 'generic error';
      })
      .addCase(deletePreorder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePreorder.fulfilled, (state, { payload }) => {
        state.status = 'deleted';
        state.response = payload.response;
        state.preorders = state.preorders.filter(
          (preorder) => preorder.id != payload.id,
        );
        state.count -= 1;
      })
      .addCase(deletePreorder.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload.message;
        state.response = payload || 'generic error';
      })
      .addCase(getUserPreoders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserPreoders.fulfilled, (state, { payload }) => {
        state.myPreorders = payload;
        state.allMyPreorders = payload;
        state.status = 'succeeded';
      })
      .addCase(getUserPreoders.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.response = payload || 'generic error';
      })
      .addCase(countPreordersByStatus.fulfilled, (state, { payload }) => {
        state.count = payload;
      })
      .addCase(countPreordersByStatus.rejected, (state, { payload }) => {
        state.response = payload || 'generic error';
      })
      .addCase(updatePreorderStatus.fulfilled, (state, { payload }) => {
        state.toast.status = 'success';
        state.toast.response = payload;
      })
      .addCase(updatePreorderStatus.rejected, (state, { payload }) => {
        state.toast.response = payload || 'generic error';
      })
      .addCase(preorderToSale.fulfilled, (state, { payload }) => {
        state.toast.status = 'success';
        state.toast.response = payload;
      })
      .addCase(preorderToSale.rejected, (state, { payload }) => {
        state.toast.status = 'failed';
        state.toast.response = payload || 'generic error';
      });
  },
});

export const {
  resetStatus,
  resetToastStatus,
  filterPreorders,
  filterByStatus,
  orderPreorders,
  setItemsPerPage,
  setPage,
} = preorderSlice.actions;
export default preorderSlice.reducer;
