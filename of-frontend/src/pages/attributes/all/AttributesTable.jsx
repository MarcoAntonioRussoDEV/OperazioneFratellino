import React from 'react';
import CustomTable from '@/components/table/CustomTable';
import { ATTRIBUTE } from '@/config/entity/entities';
import { getAllAttributes, resetStatus } from '@/redux/attributesSlice';

const AttributesTable = () => {
  return (
    <CustomTable
      getItems={getAllAttributes}
      resetItems={resetStatus}
      entity={ATTRIBUTE}
    />
  );
};

export default AttributesTable;
