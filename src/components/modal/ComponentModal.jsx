import React from 'react';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAppHooks } from '@/hooks/useAppHooks';
const ComponentModal = ({ children }) => {
  const { tc } = useAppHooks();
  return (
    <AlertDialogContent>
      {children}
      <AlertDialogCancel>{tc('cancel')}</AlertDialogCancel>
    </AlertDialogContent>
  );
};

export default ComponentModal;
