import React, { useEffect } from 'react';
import {
  resetStatus,
  getAllProductAttributes,
} from '@/redux/productAttributesSlice';
import { PRODUCT_ATTRIBUTES } from '@/config/entity/entities';
import CustomTable from '@/components/table/CustomTable';
import CustomRow from '@/components/table/CustomRow';
import { useDispatch, useSelector } from 'react-redux';

const ProductAttributesTable = () => {
  const { productAttributes } = useSelector((state) => state.productAttributes);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductAttributes());
  }, []);
  console.log(productAttributes);
  return (
    <CustomTable
      getItems={getAllProductAttributes}
      resetItems={resetStatus}
      entity={PRODUCT_ATTRIBUTES}
    />
  );
};

export default ProductAttributesTable;
