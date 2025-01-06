import React from 'react';
import CustomTable from '@/components/table/CustomTable';
import { ATTRIBUTE } from '@/config/entity/entities';
import {
  filterAttribute,
  getAllAttributes,
  orderAttributes,
  resetStatus,
} from '@/redux/attributesSlice';
import { resetToastStatus } from '@/redux/categorySlice';

const AttributesTable = () => {
  return (
    <CustomTable
      ENTITY={ATTRIBUTE}
      getItems={getAllAttributes}
      resetItems={resetStatus}
      filterItem={filterAttribute}
      orderItems={orderAttributes}
      resetToast={resetToastStatus}
    />
  );
};

export default AttributesTable;
