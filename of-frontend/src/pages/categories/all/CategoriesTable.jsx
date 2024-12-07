import React from 'react';
import CustomTable from '@/components/table/CustomTable';
import {
  getAllCategories,
  resetStatus,
  deleteCategory,
  filterCategory,
  orderCategories,
} from '@/redux/categorySlice';
import { CATEGORY } from '@/config/entity/entities';

const CategoriesTable = () => {
  return (
    <CustomTable
      getItems={getAllCategories}
      filterItem={filterCategory}
      orderItems={orderCategories}
      deleteItem={deleteCategory}
      resetItems={resetStatus}
      entity={CATEGORY}
    />
  );
};

export default CategoriesTable;
