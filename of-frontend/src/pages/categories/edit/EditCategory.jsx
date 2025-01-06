import { useAppHooks } from '@/hooks/useAppHooks';
import { getCategoryById } from '@/redux/categorySlice';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CategoryForm from '../create/CategoryForm';

const EditCategory = () => {
  const { tc, dispatch } = useAppHooks();
  const { id } = useParams();
  const { category } = useSelector((state) => state.categories);
  useEffect(() => {
    dispatch(getCategoryById(id));
  }, []);
  return (
    <div>
      <h1 className="text-4xl">{tc('category.edit')}</h1>
      <div className="flex justify-center text-start mt-10">
        <CategoryForm category={category} />
      </div>
    </div>
  );
};

export default EditCategory;
