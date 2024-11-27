import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '@/config/axios/axiosConfig';
import { PRODUCTS_DATA } from '@/config/links/urls';

export const getProductByCode = createAsyncThunk(
  'cart/getProductByCode',
  async (data, { rejectWithValue }) => {
    const { product_code, quantity } = data;
    try {
      const response = await axios.get(PRODUCTS_DATA.byCode + product_code);
      return { product: response.data, quantity: quantity };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  cart: [],
  totalPrice: 0,
};

export const cartSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCart(state) {
      state.cart = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductByCode.pending, (state) => {})
      .addCase(getProductByCode.fulfilled, (state, { payload }) => {
        const { product, quantity } = payload;
        const data = {
          product_code: product.code,
          price: product.selling_price,
          quantity: quantity,
        };
        const prodExist = state.cart.some(
          (product) => product.product_code === data.product_code,
        );
        if (prodExist) {
          state.cart.map((el) => {
            if (el.product_code === data.product_code) {
              if (el.quantity < product.stock) {
                state.totalPrice += product.selling_price * quantity;
                return { ...el, quantity: (el.quantity += quantity) };
              } else {
                return el;
              }
            }
          });
        } else {
          state.totalPrice += product.selling_price * quantity;
          state.cart.push(data);
        }
      })
      .addCase(getProductByCode.rejected, (state, action) => {});
  },
});

export const { resetCart, addItem } = cartSlice.actions;
export default cartSlice.reducer;
