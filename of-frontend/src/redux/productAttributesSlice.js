import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios, retryAttempt } from '@/config/axios/axiosConfig';
import { PRODUCT_ATTRIBUTES_DATA } from '@/config/links/urls';

export const getAllProductAttributes = createAsyncThunk(
  'productAttributes/getAllProductAttributes',
  async () => {
    const response = await axios.get(PRODUCT_ATTRIBUTES_DATA.all);
    return response.data;
  },
);

export const createProductAttribute = createAsyncThunk(
  'productAttributes/createProductAttribute',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(PRODUCT_ATTRIBUTES_DATA.create, data);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  productAttributes: [],
  status: 'idle',
  error: null,
  response: null,
  retryAttempt: 0,
};

export const productAttributesSlice = createSlice({
  name: 'productAttributes',
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
      .addCase(getAllProductAttributes.pending, (state) => {
        state.status = 'loading';
        state.retryAttempt = retryAttempt;
      })
      .addCase(getAllProductAttributes.fulfilled, (state, action) => {
        state.status = 'success';
        state.productAttributes = action.payload;
      })
      .addCase(getAllProductAttributes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createProductAttribute.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProductAttribute.fulfilled, (state, action) => {
        state.status = 'success';
        state.response = action.payload;
      })
      .addCase(createProductAttribute.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = productAttributesSlice.actions;
export default productAttributesSlice.reducer;
