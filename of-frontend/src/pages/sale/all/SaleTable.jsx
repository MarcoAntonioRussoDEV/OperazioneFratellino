import React, { useEffect } from 'react';
import CustomTable from '@/components/table/CustomTable';
import { SALES } from '@/config/entity/entities';
import {
  getAllSales,
  resetStatus,
  deleteSale,
  orderSales,
  filterSale,
} from '@/redux/salesSlice';
import { useDispatch } from 'react-redux';

const SaleTable = () => {
  return (
    <CustomTable
      getItems={getAllSales}
      orderItems={orderSales}
      filterItem={filterSale}
      deleteItem={deleteSale}
      resetItems={resetStatus}
      entity={SALES}
    />
  );
};

export default SaleTable;
