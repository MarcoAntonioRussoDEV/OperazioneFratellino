import MTMDropdown from '@/components/table/MTMDropdown';
import OTMDropdown from '@/components/table/OTMDropdown';
import { TableCell, TableRow } from '@/components/ui/table';
import { PREORDER } from '@/config/entity/entities';
import { useAppHooks, useMTOHooks } from '@/hooks/useAppHooks';
import { fieldSettingsResolver } from '@/utils/customUtils';
import { formatDate } from '@/utils/formatUtils';
import React, { useEffect, useState } from 'react';
import PreordersDropdownActions from './PreordersDropdownActions';
import { hasAccess } from '@/utils/authService';
import { USER_ROLES } from '@/utils/userRoles';
import { useSelector } from 'react-redux';

const PreordersRow = (preorder) => {
  const { tc } = useAppHooks();
  const { id, products, user, client, totalPrice, status, createdAt } =
    preorder;
  const { MTOdata } = useMTOHooks(PREORDER, preorder);
  const [statusClasses, setStatusClasses] = useState('');
  const { user: authUser } = useSelector((state) => state.user);

  useEffect(() => {
    switch (status.toLowerCase()) {
      case 'pending':
        return setStatusClasses('text-warning');
      case 'completed':
        return setStatusClasses('text-success');
      case 'rejected':
        return setStatusClasses('text-destructive');
    }
  }, []);

  return (
    <TableRow className="text-start">
      {/* //! ID */}
      <TableCell>{id}</TableCell>

      {/* //! Products */}
      <TableCell>
        <OTMDropdown
          relateDisplayField={fieldSettingsResolver(
            PREORDER,
            'products',
            'relateDisplayField',
          )}
          relateDisplayValue={fieldSettingsResolver(
            PREORDER,
            'products',
            'relateDisplayValue',
          )}
          relateEntity={products}
          dropDownName={tc('products')}
          targetNavigate="products"
        />
      </TableCell>

      {/* //! User */}
      <TableCell>{MTOdata['user']}</TableCell>

      {/* //! Client */}
      <TableCell>{MTOdata['client']}</TableCell>

      {/* //! Total Price */}
      <TableCell>{totalPrice} €</TableCell>

      {/* //! Status */}
      <TableCell className={statusClasses}>{tc(status)}</TableCell>

      {/* //! Created At */}
      <TableCell>{formatDate(createdAt)}</TableCell>

      {/* //! Actions */}
      {hasAccess(authUser, [USER_ROLES.OPERATOR]) && (
        <TableCell>
          <PreordersDropdownActions {...preorder} />
        </TableCell>
      )}
    </TableRow>
  );
};

export default PreordersRow;
