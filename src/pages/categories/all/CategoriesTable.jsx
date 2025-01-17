import CustomTable from '@/components/table/CustomTable';
import React from 'react';
import { STATUS_ENUM } from '@/utils/toastUtils';
import { CATEGORY } from '@/config/entity/entities';
import {
  filterCategory,
  getAllCategories,
  orderCategories,
  resetCategories,
  resetToastStatus,
  setPage,
  setItemsPerPage,
} from '@/redux/categorySlice';
import CategoriesRow from './CategoriesRow';

const CategoriesTable = () => {
  const toastArray = [
    STATUS_ENUM.CREATED,
    STATUS_ENUM.DELETED,
    STATUS_ENUM.FAILED,
  ];
  return (
    <CustomTable
      ENTITY={CATEGORY}
      getItems={getAllCategories}
      resetItems={resetCategories}
      filterItems={filterCategory}
      orderItems={orderCategories}
      resetToast={resetToastStatus}
      toastArray={toastArray}
      ItemRow={CategoriesRow}
      setItemsPerPage={setItemsPerPage}
      setPage={setPage}
    />
  );
};

export default CategoriesTable;
