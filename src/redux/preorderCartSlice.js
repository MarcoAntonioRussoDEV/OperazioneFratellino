import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '@/config/axios/axiosConfig';
import { PRODUCTS_DATA } from '@/config/links/urls';

export const preorderCartGetProductByCode = createAsyncThunk(
  'preorderCart/preorderCartGetProductByCode',
  async (data, { rejectWithValue }) => {
    const { product, quantity } = data;
    try {
      const response = await axios.get(PRODUCTS_DATA.byCode + product);
      return { product: response.data, quantity: quantity };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const handleAddItem = (state, payload) => {
  const { product, quantity } = payload;
  const data = {
    product: product.id,
    price: product.sellingPrice,
    quantity: quantity,
    inStock: product.stock,
  };
  const prodExist = state.preorderCart.some(
    (product) => product.product === data.product,
  );
  if (prodExist) {
    state.preorderCart.map((el) => {
      if (el.product === data.product) {
        if (el.quantity < product.stock) {
          return { ...el, quantity: (el.quantity += quantity) };
        } else {
          return el;
        }
      }
    });
  } else {
    state.preorderCart.push(data);
  }
};

const handleDeleteItem = (state, id) => {
  state.preorderCart = state.preorderCart.filter(
    (product) => product.product !== id,
  );
};

const handleTotalPrice = (state) => {
  state.totalPrice = state.preorderCart.reduce(
    (acc, el) => acc + el.price * el.quantity,
    0,
  );
};

const initialState = {
  preorderCart: [],
  totalPrice: 0,
};

export const preorderCartSlice = createSlice({
  name: 'preorderCart',
  initialState,
  reducers: {
    resetPreorderCart(state) {
      state.preorderCart = [];
      state.totalPrice = 0;
    },
    deleteItem(state, { payload }) {
      handleDeleteItem(state, payload);
      handleTotalPrice(state);
    },
    increaseQuantity(state, { payload }) {
      state.preorderCart = state.preorderCart.map((product) => {
        if (product.product === payload && product.quantity < product.inStock) {
          product.quantity += 1;
        }
        return product;
      });
      handleTotalPrice(state);
    },
    decreaseQuantity(state, { payload }) {
      const newCart = [];
      state.preorderCart.forEach((product) => {
        if (product.product === payload && product.quantity > 1) {
          product.quantity -= 1;
          newCart.push(product);
        }
      });
      state.preorderCart = newCart;
      handleTotalPrice(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(preorderCartGetProductByCode.pending, (state) => {})
      .addCase(preorderCartGetProductByCode.fulfilled, (state, { payload }) => {
        handleAddItem(state, payload);
        handleTotalPrice(state);
      })
      .addCase(preorderCartGetProductByCode.rejected, (state, action) => {});
  },
});

export const {
  resetPreorderCart,
  deleteItem,
  increaseQuantity,
  decreaseQuantity,
} = preorderCartSlice.actions;
export default preorderCartSlice.reducer;
