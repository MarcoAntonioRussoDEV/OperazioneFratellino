import axios from 'axios';

export const BASE_URL = 'https://localhost:8443/api/';

const PRODUCTS_DATA = {
  all: BASE_URL + 'products/all',
  byId: BASE_URL + 'products/by-id/',
  byCode: BASE_URL + 'products/by-code/',
  create: BASE_URL + 'products/create',
  byCategoryCode: BASE_URL + 'products/by-category-code/',
  getImage: BASE_URL + 'products/get-image/',
};

const CATEGORIES_DATA = {
  all: BASE_URL + 'categories/all',
  byId: BASE_URL + 'categories/by-id/',
  byCode: BASE_URL + 'categories/by-code/',
  create: BASE_URL + 'categories/create',
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
};

const SELLS_DATA = {
  all: BASE_URL + 'sells/all',
  create: BASE_URL + 'sells/create',
};

const USER_DATA = {
  all: BASE_URL + 'user/all',
  create: BASE_URL + 'user/create',
  setAvatar: BASE_URL + 'user/set-avatar',
  getAvatar: BASE_URL + 'user/get-avatar/',
};

export {
  PRODUCTS_DATA,
  CATEGORIES_DATA,
  ATTRIBUTES_DATA,
  PRODUCT_ATTRIBUTES_DATA,
  AUTH_DATA,
  SELLS_DATA,
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
    default:
      return BASE_URL;
  }
}
