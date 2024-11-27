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
} from '@/utils/FormatUtils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { PRODUCT } from '@/config/entity/entities';
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
const EnhancedSimpleInput = withFormContext(SimpleInput);
const EnhancedSimpleSelect = withFormContext(SimpleSelect);
const EnhancedSimpleTextarea = withFormContext(SimpleTextarea);
const ProductForm = () => {
  /* Variabili */
  const [newProductCode, setNewProductCode] =
    useState(''); /* ID dell'ultimo prodotto inserito nel database */
  const [selectedCategoryCode, setSelectedCategoryCode] =
    useState(''); /* Codice della categoria nel campo select delle categorie */
  const [currentAttempt, setCurrentAttempt] =
    useState(0); /* Tentativo del refetch di axios retry */
  /!* CATEGORIE */;
  const {
    categories,
    status: categoryStatus,
    error: categoryError,
    retryAttempt: categoryRetryAttempt,
    isRetrying,
  } = useSelector((state) => state.categories);
  /!* ATTRIBUTI */;
  const {
    attributes,
    status: attributesStatus,
    error: attributesError,
    retryAttempt: attributesRetryAttempt,
  } = useSelector((state) => state.attributes);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const tc =
    useTranslateAndCapitalize(); /* Custom Hook per la traduzione e la capitalizzazione delle parole */
  const methods = useForm({
    resolver: zodResolver(PRODUCT.formSchema),
    defaultValues: PRODUCT.defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    register,
    getFieldState,
    reset,
    setValue,
    formState: { isValid, errors },
  } = methods;

  const {
    products,
    status: productsStatus,
    error: productsError,
    response: productsResponse,
  } = useSelector((state) => state[PRODUCT.store]);

  const {
    fields: existingAttributeField,
    append: existingAttributeAppend,
    prepend: existingAttributePrepend,
    remove: existingAttributeRemove,
    swap: existingAttributeSwap,
    move: existingAttributeMove,
    insert: existingAttributeInsert,
  } = useFieldArray({
    control,
    name: 'existingProductAttributes', // unique name for your Field Array
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
    name: 'newProductAttributes', // unique name for your Field Array
  });

  /!* Hooks */;

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAttempt(retryAttempt);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setValue('code', newProductCode);
  }, [setValue, selectedCategoryCode, newProductCode]);

  useEffect(() => {
    if (productsStatus === 'success' || productsStatus === 'failed') {
      console.log(productsStatus);
      const currentToast = toast(
        iconToast(productsStatus, tc(productsResponse)),
      );
      const timer = setTimeout(() => {
        dispatch(resetStatus());
      }, 6000);
      reset();
      return () => {
        clearTimeout(timer);
        currentToast.dismiss();
        dispatch(resetStatus());
        reset();
      };
    }
  }, [productsStatus, productsError, productsResponse, toast, dispatch]);

  /!* Methods  */;
  const fetchAll = () => {
    setCurrentAttempt(0);
    dispatch(getAllCategories());
    dispatch(getAllAttributes());
  };

  const fetchLastCode = async (cat_code) => {
    try {
      const response = await axios.get(PRODUCTS_DATA.byCategoryCode + cat_code);
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
    console.log(data);
    const formData = new FormData();
    formData.append('image', data.image[0]);
    delete data.image;
    formData.append(
      'product',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );
    dispatch(createProduct(formData));
  };

  return (
    <Form {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-3 gap-2"
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
          name="purchase_price"
          label="purchase_price"
          type="number"
        />
        <EnhancedSimpleInput
          name="selling_price"
          label="selling_price"
          type="number"
        />
        <EnhancedSimpleInput name="stock" label="stock" type="number" />
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
        />
        <EnhancedSimpleTextarea
          className="col-span-full"
          name="description"
          label="description"
        />

        <fieldset className="border rounded-lg p-4 col-span-3 grid grid-cols-2 gap-2">
          <legend>{tc('attributes')}</legend>
          <Button
            type="button"
            onClick={() => existingAttributeAppend({ name: '', value: '' })}
            variant="secondary"
          >
            {tc('addExistingAttribute')}
            <PlusIcon />
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => newAttributeAppend({ name: '', value: '' })}
          >
            {tc('addAttribute')}
            <PlusIcon />
          </Button>

          {existingAttributeField.map((field, idx) => (
            <div
              key={field.id}
              className="col-span-full grid grid-cols-3 gap-2"
            >
              <EnhancedSimpleSelect
                name={`existingProductAttributes.${idx}.attributeName`}
                label="attribute"
                list={attributes}
                valueField="name"
                placeholder="selectAttribute"
                status={attributesStatus}
                reFetch={getAllAttributes}
                retryAttempt={retryAttempt}
              />
              <EnhancedSimpleInput
                name={`existingProductAttributes.${idx}.attributeValue`}
                label="value"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  existingAttributeRemove(field.id);
                }}
                className="self-end"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          {newAttributeField.map((field, idx) => (
            <div
              key={field.id}
              className="col-span-full grid grid-cols-3 gap-2"
            >
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
          disabled={!isValid}
        >
          {tc('createProduct')}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
