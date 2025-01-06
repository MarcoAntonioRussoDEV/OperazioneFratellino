import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '@/config/axios/axiosConfig';
import { PRODUCTS_DATA } from '@/config/links/urls';

export const sellCartGetProductByCode = createAsyncThunk(
  'sellCart/sellCartGetProductByCode',
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
  const prodExist = state.sellCart.some(
    (product) => product.products === data.products,
  );
  if (prodExist) {
    state.sellCart.map((el) => {
      if (el.products === data.products) {
        if (el.quantity < product.stock) {
          return { ...el, quantity: (el.quantity += quantity) };
        } else {
          return el;
        }
      }
    });
  } else {
    state.sellCart.push(data);
  }
};

const handleDeleteItem = (state, code) => {
  state.sellCart = state.sellCart.filter(
    (product) => product.products !== code,
  );
};

const handleTotalPrice = (state) => {
  state.totalPrice = state.sellCart.reduce(
    (acc, el) => acc + el.price * el.quantity,
    0,
  );
};

const initialState = {
  sellCart: [],
  totalPrice: 0,
};

export const sellCartSlice = createSlice({
  name: 'sellCart',
  initialState,
  reducers: {
    resetCart(state) {
      state.sellCart = [];
      state.totalPrice = 0;
    },
    deleteItem(state, { payload }) {
      handleDeleteItem(state, payload);
      handleTotalPrice(state);
    },
    increaseQuantity(state, { payload }) {
      state.sellCart = state.sellCart.map((product) => {
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
      state.sellCart.forEach((product) => {
        if (product.products === payload && product.quantity > 1) {
          product.quantity -= 1;
          newCart.push(product);
        } else if (product.products !== payload) {
          newCart.push(product);
        }
      });
      state.sellCart = newCart;
      handleTotalPrice(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sellCartGetProductByCode.pending, (state) => {})
      .addCase(sellCartGetProductByCode.fulfilled, (state, { payload }) => {
        handleAddItem(state, payload);
        handleTotalPrice(state);
      })
      .addCase(sellCartGetProductByCode.rejected, (state, action) => {});
  },
});

export const { resetCart, deleteItem, increaseQuantity, decreaseQuantity } =
  sellCartSlice.actions;
export default sellCartSlice.reducer;
