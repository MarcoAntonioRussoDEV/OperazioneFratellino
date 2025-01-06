import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios, retryAttempt } from '@/config/axios/axiosConfig';
import { ATTRIBUTES_DATA } from '@/config/links/urls';

export const getAllAttributes = createAsyncThunk(
  'attributes/getAllAttributes',
  async ({ page = 0, size = -1 } = {}) => {
    const response = await axios.get(ATTRIBUTES_DATA.all, {
      params: { page, size },
    });
    response.data.forEach((el) => delete el.productAttributes);
    return response.data;
  },
);

export const createAttribute = createAsyncThunk(
  'attributes/createAttribute',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(ATTRIBUTES_DATA.create, data);
      return response.data;
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  attributes: [],
  allAttributes: [],
  status: 'idle',
  error: null,
  response: null,
  retryAttempt: 0,
  toast: {
    status: null,
    response: null,
    error: null,
  },
};

export const attributeSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
      state.error = null;
      state.response = null;
      state.retryAttempt = 0;
    },
    resetToastStatus(state) {
      state.toast.status = null;
      state.toast.response = null;
      state.toast.error = null;
    },
    orderAttributes(state, { payload }) {
      const { column, direction } = payload;
      state.attributes = state.attributes.sort((a, b) => {
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
    filterAttribute(state, { payload }) {
      state.attributes = state.allAttributes.filter((attribute) => {
        return Object.entries(attribute).some(([_, value]) => {
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(String(payload).toLowerCase());
        });
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAttributes.pending, (state) => {
        state.status = 'loading';
        state.retryAttempt = retryAttempt;
      })
      .addCase(getAllAttributes.fulfilled, (state, action) => {
        state.status = 'success';
        state.attributes = action.payload;
        state.allAttributes = action.payload;
      })
      .addCase(getAllAttributes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createAttribute.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAttribute.fulfilled, (state, action) => {
        state.status = 'success';
        state.response = action.payload;
      })
      .addCase(createAttribute.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      });
  },
});

export const {
  resetStatus,
  resetToastStatus,
  orderAttributes,
  filterAttribute,
} = attributeSlice.actions;
export default attributeSlice.reducer;
