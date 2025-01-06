import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CATEGORY } from '@/config/entity/entities';
import SimpleInput from '@/components/form/SimpleInput';
import withFormContext from '@/components/HOC/withFormContext';
import {
  createCategory,
  editCategory,
  resetToastStatus,
} from '@/redux/categorySlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppHooks, useToastHooks } from '@/hooks/useAppHooks';
const EnhancedSimpleInput = withFormContext(SimpleInput);
const CategoryForm = ({ category }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from, formData } = location.state || {};
  const { t, tc, dispatch } = useAppHooks();
  const {
    categories,
    status: categoriesStatus,
    error: categoriesError,
    response: categoryResponse,
    toast: { status: toastStatus, response: toastResponse, error: toastError },
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

  useToastHooks(
    toastStatus,
    ['created', 'failed'],
    toastResponse,
    resetToastStatus,
    reset,
  );

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

    reset();
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
        <EnhancedSimpleInput
          name={'code'}
          label={'code'}
          minLength="4"
          maxLength="4"
        />
        <EnhancedSimpleInput name={'name'} label={'name'} />
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
