import CustomTable from '@/components/table/CustomTable';
import { PREORDER } from '@/config/entity/entities';
import {
  deletePreorder,
  filterByStatus,
  filterPreorders,
  getAllPreorders,
  orderPreorders,
  resetStatus,
  resetToastStatus,
  setItemsPerPage,
  setPage,
} from '@/redux/preorderSlice';
import PreordersRow from './PreordersRow';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import CheckboxWithLabel from '@/components/form/CheckboxWithLabel';
import { useAppHooks } from '@/hooks/useAppHooks';
import { useEffect, useRef, useState } from 'react';

const PreordersTable = () => {
  const { tc, dispatch } = useAppHooks();
  const [checkedStatuses, setCheckedStatuses] = useState([]);

  const handleChecked = (status) => {
    setCheckedStatuses((prevStatuses) => {
      if (prevStatuses.includes(status)) {
        return prevStatuses.filter((s) => s !== status);
      } else {
        return [...prevStatuses, status];
      }
    });
  };

  useEffect(() => {
    dispatch(filterByStatus(checkedStatuses));
  }, [checkedStatuses]);

  return (
    <CustomTable
      ENTITY={PREORDER}
      getItems={getAllPreorders}
      resetItems={resetStatus}
      filterItem={filterPreorders}
      orderItems={orderPreorders}
      resetToast={resetToastStatus}
      ItemRow={PreordersRow}
      setItemsPerPage={setItemsPerPage}
      setPage={setPage}
    >
      <div className="flex mt-2 gap-4 items-center">
        <CheckboxWithLabel label={'PENDING'} onChecked={handleChecked} />
        <CheckboxWithLabel label={'REJECTED'} onChecked={handleChecked} />
        <CheckboxWithLabel label={'COMPLETED'} onChecked={handleChecked} />
        <CheckboxWithLabel label={'READY'} onChecked={handleChecked} />
      </div>
    </CustomTable>
  );
};

export default PreordersTable;
