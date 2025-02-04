import CustomTable from '@/components/table/CustomTable';
import { PRODUCT } from '@/config/entity/entities';
import React from 'react';
import ProductsRow from './ProductsRow';
import {
  filterDeletedProducts,
  filterProduct,
  getAllProducts,
  orderProducts,
  resetProducts,
  resetToastStatus,
  setItemsPerPage,
  setPage,
  unfilterDeletedProducts,
} from '@/redux/productSlice';
import { STATUS_ENUM } from '@/utils/toastUtils';

const ProductsTable = () => {
  const toastArray = [
    STATUS_ENUM.CREATED,
    STATUS_ENUM.DELETED,
    STATUS_ENUM.FAILED,
  ];
  return (
    <CustomTable
      ENTITY={PRODUCT}
      getItems={getAllProducts}
      resetItems={resetProducts}
      filterItems={filterProduct}
      orderItems={orderProducts}
      toastArray={toastArray}
      resetToast={resetToastStatus}
      unfilerDeletedItems={unfilterDeletedProducts}
      filterDeletedItems={filterDeletedProducts}
      ItemRow={ProductsRow}
      setItemsPerPage={setItemsPerPage}
      setPage={setPage}
    />
  );
};

export default ProductsTable;
