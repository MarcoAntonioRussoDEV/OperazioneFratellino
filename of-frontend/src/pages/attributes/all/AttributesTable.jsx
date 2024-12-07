import React from 'react';
import CustomTable from '@/components/table/CustomTable';
import { ATTRIBUTE } from '@/config/entity/entities';
import {
  filterAttribute,
  getAllAttributes,
  orderAttributes,
  resetStatus,
} from '@/redux/attributesSlice';

const AttributesTable = () => {
  return (
    <CustomTable
      filterItem={filterAttribute}
      orderItems={orderAttributes}
      getItems={getAllAttributes}
      resetItems={resetStatus}
      entity={ATTRIBUTE}
    />
  );
};

export default AttributesTable;
