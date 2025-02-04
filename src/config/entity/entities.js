import { axios } from '../axios/axiosConfig';
import { z } from 'zod';
import {
  CATEGORIES_DATA,
  ATTRIBUTES_DATA,
  fetchCategoriesCode,
  SALES_DATA,
  PRODUCTS_DATA,
  CITY_DATA,
  ROLE_DATA,
  USER_DATA,
  CLIENT_DATA,
  STATUS_DATA,
} from '../links/urls';
import QrCodeGenerator from '@/components/QRCodeGenerator/QrCodeGenerator';
import SendMail from '@/components/SendMail';

const id = {
  isFillable: false,
  isTableHead: true,
};

const actions = {
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
      relateEntity: 'products',
      relateDisplayField: 'code',
      isTableHead: true,
      foreignKey: 'OTM',
    },
    actions,
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
export const components = { QrCodeGenerator, SendMail };
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
    reservedPreorders: {
      isFillable: false,
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
      relateDisplayField: 'name',
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
    },
    actions,
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
          if (code) {
            try {
              const response = await axios.get(CATEGORIES_DATA.byCode + code);
              return true;
            } catch (error) {
              return false;
            }
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
    client: {
      isFillable: true,
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
    sendDownloadMail: {
      isFillable: false,
      isTableHead: true,
      type: 'component',
      props: {
        value: 'code',
        size: '48',
      },
    },
  },
  store: 'sales',
  formSchema: z
    .object({
      products: z.string().refine(
        async (code) => {
          if (code) {
            try {
              const response = await axios.get(PRODUCTS_DATA.byCode + code);
              return true;
            } catch (error) {
              return false;
            }
          }
        },
        { message: 'productNotFound' },
      ),
      quantity: z.coerce.number().positive(),
    })
    .superRefine(
      async (values, context) => {
        const { products, quantity } = values;
        if (products && quantity) {
          try {
            const response = await axios.get(PRODUCTS_DATA.byCode + products);
            if (quantity > response.data.stock) {
              context.addIssue({
                path: ['quantity'],
                message:
                  'La quantità richiesta supera la quantità disponibile.',
              });
            }
          } catch (error) {
            context.addIssue({
              path: ['products'],
              message: 'Errore nel recupero del prodotto',
            });
          }
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
    id: {
      isFillable: false,
      isTableHead: false,
    },
    avatar: {
      isFillable: true,
      isTableHead: true,
      type: 'image',
      drawer: {
        title: 'name',
        description: 'email',
      },
    },
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
    phone: {
      isFillable: true,
      isTableHead: true,
    },
    city: {
      isFillable: true,
      isTableHead: true,
    },
    role: {
      isFillable: true,
      isTableHead: true,
    },
    cart: {
      isFillable: false,
      isTableHead: false,
    },
    createdAt: {
      isFillable: false,
      isTableHead: true,
      type: 'date',
    },
    isDeleted: {
      isFillable: false,
      isTableHead: false,
    },
    isFirstAccess: {
      isFillable: false,
      isTableHead: false,
    },
    actions,
  },
  store: 'users',
  defaultValues: {
    name: '',
    email: '',
    password: '',
    city: '',
    role: 'USER',
    avatar: '',
    createdAt: '',
  },
  formSchema: z.object({
    avatar: z.any(),
    name: z.string().min(4),
    email: z.string().email(),
    phone: z.string().min(10).max(10),
    password: z.string().min(8),
    city: z.string().min(4),
    role: z
      .string()
      .min(2)
      .refine(async (roleName) => {
        try {
          const response = axios.get(ROLE_DATA.byName + roleName);
          return true;
        } catch (error) {
          return false;
        }
      }),
  }),
  deleteKey: 'email',
};

export const PREORDER = {
  fields: {
    id,
    products: {
      isFillable: false,
      relateDisplayField: 'product',
      isTableHead: true,
      foreignKey: 'OTM',
      relateDisplayValue: 'quantity',
      relateEntity: 'products',
    },
    user: {
      isTableHead: true,
      isFillable: true,
      foreignKey: 'MTO',
      relateDisplayField: 'name',
      relateFetchField: 'email',
    },
    client: {
      isTableHead: true,
      isFillable: true,
      foreignKey: 'MTO',
      relateDisplayField: 'name',
      relateFetchField: 'email',
    },
    totalPrice: {
      isTableHead: true,
      isFillable: false,
    },
    status: {
      isTableHead: true,
      isFillable: true,
    },
    createdAt: {
      isTableHead: true,
      isFillable: false,
      type: 'date',
    },
    actions,
  },
  store: 'preorders',
  defaultValues: {
    user: '',
    client: '',
    totalPrice: 0,
    status: 'PENDING',
    createdAt: '',
  },
  formSchema: z.object({
    user: z
      .string()
      .email()
      .refine(async (email) => {
        try {
          const response = await axios.get(USER_DATA.byEmail + email);
          return true;
        } catch (error) {
          return false;
        }
      }),
    client: z
      .string()
      .email()
      .refine(async (email) => {
        try {
          const response = await axios.get(CLIENT_DATA.byEmail + email);
          return true;
        } catch (error) {
          return false;
        }
      }),
    totalPrice: z.coerce.number(),
    status: z.string().refine(async (value) => {
      try {
        const response = await axios.get(STATUS_DATA.byValue + value);
        return true;
      } catch (error) {
        return false;
      }
    }),
  }),
  deleteKey: 'id',
};

export const PREORDER_FORM = {
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
    clientName: {
      isFillable: true,
      isTableHead: true,
      relateDisplayField: 'name',
      relateFetchField: 'email',
      foreignKey: 'MTO',
    },
    clientEmail: {
      isFillable: true,
      isTableHead: true,
      relateDisplayField: 'name',
      relateFetchField: 'email',
      foreignKey: 'MTO',
    },
  },
  store: 'sales',
  formSchema: z.object({
    product: z.string().refine(
      async (code) => {
        if (code) {
          try {
            const response = await axios.get(PRODUCTS_DATA.byCode + code);
            return true;
          } catch (error) {
            return false;
          }
        } else {
          return false;
        }
      },

      { message: 'productNotFound' },
    ),
    quantity: z.coerce.number().positive(),
  }),

  defaultValues: {
    products: '',
    quantity: 1,
    status: 'PENDING',
  },
  deleteKey: 'id',
};
