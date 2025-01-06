import CustomTable from '@/components/table/CustomTable';
import { SALES } from '@/config/entity/entities';
import {
  filterSales,
  getAllSales,
  orderSales,
  resetSales,
  resetToastStatus,
  setItemsPerPage,
  setPage,
} from '@/redux/salesSlice';
import React, { useEffect, useState } from 'react';
import SaleRow from './SaleRow';
import { STATUS_ENUM } from '@/utils/toastUtils';
import { useDispatch } from 'react-redux';

const SaleTable = () => {
  const { FULFILLED } = STATUS_ENUM;
  const toastArray = [FULFILLED];
  const dispatch = useDispatch();

  return (
    <>
      <CustomTable
        ENTITY={SALES}
        getItems={getAllSales}
        resetItems={resetSales}
        filterItems={filterSales}
        orderItems={orderSales}
        resetToast={resetToastStatus}
        toastArray={toastArray}
        ItemRow={SaleRow}
        setPage={setPage}
        setItemsPerPage={setItemsPerPage}
      />
      {/* <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>Page {currentPage + 1}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div> */}
    </>
  );
};

export default SaleTable;
