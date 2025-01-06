import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useAppHooks } from '@/hooks/useAppHooks';
import ActionsDropdown from '@/components/table/ActionsDropdown';
import { ListRestart, UserRoundPen, UserX } from 'lucide-react';
import { deleteUser, enableUser, resetUserPassword } from '@/redux/usersSlice';
import { useNavigate } from 'react-router-dom';

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
