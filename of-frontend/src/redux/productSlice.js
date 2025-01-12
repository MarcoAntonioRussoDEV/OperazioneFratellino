import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '../config/axios/axiosConfig';
import { PRODUCTS_DATA } from '../config/links/urls';
import { retryAttempt } from '@/config/axios/axiosConfig';
import QrCodeGenerator from '@/components/QRCodeGenerator/QrCodeGenerator';
import { blobToSrc } from '@/utils/imageUtils';

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async ({ page = 0, size = -1 } = {}) => {
    const response = await axios.get(PRODUCTS_DATA.all, {
      params: { page, size },
    });
    for (let [_, product] of Object.entries(response.data.content)) {
      if (product.image) {
        product.image = blobToSrc(product.image);
      } else {
        product.image = '/img-placeholder.webp';
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

export const toggleDeleteProduct = createAsyncThunk(
  'products/toggleDeleteProduct',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.patch(PRODUCTS_DATA.disable + data);
      dispatch(getAllProducts());
      return { id: data, response: response.data };
    } catch (error) {
      console.log(error.status);
      return rejectWithValue(error.response.data);
    }
  },
);

export const getProductByCode = createAsyncThunk(
  'products/getProductByCode',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(PRODUCTS_DATA.byCode + data);
      if (response.data.image) {
        response.data.image = blobToSrc(response.data.image);
      } else {
        response.data.image = '/img-placeholder.webp';
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message.data);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (code, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(PRODUCTS_DATA.delete + code);
      dispatch(getAllProducts());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  products: [],
  allProducts: [],
  product: {},
  status: 'idle',
  filterDeleted: true,
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

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProducts(state) {
      state.products = [];
      state.status = 'idle';
      state.response = null;
    },
    resetToastStatus(state) {
      state.toast.status = null;
      state.toast.error = null;
      state.toast.response = null;
    },
    resetStatus(state) {
      state.status = 'idle';
      state.error = null;
      state.response = null;
    },
    setPage(state, { payload }) {
      state.pagination.currentPage = payload;
    },
    setItemsPerPage(state, { payload }) {
      state.pagination.itemsPerPage = payload;
    },
    filterProduct(state, { payload }) {
      // state.products = state.allProducts.filter((product) => {
      //   return Object.entries(product).some(([_, value]) => {
      //     const stringValue = String(value).toLowerCase();
      //     return stringValue.includes(String(payload).toLowerCase());
      //   });
      // });

      if (state.filterDeleted) {
        state.products = state.allProducts.filter((product) => {
          if (!product.isDeleted) {
            return Object.entries(product).some(([_, value]) => {
              const stringValue = String(value).toLowerCase();
              return stringValue.includes(String(payload).toLowerCase());
            });
          }
        });
      } else {
        state.products = state.allProducts.filter((product) => {
          return Object.entries(product).some(([_, value]) => {
            const stringValue = String(value).toLowerCase();
            return stringValue.includes(String(payload).toLowerCase());
          });
        });
      }
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
    filterDeletedProducts(state) {
      state.products = state.products.filter((product) => !product.isDeleted);
      state.filterDeleted = true;
    },
    unfilterDeletedProducts(state) {
      state.products = state.allProducts;
      state.filterDeleted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllProducts.fulfilled, (state, { payload }) => {
        const { content, currentPage, itemsPerPage, totalItems, totalPages } =
          payload;
        state.status = 'success';
        state.allProducts = content;
        state.pagination.currentPage = currentPage;
        state.pagination.itemsPerPage = itemsPerPage;
        state.pagination.totalItems = totalItems;
        state.pagination.totalPages = totalPages;
        state.products = state.allProducts.filter((product) => {
          if (state.filterDeleted) {
            return !product.isDeleted;
          } else {
            return product;
          }
        });
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
        state.toast.status = 'created';
        state.toast.response = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.toast.status = 'failed';
        state.response = action.payload || 'generic error';
        state.error = action.error.message;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.toast.status = 'deleted';
        state.toast.response = action.payload;
        state.products = state.allProducts.filter((product) => {
          if (state.filterDeleted) {
            return !product.isDeleted;
          } else {
            return product;
          }
        });
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.toast.status = 'failed';
        state.toast.response = action.payload || 'generic error';
        state.error = action.error.message;
      })
      .addCase(toggleDeleteProduct.fulfilled, (state, action) => {
        state.toast.status = 'deleted';
        state.toast.response = action.payload.response;
        state.products = state.allProducts.filter((product) => {
          if (state.filterDeleted) {
            return !product.isDeleted;
          } else {
            return product;
          }
        });
      })
      .addCase(toggleDeleteProduct.rejected, (state, action) => {
        state.toast.status = 'failed';
        state.response = action.payload || 'generic error';
      })
      .addCase(getProductByCode.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProductByCode.fulfilled, (state, { payload }) => {
        state.status = 'success';
        state.product = payload;
      })
      .addCase(getProductByCode.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.response = payload || 'generic error';
      });
  },
});

export const {
  resetStatus,
  filterProduct,
  orderProducts,
  resetProducts,
  unfilterDeletedProducts,
  filterDeletedProducts,
  setItemsPerPage,
  setPage,
  resetToastStatus,
} = productSlice.actions;
export default productSlice.reducer;
