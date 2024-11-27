import React from 'react';
import CustomTable from '@/components/table/CustomTable';
import { PRODUCT } from '@/config/entity/entities';
import { getAllProducts, resetStatus } from '@/redux/productSlice';

const ProductsTable = () => {
  return (
    <CustomTable
      getItems={getAllProducts}
      resetItems={resetStatus}
      entity={PRODUCT}
    />
  );
};

export default ProductsTable;
