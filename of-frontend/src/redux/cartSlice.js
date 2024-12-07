import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '@/config/axios/axiosConfig';
import { PRODUCTS_DATA } from '@/config/links/urls';

export const getProductByCode = createAsyncThunk(
  'cart/getProductByCode',
  async (data, { rejectWithValue }) => {
    const { products, quantity } = data;
    try {
      const response = await axios.get(PRODUCTS_DATA.byCode + products);
      return { product: response.data, quantity: quantity };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const handleAddItem = (state, payload) => {
  const { product, quantity } = payload;
  const data = {
    products: product.code,
    price: product.sellingPrice,
    quantity: quantity,
    inStock: product.stock,
  };
  const prodExist = state.cart.some(
    (product) => product.products === data.products,
  );
  if (prodExist) {
    state.cart.map((el) => {
      if (el.products === data.products) {
        if (el.quantity < product.stock) {
          return { ...el, quantity: (el.quantity += quantity) };
        } else {
          return el;
        }
      }
    });
  } else {
    state.cart.push(data);
  }
};

const handleDeleteItem = (state, code) => {
  state.cart = state.cart.filter((product) => product.products !== code);
};

const handleTotalPrice = (state) => {
  state.totalPrice = state.cart.reduce(
    (acc, el) => acc + el.price * el.quantity,
    0,
  );
};

const initialState = {
  cart: [],
  totalPrice: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart(state) {
      state.cart = [];
      state.totalPrice = 0;
    },
    deleteItem(state, { payload }) {
      handleDeleteItem(state, payload);
      handleTotalPrice(state);
    },
    increaseQuantity(state, { payload }) {
      state.cart = state.cart.map((product) => {
        if (
          product.products === payload &&
          product.quantity < product.inStock
        ) {
          product.quantity += 1;
        }
        return product;
      });
      handleTotalPrice(state);
    },
    decreaseQuantity(state, { payload }) {
      const newCart = [];
      state.cart.forEach((product) => {
        if (product.products === payload && product.quantity > 1) {
          product.quantity -= 1;
          newCart.push(product);
        }
      });
      state.cart = newCart;
      handleTotalPrice(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductByCode.pending, (state) => {})
      .addCase(getProductByCode.fulfilled, (state, { payload }) => {
        handleAddItem(state, payload);
        handleTotalPrice(state);
      })
      .addCase(getProductByCode.rejected, (state, action) => {});
  },
});

export const { resetCart, deleteItem, increaseQuantity, decreaseQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
