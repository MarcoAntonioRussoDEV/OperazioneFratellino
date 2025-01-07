const PRODUCTS_DATA = {
  all: 'products/all?',
  byId: 'products/by-id/',
  byCode: 'products/by-code/',
  create: 'products/create',
  byCategoryCode: 'products/by-category-code/',
  getImage: 'products/get-image/',
  delete: 'products/delete/',
  disable: 'products/disable/',
};

const CATEGORIES_DATA = {
  all: 'categories/all',
  byId: 'categories/by-id/',
  byCode: 'categories/by-code/',
  create: 'categories/create',
  delete: 'categories/delete/',
  edit: 'categories/edit/',
};

const ATTRIBUTES_DATA = {
  all: 'attributes/all',
  byId: 'attributes/by-id/',
  byName: 'attributes/by-name/',
};
const PRODUCT_ATTRIBUTES_DATA = {
  all: 'product-attributes/all',
  byId: 'product-attributes/',
};

const AUTH_DATA = {
  login: 'auth/login',
  logout: 'auth/logout',
  getUser: 'auth/me',
};

const SALES_DATA = {
  all: 'sales/all',
  create: 'sales/create',
  delete: 'sales/delete/',
};

const PREORDER_DATA = {
  all: 'preorders/all',
  create: 'preorders/create',
  delete: 'preorders/delete/',
  byUser: 'preorders/my-preorders/',
  countByStatus: 'preorders/count-by-status/',
  updateStatus: 'preorders/update-status/',
  toSale: 'preorders/to-sale/',
};

const USER_DATA = {
  all: 'user/all',
  create: 'user/create',
  setAvatar: 'user/set-avatar',
  getAvatar: 'user/get-avatar/',
  byEmail: 'user/by-email/',
  edit: 'user/edit-user',
};

const CLIENT_DATA = {
  all: 'client/all',
  byEmail: 'client/by-email/',
};

const ADMIN_DATA = {
  getAllUsers: 'admin/users/all',
  deleteUser: 'admin/users/delete/',
  enableUser: 'admin/users/enable/',
  resetUserPassword: 'admin/users/reset-password/',
  registerUser: "auth/register"
};

const CITY_DATA = {
  all: 'cities/all',
  byId: 'cities/by-id/',
  byName: 'cities/by-name/',
};

const ROLE_DATA = {
  all: 'roles/all',
  byName: 'roles/by-name/',
};
const STATUS_DATA = {
  all: 'status/all',
  byValue: 'status/byValue/',
};
const CART_DATA = {
  byUserEmail: 'carts/by-user-email/',
  addProduct: 'carts/add-item/',
  deleteProduct: 'carts/delete-item/',
  increaseProduct: 'carts/increase-item/',
  decreaseProduct: 'carts/decrease-item/',
  toPreorder: 'carts/to-preorder',
};

export {
  PRODUCTS_DATA,
  CATEGORIES_DATA,
  ATTRIBUTES_DATA,
  PRODUCT_ATTRIBUTES_DATA,
  AUTH_DATA,
  SALES_DATA,
  USER_DATA,
  ADMIN_DATA,
  CITY_DATA,
  ROLE_DATA,
  CLIENT_DATA,
  STATUS_DATA,
  PREORDER_DATA,
  CART_DATA,
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
    case 'users':
      return USER_DATA;
    case 'client':
      return CLIENT_DATA;
    case 'city':
      return CITY_DATA;
    case 'role':
      return ROLE_DATA;
    case 'status':
      return STATUS_DATA;
    case 'preorder':
      return PREORDER_DATA;
    case 'preorders':
      return PREORDER_DATA;
    default:
      return;
  }
}
