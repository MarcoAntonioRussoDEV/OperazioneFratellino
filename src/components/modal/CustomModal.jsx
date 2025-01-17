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

const CustomModal = ({ confirmAction, confirmTarget, title, description }) => {
  const tc = useTranslateAndCapitalize();
  const dispatch = useDispatch();

  const handleConfirm = () => {
    dispatch(confirmAction(confirmTarget));
  };
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{tc(title)}</AlertDialogTitle>
        <AlertDialogDescription>{tc(description)}</AlertDialogDescription>
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

export default CustomModal;
