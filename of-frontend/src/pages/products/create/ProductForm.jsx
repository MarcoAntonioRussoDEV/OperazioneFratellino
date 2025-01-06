import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import iconToast from '@/utils/toastUtils';
import { Spinner } from '@/components/ui/spinner.jsx';
import CustomFormInput from '@/components/form/CustomFormInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
  FormField,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  capitalize,
  codify,
  generateProductCode,
  useTranslateAndCapitalize,
} from '@/utils/formatUtils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ATTRIBUTE, CATEGORY, PRODUCT } from '@/config/entity/entities';
import { resetStatus, createProduct, productSlice } from '@/redux/productSlice';
import { Textarea } from '@/components/ui/textarea';
import { getAllCategories } from '@/redux/categorySlice';
import { getAllAttributes } from '@/redux/attributesSlice';
import CustomSelect from '@/components/form/CustomSelect';
import { axios, retryAttempt } from '@/config/axios/axiosConfig';
import { PRODUCTS_DATA } from '@/config/links/urls';
import { CATEGORIES_DATA } from '@/config/links/urls';
import SimpleInput from '@/components/form/SimpleInput';
import SimpleSelect from '@/components/form/SimpleSelect';
import SimpleTextarea from '@/components/form/SimpleTextarea';
import withFormContext from '@/components/HOC/withFormContext';
import { PlusIcon, Trash2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ComponentModal from '@/components/modal/ComponentModal';
import CreateCategories from '@/pages/categories/create/CreateCategories';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppHooks, useToastHooks } from '@/hooks/useAppHooks';
const EnhancedSimpleInput = withFormContext(SimpleInput);
const EnhancedSimpleSelect = withFormContext(SimpleSelect);
const EnhancedSimpleTextarea = withFormContext(SimpleTextarea);

