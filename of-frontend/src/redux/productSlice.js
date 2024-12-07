import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '../config/axios/axiosConfig';
import { PRODUCTS_DATA } from '../config/links/urls';
import { retryAttempt } from '@/config/axios/axiosConfig';
import QrCodeGenerator from '@/components/QRCodeGenerator/QrCodeGenerator';

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async ({ column, direction }) => {
    const response = await axios.get(PRODUCTS_DATA.all);
    // const response = await axios.get(
    //   `${PRODUCTS_DATA.all}${
    //     column ? 'column=' + column : ''
    //   }&direction=${direction}`,
    // );
    for (let [_, product] of Object.entries(response.data)) {
      if (product.image) {
        product.image = PRODUCTS_DATA.getImage + product.code;
      }
      product.QRCode = 'QrCodeGenerator';
      product.QRCodeValue = product.code;
    }
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
      return response.data;
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(PRODUCTS_DATA.delete + data);
      return { id: data, response: response.data };
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  products: [],
  allProducts: [],
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
    filterProduct(state, { payload }) {
      state.products = state.allProducts.filter((product) => {
        return Object.entries(product).some(([_, value]) => {
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(String(payload).toLowerCase());
        });
      });
    },
    orderProducts(state, { payload }) {
      const { column, direction } = payload;
      state.products = state.products.sort((a, b) => {
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
      .addCase(getAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.status = 'success';
        state.products = action.payload;
        state.allProducts = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'created';
        state.response = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'deleted';
        state.response = action.payload.response;
        state.products = state.products.filter(
          (product) => product.code != action.payload.id,
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.response = action.payload || 'generic error';
      });
  },
});

export const { resetStatus, filterProduct, orderProducts } =
  productSlice.actions;
export default productSlice.reducer;
