import React from 'react';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { useDispatch } from 'react-redux';

const DeleteModal = ({ confirmAction, confirmTarget }) => {
  const tc = useTranslateAndCapitalize();
  const dispatch = useDispatch();

  const handleConfirm = () => {
    dispatch(confirmAction(confirmTarget));
  };
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{`${tc('deleteModalTitle')}`}</AlertDialogTitle>
        <AlertDialogDescription>
          {tc('unreversibleAction')}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{tc('cancel')}</AlertDialogCancel>
        <AlertDialogAction onClick={handleConfirm}>
          {tc('confirm')}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteModal;
