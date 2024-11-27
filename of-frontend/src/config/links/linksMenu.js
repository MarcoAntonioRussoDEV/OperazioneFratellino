import {
  House,
  ChartColumnStacked,
  Grid2x2,
  ListOrdered,
  FilePlus,
  Boxes,
  ShoppingCart,
} from 'lucide-react';
import { IoIosContact, IoIosSettings } from 'react-icons/io';

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
    subPath: {
      all: {
        path: '/products',
        icon: ALL_ICON,
        gender: 'plural',
      },
      create: {
        path: '/products/create',
        icon: CREATE_ICON,
      },
    },
  },
  categories: {
    path: '/categories',
    icon: 'Grid2x2',
    subPath: {
      all: {
        path: '/categories',
        icon: ALL_ICON,
        gender: 'female',
      },
      create: {
        path: '/categories/create',
        icon: CREATE_ICON,
      },
    },
  },
  attributes: {
    path: '/attributes',
    icon: 'Boxes',
  },
};

export const sellsMenu = {
  sell: {
    path: '/sell',
    icon: 'ShoppingCart',
    gender: 'plural',
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
  IoIosContact,
  IoIosSettings,
};
