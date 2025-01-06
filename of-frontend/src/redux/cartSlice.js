import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '@/config/axios/axiosConfig';
import { CART_DATA, PRODUCTS_DATA } from '@/config/links/urls';

export const cartGetProductByCode = createAsyncThunk(
  'cart/cartGetProductByCode',
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

export const getUserCart = createAsyncThunk(
  'cart/getUserCart',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(CART_DATA.byUserEmail + data);
      return { response: response.data, userEmail: data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

/!* ADD ITEM */;
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

export const addItemToUserCart = createAsyncThunk(
  'cart/addItemToUserCart',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CART_DATA.addProduct}${data.productCode}/${data.userEmail}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

/!* DELETE ITEM */;
const handleDeleteItem = (state, productCode) => {
  state.cart.products = state.cart.products.filter(
    (product) => product.product !== productCode,
  );
  handleTotalPrice(state);
};

export const deleteItemToUserCart = createAsyncThunk(
  'cart/deleteItemToUserCart',
  async (data, { rejectWithValue, getState }) => {
    const { cart } = getState();
    const { user } = cart.cart;
    try {
      const response = await axios.post(
        `${CART_DATA.deleteProduct}${data.productCode}/${user}`,
      );
      return { response: response.data, productCode: data.productCode };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

/!* INCREASE ITEM  */;

const handleIncreaseItem = (state, productCode) => {
  state.cart.products = state.cart.products.map((product) => {
    if (product.product === productCode) {
      product.quantity += 1;
    }
    return product;
  });
  handleTotalPrice(state);
};

export const increaseItemToUserCart = createAsyncThunk(
  'cart/increaseItemToUserCart',
  async (product, { rejectWithValue, getState }) => {
    const { cart } = getState();
    const { user } = cart.cart;
    try {
      const response = await axios.post(
        `${CART_DATA.increaseProduct}${product}/${user}`,
      );
      return { response: response.data, productCode: product };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
/!* DECREASE ITEM  */;

const handleDecreaseItem = (state, productCode) => {
  const newProducts = [];
  state.cart.products.forEach((product) => {
    if (product.product === productCode && product.quantity > 1) {
      product.quantity -= 1;
      newProducts.push(product);
    } else if (product.product !== productCode) {
      newProducts.push(product);
    } else {
      deleteItemToUserCart({
        productCode,
      });
    }
  });
  state.cart.products = newProducts;
  handleTotalPrice(state);
};
export const decreaseItemToUserCart = createAsyncThunk(
  'cart/decreaseItemToUserCart',
  async (data, { rejectWithValue, getState }) => {
    const { cart } = getState();
    const { user } = cart.cart;
    try {
      const response = await axios.post(
        `${CART_DATA.decreaseProduct}${data.productCode}/${user}`,
      );
      return {
        response: response.data,
        productCode: data.productCode,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

/!* TOTAL PRICE */;

const handleTotalPrice = (state) => {
  state.totalPrice = state.cart?.products?.reduce(
    (acc, el) => acc + el.price * el.quantity,
    0,
  );
};

/!* CONVERT TO PREORDER */;

const handleConvertToPreorder = (state) => {};

export const convertToPreorder = createAsyncThunk(
  'cart/convertToPreorder',
  async (_, { rejectWithValue, getState }) => {
    const {
      cart: { cart },
    } = getState();
    try {
      const response = await axios.post(CART_DATA.toPreorder, cart);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  cart: {} /* {
    user: null,
    client: null,
    products: [
      {
        id: null,
        product: null,
        cart: null,
        price: null,
        quantity: 0,
      },
    ],
    totalPrice: 0,
    createdAt: null,
    updatedAt: null,
  },
  status: 'idle',
  response: '',
  error: '', */,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart(state) {
      state.cart = {};
      state.totalPrice = 0;
    },
    resetStatus(state) {
      (state.status = 'idle'), (state.response = ''), (state.error = '');
    },
    deleteItem(state, { payload }) {
      handleDeleteItem(state, payload);
      handleTotalPrice(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cartGetProductByCode.pending, (state) => {})
      .addCase(cartGetProductByCode.fulfilled, (state, { payload }) => {
        handleAddItem(state, payload);
        handleTotalPrice(state);
      })
      .addCase(cartGetProductByCode.rejected, (state, action) => {})
      .addCase(getUserCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        getUserCart.fulfilled,
        (state, { payload: { response, userEmail } }) => {
          state.status = 'success';
          state.cart = response;
          state.cart.user = userEmail;
          handleTotalPrice(state);
        },
      )
      .addCase(getUserCart.rejected, (state, { payload }) => {
        state.error = payload;
        state.status = 'failed';
      })
      .addCase(addItemToUserCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addItemToUserCart.fulfilled, (state, { payload }) => {
        state.status = 'added';
        getUserCart();
        state.response = payload;
        handleTotalPrice(state);
      })
      .addCase(addItemToUserCart.rejected, (state, { payload }) => {
        state.error = payload;
        state.status = 'failed';
      })
      .addCase(increaseItemToUserCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        increaseItemToUserCart.fulfilled,
        (state, { payload: { response, productCode } }) => {
          state.status = 'fulfilled';
          state.response = response;
          handleIncreaseItem(state, productCode);
        },
      )
      .addCase(increaseItemToUserCart.rejected, (state, { payload }) => {
        state.error = payload;
        state.status = 'failed';
      })
      .addCase(decreaseItemToUserCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        decreaseItemToUserCart.fulfilled,
        (state, { payload: { response, productCode } }) => {
          state.status = 'fulfilled';
          state.response = response;
          handleDecreaseItem(state, productCode);
        },
      )
      .addCase(decreaseItemToUserCart.rejected, (state, { payload }) => {
        state.error = payload;
        state.status = 'failed';
      })
      .addCase(deleteItemToUserCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        deleteItemToUserCart.fulfilled,
        (state, { payload: { response, productCode } }) => {
          state.status = 'fulfilled';
          state.response = response;
          handleDeleteItem(state, productCode);
        },
      )
      .addCase(deleteItemToUserCart.rejected, (state, { payload }) => {
        state.error = payload;
        state.status = 'failed';
      })
      .addCase(convertToPreorder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(convertToPreorder.fulfilled, (state, { payload }) => {
        state.status = 'converted';
        state.response = payload;
        state.cart = {};
      })
      .addCase(convertToPreorder.rejected, (state, { payload }) => {
        state.error = payload;
        state.status = 'failed';
      });
  },
});

export const {
  resetCart,
  deleteItem,
  increaseQuantity,
  decreaseQuantity,
  resetStatus,
} = cartSlice.actions;
export default cartSlice.reducer;
