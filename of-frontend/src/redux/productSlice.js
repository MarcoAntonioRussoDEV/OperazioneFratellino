import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '../config/axios/axiosConfig';
import { PRODUCTS_DATA } from '../config/links/urls';
import { retryAttempt } from '@/config/axios/axiosConfig';
import QrCodeGenerator from '@/components/QRCodeGenerator/QrCodeGenerator';

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async () => {
    const response = await axios.get(PRODUCTS_DATA.all);
    for (let [_, product] of Object.entries(response.data)) {
      if (product.image) {
        product.image = PRODUCTS_DATA.getImage + product.code;
      }
      product.QRCode = 'QrCodeGenerator';
      product.QRCodeValue = product.code;
    }
    console.log(response.data);
    return response.data;
  },
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(PRODUCTS_DATA.create, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  products: [],
  status: 'idle',
  error: null,
  response: null,
};

export const productSlice = createSlice({
  name: 'products',
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
      .addCase(getAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'success';
        state.response = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = productSlice.actions;
export default productSlice.reducer;
