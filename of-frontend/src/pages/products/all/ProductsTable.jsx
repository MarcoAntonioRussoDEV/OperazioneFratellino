import React from 'react';
import CustomTable from '@/components/table/CustomTable';
import { PRODUCT } from '@/config/entity/entities';
import {
  deleteProduct,
  filterProduct,
  getAllProducts,
  orderProducts,
  resetStatus,
} from '@/redux/productSlice';

const ProductsTable = () => {
  return (
    <CustomTable
      getItems={getAllProducts}
      deleteItem={deleteProduct}
      resetItems={resetStatus}
      entity={PRODUCT}
      filterItem={filterProduct}
      orderItems={orderProducts}
    />
  );
};

export default ProductsTable;
