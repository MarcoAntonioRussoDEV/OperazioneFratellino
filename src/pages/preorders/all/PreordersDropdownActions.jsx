import ActionsDropdown from '@/components/table/ActionsDropdown';
import { useAppHooks } from '@/hooks/useAppHooks';
import { preorderToSale, updatePreorderStatus } from '@/redux/preorderSlice';
import { Check, Clock, Truck, Watch, WatchIcon, X } from 'lucide-react';
import React from 'react';

const PreordersDropdownActions = ({ id }) => {
  const { tc, dispatch } = useAppHooks();

  const handleSetReady = () => {
    dispatch(updatePreorderStatus({ id, status: 'ready' }));
  };

  const handleSetPending = () => {
    dispatch(updatePreorderStatus({ id, status: 'pending' }));
  };

  const handleSetRejected = () => {
    dispatch(updatePreorderStatus({ id, status: 'rejected' }));
  };

  const handleToSale = () => {
    dispatch(preorderToSale(id));
  };
  return (
    <ActionsDropdown entityName="preorder" primaryKey={id}>
      <button onClick={handleToSale} className="dropdown-button">
        {tc('preorders.toSale')}
        <Truck />
      </button>
      <button
        onClick={handleSetReady}
        className="dropdown-button focus:bg-success"
      >
        {tc('preorders.setReady')}
        <Check />
      </button>
      <button
        onClick={handleSetPending}
        className="dropdown-button focus:bg-warning focus:text-warning-foreground"
      >
        {tc('preorders.setPending')}
        <Clock />
      </button>
      <button
        onClick={handleSetRejected}
        className="dropdown-button focus:bg-destructive"
      >
        {tc('preorders.setRejected')}
        <X />
      </button>
    </ActionsDropdown>
  );
};

export default PreordersDropdownActions;
