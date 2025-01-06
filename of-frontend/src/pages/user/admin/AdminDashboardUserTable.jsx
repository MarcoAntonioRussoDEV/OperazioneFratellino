import CustomTable from '@/components/table/CustomTable';
import { USER } from '@/config/entity/entities';
import {
  filterDeletedUsers,
  getAllUsers,
  orderUsers,
  resetToastStatus,
  resetUsers,
  setItemsPerPage,
  setPage,
  unfilterDeletedUsers,
} from '@/redux/usersSlice';
import React from 'react';
import AdminDashboardUserRow from './AdminDashboardUserRow';
import { STATUS_ENUM } from '@/utils/toastUtils';

const AdminDashboardUserTable = () => {
  const toastArray = [
    STATUS_ENUM.RESET,
    STATUS_ENUM.DELETED,
    STATUS_ENUM.SUCCESS,
    STATUS_ENUM.FAILED,
  ];
  return (
    <CustomTable
      ENTITY={USER}
      getItems={getAllUsers}
      resetItems={resetUsers}
      orderItems={orderUsers}
      resetToast={resetToastStatus}
      toastArray={toastArray}
      unfilerDeletedItems={unfilterDeletedUsers}
      filterDeletedItems={filterDeletedUsers}
      ItemRow={AdminDashboardUserRow}
      setItemsPerPage={setItemsPerPage}
      setPage={setPage}
    />
  );
};

export default AdminDashboardUserTable;