const ProductForm = ({ product }) => {
  /* Variabili */
  const [newProductCode, setNewProductCode] =
    useState(''); /* ID dell'ultimo prodotto inserito nel database */
  const [selectedCategoryCode, setSelectedCategoryCode] =
    useState(''); /* Codice della categoria nel campo select delle categorie */
  const navigate = useNavigate();
  const location = useLocation();
  const { tc, dispatch } = useAppHooks();

  /!* CATEGORIE */;
  const { categories, status: categoryStatus } = useSelector(
    (state) => state[CATEGORY.store],
  );
  /!* ATTRIBUTI */;
  const { attributes, status: attributesStatus } = useSelector(
    (state) => state[ATTRIBUTE.store],
  );
  /!* PRODOTTI */;
  const { status: productsStatus, response: productsResponse } = useSelector(
    (state) => state[PRODUCT.store],
  );

  const methods = useForm({
    resolver: zodResolver(PRODUCT.formSchema),
    defaultValues: PRODUCT.defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isValid, errors },
  } = methods;

  const {
    fields: existingAttributeField,
    append: existingAttributeAppend,
    prepend: existingAttributePrepend,
    remove: existingAttributeRemove,
    swap: existingAttributeSwap,
    move: existingAttributeMove,
    insert: existingAttributeInsert,
    replace: existingAttributeReplace,
  } = useFieldArray({
    control,
    name: 'existingProductAttributes',
  });
  const {
    fields: newAttributeField,
    append: newAttributeAppend,
    prepend: newAttributePrepend,
    remove: newAttributeRemove,
    swap: newAttributeSwap,
    move: newAttributeMove,
    insert: newAttributeInsert,
  } = useFieldArray({
    control,
    name: 'newProductAttributes',
  });

  /!* Hooks */;

  useEffect(() => {
    fetchAll();
    return () => {
      dispatch(resetStatus());
    };
  }, []);

  const handleValues = async (product) => {
    setValue('code', product.code);
    setValue('name', product.name);
    setValue('purchasePrice', product.purchasePrice);
    setValue('sellingPrice', product.sellingPrice);
    setValue('stock', product.stock);
    setValue('description', product.description);
    const category = await axios.get(CATEGORIES_DATA.byId + product.category);
    setValue('category', category.data.code);
    setValue(`existingProductAttributes`, product.attributes);
    product.attributes?.forEach((attribute, idx) => {
      setValue(
        `existingProductAttributes.${idx}.attributeName`,
        attribute.name,
      );
      setValue(
        `existingProductAttributes.${idx}.attributeValue`,
        attribute.value,
      );
    });
  };

  useEffect(() => {
    if (product?.code != null) {
      handleValues(product);
    }
  }, [product, setValue, existingAttributeReplace]);

  useEffect(() => {
    setValue('code', newProductCode);
  }, [setValue, selectedCategoryCode, newProductCode]);

  useToastHooks(productsStatus, ['created', 'failed'], productsResponse, reset);

  useEffect(() => {
    if (productsStatus === 'created') {
      newAttributeRemove();
      existingAttributeRemove();
      reset();
    }
  }, [productsStatus]);

  //? Se ci sono dati passati da un'altra pagina, li inserisce nei campi del form
  useEffect(() => {
    if (location.state?.formData) {
      const formData = location.state.formData;
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key]);
      });
    }
  }, [location.state, setValue]);

  /!* Methods  */;
  const fetchAll = () => {
    dispatch(getAllCategories());
    dispatch(getAllAttributes());
  };

  const fetchLastCode = async (cat_code) => {
    try {
      // const response = await axios.get(PRODUCTS_DATA.byCategoryCode + cat_code);
      const response = await axios.get(CATEGORIES_DATA.byCode + cat_code);
      setNewProductCode(generateProductCode(response.data, cat_code));
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedCategoryCode(newProductCode);
    }
  };
  const handleCodeGenerator = (cat_code) => {
    fetchLastCode(cat_code);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('image', data.image[0]);
    delete data.image;
    formData.append(
      'product',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );
    dispatch(createProduct(formData));
  };

  const handleCreateCategory = () => {
    navigate('/categories/create', {
      state: { from: '/products/create', formData: getValues() },
    });
  };

  return (
    <Form {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col lg:grid lg:grid-cols-3 gap-2"
        encType="multipart/form-data"
      >
        <EnhancedSimpleInput
          name="image"
          label="image"
          type="file"
          className="col-span-full"
        />

        <EnhancedSimpleInput name="code" label="code" disabled />
        <EnhancedSimpleInput name="name" label="name" />
        <EnhancedSimpleInput
          name="purchasePrice"
          label="purchasePrice"
          type="number"
        />
        <EnhancedSimpleInput
          name="sellingPrice"
          label="sellingPrice"
          type="number"
        />
        <EnhancedSimpleInput name="stock" label="stock" type="number" />
        <div className="flex items-end">
          <EnhancedSimpleSelect
            name="category"
            label="category"
            list={categories}
            valueField="code"
            placeholder={'selectCategory'}
            status={categoryStatus}
            reFetch={getAllCategories}
            retryAttempt={retryAttempt}
            onValueChange={handleCodeGenerator}
            className="rounded-e-none border-e-0 focus:ring-0"
          >
            <Button
              variant="outline"
              type="button"
              className="p-2 rounded-s-none bg-accent-soft"
              onClick={handleCreateCategory}
            >
              <PlusIcon />
            </Button>
          </EnhancedSimpleSelect>
        </div>
        <EnhancedSimpleTextarea
          className="col-span-full"
          name="description"
          label="description"
        />

        <fieldset className="border rounded-lg p-4 col-span-3 flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-2">
          <legend>{tc('attributes')}</legend>
          <Button
            type="button"
            onClick={() => existingAttributeAppend({ name: '', value: '' })}
            variant="secondary"
          >
            <span className="truncate">{tc('addExistingAttribute')}</span>
            <PlusIcon />
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => newAttributeAppend({ name: '', value: '' })}
          >
            <span className="truncate">{tc('addAttribute')}</span>
            <PlusIcon />
          </Button>

          {existingAttributeField.map((field, idx) => (
            <div key={field.id} className="col-span-full flex gap-2">
              <EnhancedSimpleSelect
                name={`existingProductAttributes.${idx}.attributeName`}
                label="attribute"
                list={attributes}
                valueField="name"
                placeholder="selectAttribute"
                status={attributesStatus}
                reFetch={getAllAttributes}
                retryAttempt={retryAttempt}
                defaultValue={field.name}
                className="w-full"
              />
              <EnhancedSimpleInput
                name={`existingProductAttributes.${idx}.attributeValue`}
                label="value"
                defaultValue={field.value}
                className="w-full"
              />
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => {
                  existingAttributeRemove(field.id);
                }}
                className="self-end  aspect-square"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          {newAttributeField.map((field, idx) => (
            <div key={field.id} className="col-span-full flex gap-2">
              <EnhancedSimpleInput
                name={`newProductAttributes.${idx}.attributeName`}
                label="attribute"
              />
              <EnhancedSimpleInput
                name={`newProductAttributes.${idx}.attributeValue`}
                label="value"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  newAttributeRemove(field.id);
                }}
                className="self-end"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </fieldset>

        <Button
          isLoading={productsStatus === 'loading'}
          className="mt-10 col-span-3"
          // disabled={!isValid}
        >
          {product ? tc('product.edit') : tc('createProduct')}
        </Button>
      </form>
    </Form>
  );
};

ProductForm.propTypes = {
  product: PropTypes.shape({
    attributes: PropTypes.shape({
      forEach: PropTypes.func,
    }),
    category: PropTypes.number,
    code: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    purchasePrice: PropTypes.number,
    sellingPrice: PropTypes.number,
    stock: PropTypes.number,
  }),
};

export default ProductForm;
