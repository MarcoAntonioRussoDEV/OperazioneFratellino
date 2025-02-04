import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasAccess } from '@/utils/authService';
import { Spinner } from '../ui/spinner';
import { USER_ROLES } from '@/utils/userRoles';

const ProtectedRoute = ({ requiredRole = USER_ROLES.AUTH, children }) => {
  const {
    isAuthenticated,
    user: { role },
  } = useSelector((state) => state.user);

  // if (!role || !isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  // if (!hasAccess(role, requiredRole)) {
  //   return <Navigate to="/unauthorized" />;
  // }
  return children;
};

export default ProtectedRoute;
