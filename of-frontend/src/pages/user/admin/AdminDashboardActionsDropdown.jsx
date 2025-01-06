import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAppHooks, useToastHooks } from '@/hooks/useAppHooks';
import ActionsDropdown from '@/components/table/ActionsDropdown';
import { ListRestart, UserRoundPen, UserX } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  deleteUser,
  enableUser,
  getAllUsers,
  resetToastStatus,
  resetUserPassword,
} from '@/redux/usersSlice';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import DeleteModal from '@/components/modal/DeleteModal';
import CustomModal from '@/components/modal/CustomModal';

const AdminDashboardActionsDropdown = ({ name, email, isDeleted }) => {
  const { tc, dispatch } = useAppHooks();
  const navigate = useNavigate();
  const triggerRef = useRef();

  const handleResetPassword = (email) => {
    dispatch(resetUserPassword(email));
  };

  const handleDeleteUser = (email) => {
    dispatch(deleteUser(email));
  };

  const handleEnableUser = (email) => {
    dispatch(enableUser(email));
  };

  return (
    <>
      <ActionsDropdown
        label={name}
        isDeleted={isDeleted}
        primaryKey={email}
        entityName="user"
        isDeletedDispatchAction={enableUser}
        isNotDeletedDispatchAction={deleteUser}
        DeleteIcon={<UserX />}
      >
        <button
          className="flex justify-between"
          onClick={() => handleResetPassword(email)}
        >
          {tc('resetPassword')}
          <ListRestart />
        </button>
        <button
          className="flex justify-between"
          onClick={() => navigate(`/user/${email}`)}
        >
          {tc('edit')}
          <UserRoundPen />
        </button>
      </ActionsDropdown>
    </>
  );
};

AdminDashboardActionsDropdown.propTypes = {
  name: PropTypes.string.isRequired,
};

export default AdminDashboardActionsDropdown;
