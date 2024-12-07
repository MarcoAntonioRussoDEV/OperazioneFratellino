import axios from 'axios';

export const BASE_URL = 'https://localhost:8443/api/';

const PRODUCTS_DATA = {
  all: BASE_URL + 'products/all?',
  byId: BASE_URL + 'products/by-id/',
  byCode: BASE_URL + 'products/by-code/',
  create: BASE_URL + 'products/create',
  byCategoryCode: BASE_URL + 'products/by-category-code/',
  getImage: BASE_URL + 'products/get-image/',
  delete: BASE_URL + 'products/delete/',
};

const CATEGORIES_DATA = {
  all: BASE_URL + 'categories/all',
  byId: BASE_URL + 'categories/by-id/',
  byCode: BASE_URL + 'categories/by-code/',
  create: BASE_URL + 'categories/create',
  delete: BASE_URL + 'categories/delete/',
};

const ATTRIBUTES_DATA = {
  all: BASE_URL + 'attributes/all',
  byId: BASE_URL + 'attributes/by-id/',
  byName: BASE_URL + 'attributes/by-name/',
};
const PRODUCT_ATTRIBUTES_DATA = {
  all: BASE_URL + 'product-attributes/all',
  byId: BASE_URL + 'product-attributes/',
};

const AUTH_DATA = {
  login: BASE_URL + 'auth/login',
  logout: BASE_URL + 'auth/logout',
  getUser: BASE_URL + 'auth/me',
};

const SALES_DATA = {
  all: BASE_URL + 'sales/all',
  create: BASE_URL + 'sales/create',
  delete: BASE_URL + 'sales/delete/',
};

const USER_DATA = {
  all: BASE_URL + 'user/all',
  create: BASE_URL + 'user/create',
  setAvatar: BASE_URL + 'user/set-avatar',
  getAvatar: BASE_URL + 'user/get-avatar/',
  byEmail: BASE_URL + 'user/by-email/',
};

export {
  PRODUCTS_DATA,
  CATEGORIES_DATA,
  ATTRIBUTES_DATA,
  PRODUCT_ATTRIBUTES_DATA,
  AUTH_DATA,
  SALES_DATA,
  USER_DATA,
};

export const fetchCategoriesCode = async () => {
  const response = await fetch(CATEGORIES_DATA.all);
  const data = await response.json();
  return data.map((category) => category.code);
};

export default function resolveEntityURLS(entity) {
  switch (entity) {
    case 'category':
      return CATEGORIES_DATA;
    case 'categories':
      return CATEGORIES_DATA;
    case 'product':
      return PRODUCTS_DATA;
    case 'products':
      return PRODUCTS_DATA;
    case 'attribute':
      return ATTRIBUTES_DATA;
    case 'attributes':
      return ATTRIBUTES_DATA;
    case 'productAttributes':
      return PRODUCT_ATTRIBUTES_DATA;
    case 'user':
      return USER_DATA;
    default:
      return BASE_URL;
  }
}
