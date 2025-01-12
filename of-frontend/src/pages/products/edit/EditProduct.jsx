import { useAppHooks } from '@/hooks/useAppHooks';
import React, { useEffect } from 'react';
import ProductForm from '../create/ProductForm';
import { useSelector } from 'react-redux';
import { getProductByCode } from '@/redux/productSlice';
import { useParams } from 'react-router-dom';
import { CATEGORIES_DATA } from '@/config/links/urls';
import { axios } from '@/config/axios/axiosConfig';
import { extractCategoryByProduct } from '@/utils/customUtils';

const EditProduct = () => {
  const { tc, dispatch } = useAppHooks();
  const { code } = useParams();
  const { product } = useSelector((state) => state.products);
  const [editedProduct, setEditedProduct] = React.useState({});

  useEffect(() => {
    dispatch(getProductByCode(code));
  }, []);

  useEffect(() => {
    if (product.code) {
      setEditedProduct({
        ...product,
        category: extractCategoryByProduct(product.code),
      });
    }
  }, [product]);
  return (
    <div>
      <h1 className="text-4xl">{tc('product.edit')}</h1>
      <div className="flex justify-center text-start mt-10">
        <ProductForm product={editedProduct} />
      </div>
    </div>
  );
};

export default EditProduct;
