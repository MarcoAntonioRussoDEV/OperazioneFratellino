import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';
import attributeReducer from './attributesSlice';
import salesReducer from './salesSlice';
import productAttributesReducer from './productAttributesSlice';
import userReducer from './userSlice';
import sidebarReducer from './sidebarSlice';
import themeReducer from './themeSlice';
import sellCartReducer from './sellCartSlice';
import cartReducer from './cartSlice';
import usersReducer from './usersSlice';
import citiesReducer from './citiesSlice';
import roleReducer from './rolesSlice';
import preorderCartReducer from './preorderCartSlice';
import statusReducer from './statusSlice';
import preorderReducer from './preorderSlice';
import logReducer from './logsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    categories: categoryReducer,
    attributes: attributeReducer,
    productAttributes: productAttributesReducer,
    sales: salesReducer,
    sidebar: sidebarReducer,
    theme: themeReducer,
    sellCart: sellCartReducer,
    cart: cartReducer,
    users: usersReducer,
    cities: citiesReducer,
    roles: roleReducer,
    preorderCart: preorderCartReducer,
    preorderStatus: statusReducer,
    preorders: preorderReducer,
    logs: logReducer,
  },
});
