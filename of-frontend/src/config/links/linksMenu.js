import {
  House,
  ChartColumnStacked,
  Grid2x2,
  ListOrdered,
  FilePlus,
  Boxes,
  ShoppingCart,
  GalleryVerticalEnd,
  ShoppingBasket,
  Gift,
} from 'lucide-react';
import { IoIosContact, IoIosSettings } from 'react-icons/io';

import { USER_ROLES } from '@/utils/userRoles';
import { countPreordersByStatus } from '@/redux/preorderSlice';

const ALL_ICON = 'ListOrdered';
const CREATE_ICON = 'FilePlus';

export const linksMenu = {
  home: {
    // name: 'home',
    path: '/',
    icon: 'House',
  },
  products: {
    // name: 'home',
    path: '/products',
    icon: 'ChartColumnStacked',
    requiredRole: USER_ROLES.AUTH,
    subPath: {
      all: {
        path: '/products',
        icon: ALL_ICON,
        gender: 'plural',
        requiredRole: USER_ROLES.AUTH,
      },
      create: {
        path: '/products/create',
        icon: CREATE_ICON,
        requiredRole: USER_ROLES.OPERATOR,
      },
    },
  },
  categories: {
    path: '/categories',
    icon: 'Grid2x2',
    requiredRole: USER_ROLES.OPERATOR,
    subPath: {
      all: {
        path: '/categories',
        icon: ALL_ICON,
        gender: 'female',
        requiredRole: USER_ROLES.OPERATOR,
      },
      create: {
        path: '/categories/create',
        icon: CREATE_ICON,
        requiredRole: USER_ROLES.OPERATOR,
      },
    },
  },
  // attributes: {
  //   path: '/attributes',
  //   icon: 'Boxes',
  //   requiredRole: USER_ROLES.DEVELOPER,
  // },
};

export const salesMenu = {
  sale: {
    path: '/sale/create',
    icon: 'Gift',
    gender: 'plural',
    requiredRole: USER_ROLES.OPERATOR,
    subPath: {
      all: {
        path: '/sale',
        icon: ALL_ICON,
        gender: 'female',
        requiredRole: USER_ROLES.OPERATOR,
      },
      create: {
        path: 'sale/create',
        icon: CREATE_ICON,
        requiredRole: USER_ROLES.OPERATOR,
      },
    },
  },
};

export const preordersMenu = {
  preorder: {
    path: '/preorder/myPreorders',
    icon: 'ShoppingCart',
    gender: 'plural',
    requiredRole: USER_ROLES.USER,
    subPath: {
      all: {
        path: '/preorder',
        icon: ALL_ICON,
        badge: {
          function: countPreordersByStatus,
          store: 'preorders',
          state: 'count',
        },
        gender: 'plural',
        requiredRole: USER_ROLES.OPERATOR,
      },
      create: {
        path: 'preorder/create',
        icon: CREATE_ICON,
        requiredRole: USER_ROLES.OPERATOR,
      },
      cart: {
        path: 'preorder/cart',
        icon: 'ShoppingBasket',
        requiredRole: USER_ROLES.USER,
      },
      myPreorders: {
        path: 'preorder/myPreorders',
        icon: 'GalleryVerticalEnd',
        requiredRole: USER_ROLES.USER,
      },
    },
  },
};

export const icons = {
  House,
  ChartColumnStacked,
  Grid2x2,
  ListOrdered,
  FilePlus,
  Boxes,
  ShoppingCart,
  GalleryVerticalEnd,
  IoIosContact,
  IoIosSettings,
  ShoppingBasket,
  Gift,
};
