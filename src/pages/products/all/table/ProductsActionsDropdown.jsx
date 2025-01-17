import CustomModal from '@/components/modal/CustomModal';
import ActionsDeleteButton from '@/components/table/ActionsDeleteButton';
import ActionsDropdown from '@/components/table/ActionsDropdown';
import { useAppHooks } from '@/hooks/useAppHooks';
import { deleteProduct, toggleDeleteProduct } from '@/redux/productSlice';
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductsActionsDropdown = ({ code, isDeleted }) => {
  const { tc, dispatch } = useAppHooks();
  const navigate = useNavigate();
  const trigger = useRef();
  return (
    <>
      <ActionsDropdown
        label={code}
        isDeletedDispatchAction={toggleDeleteProduct}
        isNotDeletedDispatchAction={toggleDeleteProduct}
        // DeleteIcon={() => <Trash2 />}
        entityName={'product'}
        isDeleted={isDeleted}
        primaryKey={code}
        permaDelete={deleteProduct}
      >
        <button
          className="flex justify-between gap-4"
          onClick={() => {
            navigate(`/products/edit/${code}`);
          }}
        >
          {tc('product.edit')}
          <Pencil />
        </button>
      </ActionsDropdown>
    </>
  );
};

export default ProductsActionsDropdown;
