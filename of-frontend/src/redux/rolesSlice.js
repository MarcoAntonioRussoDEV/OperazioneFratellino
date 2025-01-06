import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios, retryAttempt } from '@/config/axios/axiosConfig';
import { ROLE_DATA } from '@/config/links/urls';

export const getAllRoles = createAsyncThunk(
  'roles/getAllRoles',
  async ({ page = 0, size = -1 } = {}) => {
    const response = await axios.get(ROLE_DATA.all, {
      params: { page, size },
    });
    return response.data;
  },
);

export const createCity = createAsyncThunk(
  'roles/createCity',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(ROLE_DATA.create, data);
      return response.data;
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  roles: [],
  allRoles: [],
  status: 'idle',
  error: null,
  response: null,
  retryAttempt: 0,
};

export const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
      state.error = null;
      state.response = null;
      state.retryAttempt = 0;
    },
    orderRoles(state, { payload }) {
      const { column, direction } = payload;
      state.roles = state.roles.sort((a, b) => {
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
    filterCity(state, { payload }) {
      state.roles = state.allRoles.filter((role) => {
        return Object.entries(role).some(([_, value]) => {
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(String(payload).toLowerCase());
        });
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRoles.pending, (state) => {
        state.status = 'loading';
        state.retryAttempt = retryAttempt;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.status = 'success';
        state.roles = action.payload;
        state.allRoles = action.payload;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCity.fulfilled, (state, action) => {
        state.status = 'success';
        state.response = action.payload;
      })
      .addCase(createCity.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      });
  },
});

export const { resetStatus, orderRoles, filterCity } = roleSlice.actions;
export default roleSlice.reducer;
