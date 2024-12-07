import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import iconToast from '@/utils/toastUtils';
import { Spinner } from '@/components/ui/spinner.jsx';

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
import { capitalize, useTranslateAndCapitalize } from '@/utils/FormatUtils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CATEGORY } from '@/config/entity/entities';
import SimpleInput from '@/components/form/SimpleInput';
import withFormContext from '@/components/HOC/withFormContext';
import { createCategory } from '@/redux/categorySlice';
const EnhancedSimpleInput = withFormContext(SimpleInput);
const CategoryForm = () => {
  const { t } = useTranslation();
  const {
    categories,
    status: categoriesStatus,
    error: categoriesError,
    response: itemResponse,
  } = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const tc = useTranslateAndCapitalize();

  const methods = useForm({
    resolver: zodResolver(CATEGORY.formSchema),
    defaultValues: CATEGORY.defaultValues,
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

  useEffect(() => {
    if (categoriesStatus === 'created' || categoriesStatus === 'failed') {
      const currentToast = toast(iconToast(categoriesStatus, t(itemResponse)));
      const timer = setTimeout(() => {
        dispatch(reset());
      }, 6000);
      reset();
      return () => {
        clearTimeout(timer);
        currentToast.dismiss();
        reset();
      };
    }
  }, [categoriesStatus, categoriesError, itemResponse, toast, dispatch]);

  const onSubmit = (data) => {
    data = { ...data, code: data['code'].toUpperCase() };
    console.log(data);
    dispatch(createCategory(data));
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        {Object.entries(CATEGORY.fields)
          .filter(([key, value]) => value.isFillable)
          .map(([key, value]) => {
            return <EnhancedSimpleInput key={key} name={key} label={key} />;
          })}

        <Button
          isLoading={categoriesStatus === 'loading'}
          className="mt-10 col-span-3"
          disabled={!isValid}
        >
          {tc('createCategory')}
        </Button>
      </form>
    </Form>
  );
};
CategoryForm.propTypes = {
  entity: PropTypes.object.isRequired,
  resetItem: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
};
export default CategoryForm;
