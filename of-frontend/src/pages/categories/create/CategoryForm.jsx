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
import { capitalize, useTranslateAndCapitalize } from '@/utils/formatUtils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CATEGORY } from '@/config/entity/entities';
import SimpleInput from '@/components/form/SimpleInput';
import withFormContext from '@/components/HOC/withFormContext';
import { createCategory, editCategory } from '@/redux/categorySlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppHooks, useToastHooks } from '@/hooks/useAppHooks';
const EnhancedSimpleInput = withFormContext(SimpleInput);
const CategoryForm = ({ category }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from, formData } = location.state || {};
  const { t, tc, dispatch } = useAppHooks();
  const { toast } = useToast();
  const {
    categories,
    status: categoriesStatus,
    error: categoriesError,
    response: itemResponse,
  } = useSelector((state) => state.categories);

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

  useToastHooks(categoriesStatus, ['created', 'failed'], itemResponse, reset);

  const onSubmit = (data) => {
    data = { ...data, code: data['code'].toUpperCase() };
    if (category) {
      dispatch(editCategory({ id: category.id, category: data }));
    } else {
      dispatch(createCategory(data));
    }

    if (from) {
      navigate(from, { state: { formData } });
    }
  };

  const handleValues = async (category) => {
    const values = await Object.entries(category).map(([key, value]) => {
      return setValue(key, value);
    });
  };

  useEffect(() => {
    if (category) {
      handleValues(category);
    }
  }, [category]);

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
          {category ? tc('category.edit') : tc('createCategory')}
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
