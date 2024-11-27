import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios, retryAttempt } from '@/config/axios/axiosConfig';
import { ATTRIBUTES_DATA } from '@/config/links/urls';

export const getAllAttributes = createAsyncThunk(
  'attributes/getAllAttributes',
  async () => {
    const response = await axios.get(ATTRIBUTES_DATA.all);
    response.data.forEach((el) => delete el.productAttributes);
    return response.data;
  },
);

export const createAttribute = createAsyncThunk(
  'attributes/createAttribute',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(ATTRIBUTES_DATA.create, data);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  attributes: [],
  status: 'idle',
  error: null,
  response: null,
  retryAttempt: 0,
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

export const { resetStatus } = attributeSlice.actions;
export default attributeSlice.reducer;
