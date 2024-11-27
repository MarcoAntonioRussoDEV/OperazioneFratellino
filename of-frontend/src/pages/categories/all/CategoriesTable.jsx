import React from 'react';
import CustomTable from '@/components/table/CustomTable';
import { getAllCategories, resetStatus } from '@/redux/categorySlice';
import { CATEGORY } from '@/config/entity/entities';

const CategoriesTable = () => {
  return (
    <CustomTable
      getItems={getAllCategories}
      resetItems={resetStatus}
      entity={CATEGORY}
    />
  );
};

export default CategoriesTable;
