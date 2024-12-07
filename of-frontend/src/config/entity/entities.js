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
  SALES_DATA,
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
  deleteKey: 'id',
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
    purchasePrice: {
      isFillable: true,
      isTableHead: true,
      currency: '€',
    },
    sellingPrice: {
      isFillable: true,
      isTableHead: true,
      currency: '€',
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
      foreignKey: 'EAV',
    },
    createdAt: {
      isFillable: false,
      isTableHead: true,
      type: 'date',
    },
    image: {
      isFillable: true,
      isTableHead: true,
      type: 'image',
      drawer: {
        title: 'name',
        description: 'code',
      },
    },
  },
  store: 'products',
  formSchema: z
    .object({
      code: z.string().readonly(),
      description: z.string(),
      purchasePrice: z.coerce.number().positive(),
      sellingPrice: z.coerce.number().positive(),
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
      existingProductAttributes: z
        .array(
          z.object({
            attributeName: z.string().refine(
              async (name) => {
                try {
                  const response = await axios.get(
                    ATTRIBUTES_DATA.byName + name,
                  );
                  return true;
                } catch (error) {
                  return false;
                }
              },
              { message: 'attributeNotFound' },
            ),
            attributeValue: z.string().min(1),
          }),
        )
        .optional(),
      newProductAttributes: z
        .array(
          z.object({
            attributeName: z.string(),
            attributeValue: z.string(),
          }),
        )
        .optional(),
      image: z.any(),
    })
    .superRefine(async (values, context) => {
      const { purchasePrice, sellingPrice } = values;

      if (purchasePrice >= sellingPrice) {
        context.addIssue({
          path: ['sellingPrice'],
          message:
            "Il prezzo d'acquisto non può essere superiore al prezzo di vendita",
        });
      }
    }),
  defaultValues: {
    code: '',
    name: '',
    description: '',
    purchasePrice: null,
    sellingPrice: null,
    category: null,
    stock: null,
    image: '',
  },
  deleteKey: 'code',
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

export const SALES = {
  fields: {
    id,
    products: {
      isFillable: true,
      isTableHead: true,
      relateDisplayField: 'product',
      relateDisplayValue: 'quantity',
      foreignKey: 'EAV',
    },
    quantity: {
      isFillable: true,
      isTableHead: false,
      type: 'number',
    },
    user: {
      isFillable: false,
      isTableHead: true,
      relateDisplayField: 'name',
      relateFetchField: 'email',
      foreignKey: 'MTO',
    },
    sellingPrice: {
      isFillable: false,
      isTableHead: true,
      currency: '€',
    },
    profit: {
      isFillable: false,
      isTableHead: true,
      currency: '€',
    },
    createdAt: {
      isFillable: false,
      isTableHead: true,
      type: 'date',
    },
  },
  store: 'sales',
  formSchema: z
    .object({
      products: z
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
    })
    .superRefine(
      async (values, context) => {
        const { products, quantity } = values;

        try {
          const response = await axios.get(PRODUCTS_DATA.byCode + products);
          if (quantity > response.data.stock) {
            context.addIssue({
              path: ['quantity'],
              message: 'La quantità richiesta supera la quantità disponibile.',
            });
          }
        } catch (error) {
          context.addIssue({
            path: ['products'],
            message: 'Errore nel recupero del prodotto',
          });
        }
      },
      { message: 'productNotFound' },
    ),

  defaultValues: {
    products: '',
    quantity: 1,
  },
  deleteKey: 'id',
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
    createdAt: {
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
    // createdAt: '',
  },
  formSchema: z.object({
    avatar: z.any(),
  }),
};
