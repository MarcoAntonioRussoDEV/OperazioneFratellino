import ImageDrawer from '@/components/table/ImageDrawer';
import { TableCell, TableRow } from '@/components/ui/table';
import { USER } from '@/config/entity/entities';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useAppHooks } from '@/hooks/useAppHooks';
import { format } from 'date-fns';
import AdminDashboardActionsDropdown from './AdminDashboardActionsDropdown';

const AdminDashboardUserRow = ({
  id,
  name,
  email,
  city,
  role,
  phone,
  avatar,
  cart,
  createdAt,
  isDeleted,
  isFirstAccess,
}) => {
  const { tc, capitalize } = useAppHooks();
  return (
    <TableRow
      className={`text-left ${
        isDeleted && 'striped-background text-destructive'
      }`}
    >
      {/* //! AVATAR  */}
      <Drawer>
        <DrawerTrigger asChild>
          <TableCell>
            <div className="w-14 h-14 cursor-pointer hover:scale-[1.1]">
              <img
                src={avatar}
                alt={`${email}-avatar`}
                className="rounded-lg object-cover h-full w-full"
              />
            </div>
          </TableCell>
        </DrawerTrigger>
        <ImageDrawer title={name} description={email} imgSrc={avatar} />
      </Drawer>

      {/* //! NAME */}
      <TableCell>{capitalize(name)}</TableCell>

      {/* //! EMAIL */}
      <TableCell>{capitalize(email)}</TableCell>

      {/* //! PHONE */}
      <TableCell>{phone}</TableCell>

      {/* //! CITY */}
      <TableCell>{capitalize(city)}</TableCell>

      {/* //! ROLE */}
      <TableCell>{capitalize(role)}</TableCell>

      {/* //! CREATED AT */}
      <TableCell>{format(createdAt, 'dd/MM/yyyy - HH:mm')}</TableCell>

      {/* //! ACTIONS */}
      <TableCell>
        <AdminDashboardActionsDropdown
          name={name}
          email={email}
          isDeleted={isDeleted}
        />
      </TableCell>
    </TableRow>
  );
};

AdminDashboardUserRow.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  cart: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  isFirstAccess: PropTypes.bool.isRequired,
};

export default AdminDashboardUserRow;
