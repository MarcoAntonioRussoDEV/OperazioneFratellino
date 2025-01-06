import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios, retryAttempt } from '@/config/axios/axiosConfig';
import { STATUS_DATA } from '@/config/links/urls';

export const getAllStatus = createAsyncThunk(
  'status/getAllStatus',
  async ({ page = 0, size = -1 } = {}) => {
    const response = await axios.get(STATUS_DATA.all, {
      params: { page, size },
    });
    return response.data;
  },
);

export const createStatus = createAsyncThunk(
  'status/createStatus',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(STATUS_DATA.create, data);
      return response.data;
    } catch (error) {
      console.log(error.fetchStatus);
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  status: [],
  allStatus: [],
  fetchStatus: 'idle',
  error: null,
  response: null,
  retryAttempt: 0,
};

export const roleSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    resetStatus(state) {
      state.fetchStatus = 'idle';
      state.error = null;
      state.response = null;
      state.retryAttempt = 0;
    },
    orderStatus(state, { payload }) {
      const { column, direction } = payload;
      state.status = state.status.sort((a, b) => {
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
    filterStatus(state, { payload }) {
      state.status = state.allStatus.filter((role) => {
        return Object.entries(role).some(([_, value]) => {
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(String(payload).toLowerCase());
        });
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllStatus.pending, (state) => {
        state.fetchStatus = 'loading';
        state.retryAttempt = retryAttempt;
      })
      .addCase(getAllStatus.fulfilled, (state, action) => {
        state.fetchStatus = 'success';
        state.status = action.payload;
        state.allStatus = action.payload;
      })
      .addCase(getAllStatus.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(createStatus.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(createStatus.fulfilled, (state, action) => {
        state.fetchStatus = 'success';
        state.response = action.payload;
      })
      .addCase(createStatus.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      });
  },
});

export const { resetStatus, orderStatus, filterStatus } = roleSlice.actions;
export default roleSlice.reducer;
