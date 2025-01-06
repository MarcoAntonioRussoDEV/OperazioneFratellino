import { useAppHooks } from '@/hooks/useAppHooks';
import React, { useEffect } from 'react';
import ProductForm from '../create/ProductForm';
import { useSelector } from 'react-redux';
import { getProductByCode } from '@/redux/productSlice';
import { useParams } from 'react-router-dom';

const EditProduct = () => {
  const { tc, dispatch } = useAppHooks();
  const { code } = useParams();
  const { product } = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(getProductByCode(code));
  }, []);
  return (
    <div>
      <h1 className="text-4xl">{tc('product.edit')}</h1>
      <div className="flex justify-center text-start mt-10">
        <ProductForm product={product} />
      </div>
    </div>
  );
};

export default EditProduct;
