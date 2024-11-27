import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';
import attributeReducer from './attributesSlice';
import sellsReducer from './sellsSlice';
import productAttributesReducer from './productAttributesSlice';
import userReducer from './userSlice';
import sidebarReducer from './sidebarSlice';
import themeReducer from './themeSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    categories: categoryReducer,
    attributes: attributeReducer,
    productAttributes: productAttributesReducer,
    sells: sellsReducer,
    sidebar: sidebarReducer,
    theme: themeReducer,
    cart: cartReducer,
  },
});
