/* 
FILE DI CONFIGURAZIONE UTILIZZATO PER LA GENERAZIONE DELLE TABELLE DELLE ENTITA'.

ENTITA'                                               [Nome entità]
|
|-fields                                              [Campi dell'entità]
| |-FIELDNAME                                         [Nome del campo]
|   |-type                                            [Tipo di dato del campo, serve per generare i dropdown nelle tabelle]
|   |-isFillable                                      [Se può essere modificato o inserito dall'utente, serve per generare i form]
|   |-relateDisplayField                              [Serve per indicare quale campo dell'entità associata recuperare per mostrarlo]
|
|-store                                               [Il nome dello store di redux associato]
*/

import { axios } from '../axios/axiosConfig';
import { z } from 'zod';
import {
  CATEGORIES_DATA,
  ATTRIBUTES_DATA,
  fetchCategoriesCode,
  SELLS_DATA,
  PRODUCTS_DATA,
} from '../links/urls';
import QrCodeGenerator from '@/components/QRCodeGenerator/QrCodeGenerator';

const id = {
  isFillable: false,
  isTableHead: true,
};

export const CATEGORY = {
  fields: {
    id,
    code: {
      isFillable: true,
      isTableHead: true,
    },
    name: {
      isFillable: true,
      isTableHead: true,
    },
    products: {
      isFillable: false,
      relateDisplayField: 'code',
      isTableHead: true,
      foreignKey: 'OTM',
    },
  },
  store: 'categories',
  formSchema: z.object({
    code: z.string().min(4).max(4),
    name: z.string().min(4),
  }),
  defaultValues: {
    code: '',
    name: '',
  },
};
export const components = { QrCodeGenerator };
export const PRODUCT = {
  fields: {
    id,
    QRCode: {
      isFillable: false,
      isTableHead: true,
      type: 'component',
      props: {
        value: 'code',
        size: '48',
      },
    },
    code: {
      isFillable: false,
      isDisabled: true,
      isTableHead: true,
    },
    name: {
      isFillable: true,
      isTableHead: true,
    },
    description: {
      isFillable: true,
      isTableHead: true,
    },
    purchase_price: {
      isFillable: true,
      isTableHead: true,
    },
    selling_price: {
      isFillable: true,
      isTableHead: true,
    },
    stock: {
      isFillable: true,
      isTableHead: true,
    },
    category: {
      isFillable: true,
      isTableHead: true,
      relateDisplayField: 'name',
      relateFetchField: 'id',
      foreignKey: 'MTO',
    },
    attributes: {
      isFillable: true,
      isTableHead: true,
      relateDisplayField: 'attributeName',
      relateDisplayValue: 'value',
      foreignKey: 'MTM',
    },
    created_at: {
      isFillable: false,
      isTableHead: true,
      type: 'date',
    },
    image: {
      isFillable: true,
      isTableHead: true,
      type: 'image',
    },
  },
  store: 'products',
  formSchema: z.object({
    code: z.string().readonly(),
    description: z.string(),
    purchase_price: z.coerce.number().positive(),
    selling_price: z.coerce.number().positive(),
    category: z.string().refine(
      async (code) => {
        try {
          const response = await axios.get(CATEGORIES_DATA.byCode + code);
          return true;
        } catch (error) {
          return false;
        }
      },
      { message: 'categoryNotFound' },
    ),
    stock: z.coerce.number().positive(),

    name: z.string().min(4, {
      message: `${'minimum'} 4 ${'characters'}`,
    }),
    existingProductAttributes: z.array(
      z.object({
        attributeName: z.string().refine(
          async (name) => {
            try {
              const response = await axios.get(ATTRIBUTES_DATA.byName + name);
              return true;
            } catch (error) {
              return false;
            }
          },
          { message: 'attributeNotFound' },
        ),
        attributeValue: z.string().min(1),
      }),
    ),
    newProductAttributes: z.array(
      z.object({
        attributeName: z.string(),
        attributeValue: z.string(),
      }),
    ),
    image: z.any(),
  }),
  defaultValues: {
    code: '',
    name: '',
    description: '',
    purchase_price: null,
    selling_price: null,
    category: null,
    stock: null,
    productAttributes: [
      { id: null, product: null, attribute: null, value: '' },
    ],
    image: '',
  },
};

export const ATTRIBUTE = {
  fields: {
    id,
    name: {
      isFillable: true,
      isTableHead: true,
    },
    products: {
      isFillable: false,
      relateDisplayField: 'code',
      isTableHead: true,
      foreignKey: 'OTM',
    },
  },
  store: 'attributes',
  formSchema: {
    name: z.string(),
  },
};

export const PRODUCT_ATTRIBUTES = {
  fields: {
    id,
    product: {
      isFillable: false,
      relateDisplayField: 'code',
    },
    attribute: {
      isFillable: true,
      relateDisplayField: 'name',
    },
    value: {
      isFillable: true,
    },
  },
  store: 'productAttributes',
  formSchema: {
    name: z.string(),
  },
};

export const SELLS = {
  fields: {
    id,
    product_code: {
      isFillable: true,
    },
    user: {
      isFillable: false,
      isTableHead: true,
    },
    quantity: {
      isFillable: true,
      isTableHead: true,
      type: 'number',
    },
    total_price: {
      isFillable: false,
      isTableHead: true,
    },
    created_at: {
      isFillable: false,
      isTableHead: true,
    },
  },
  store: 'sells',
  formSchema: z.object({
    product_code: z
      .string()
      // .min(7)
      // .max(7)
      .refine(
        async (code) => {
          try {
            const response = await axios.get(PRODUCTS_DATA.byCode + code);
            return true;
          } catch (error) {
            return false;
          }
        },
        { message: 'productNotFound' },
      ),
    quantity: z.coerce.number().positive(),
  }),
  defaultValues: {
    product_code: '',
    quantity: 1,
  },
};

export const USER = {
  fields: {
    id,
    name: {
      isFillable: true,
      isTableHead: true,
    },
    email: {
      isFillable: true,
      isTableHead: true,
    },
    password: {
      isFillable: true,
      isTableHead: false,
    },
    city: {
      isFillable: true,
      isTableHead: true,
    },
    role: {
      isFillable: true,
      isTableHead: true,
    },
    avatar: {
      isFillable: true,
      isTableHead: true,
    },
    created_at: {
      isFillable: true,
      isTableHead: true,
      type: 'data',
    },
  },
  store: 'users',
  defaultValues: {
    // name: '',
    // email: '',
    // password: '',
    // city: '',
    // role: 'USER',
    avatar: '',
    // created_at: '',
  },
  formSchema: z.object({
    avatar: z.any(),
  }),
};
