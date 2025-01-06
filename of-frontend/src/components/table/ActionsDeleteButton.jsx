import { useAppHooks } from '@/hooks/useAppHooks';
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import React, { useRef } from 'react';
import CustomModal from '../modal/CustomModal';
import { Trash, Trash2 } from 'lucide-react';

const ActionsDeleteButton = ({
  isDeleted,
  code,
  Icon,
  isDeletedDispatchAction,
  isNotDeletedDispatchAction,
  entityName,
}) => {
  const { tc, dispatch } = useAppHooks();
  const triggerRef = useRef();

  const handleIsDeleted = (code) => {
    dispatch(isDeletedDispatchAction(code));
  };

  const handleIsNotDeleted = (code) => {
    dispatch(isNotDeletedDispatchAction(code));
  };

  return (
    <button
      onClick={() => {
        triggerRef.current.click();
      }}
    >
      {isDeleted ? tc(`${entityName}.enable`) : tc(`${entityName}.disable`)}
      {Icon ? <Icon className="" /> : <Trash2 />}
      <AlertDialog>
        <AlertDialogTrigger>
          <p
            ref={triggerRef}
            className="text-destructive cursor-pointer hidden"
          />
        </AlertDialogTrigger>
        <CustomModal
          confirmAction={
            isDeleted ? isDeletedDispatchAction : isNotDeletedDispatchAction
          }
          confirmTarget={code}
          title={isDeleted ? 'enableModalTitle' : 'disableModalTitle'}
          description={
            isDeleted
              ? `${entityName}.enableModalDescription`
              : `${entityName}.disableModalDescription`
          }
        />
      </AlertDialog>
    </button>
  );
};

export default ActionsDeleteButton;
