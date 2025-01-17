import { Label } from '@/components/ui/label';
import { TableCell, TableRow } from '@/components/ui/table';
import { useAppHooks, useMTOHooks, useOTMHooks } from '@/hooks/useAppHooks';
import { hasAccess } from '@/utils/authService';
import { USER_ROLES } from '@/utils/userRoles';
import React from 'react';
import { useSelector } from 'react-redux';

import { fieldSettingsResolver } from '@/utils/customUtils';
import { SALES } from '@/config/entity/entities';
import OTMDropdown from '@/components/table/OTMDropdown';
import { format } from 'date-fns';
import SaleActionsDropdown from './SaleActionsDropdown';

const SaleRow = (sale) => {
  const { tc, capitalize } = useAppHooks();
  const {
    id,
    products,
    quantity,
    user: saleUser,
    client,
    sellingPrice,
    profit,
    createdAt,
  } = sale;
  const { user } = useSelector((state) => state.user);
  const { MTOdata } = useMTOHooks(SALES, sale);
  return (
    <TableRow className={`text-left`}>
      {/* //! ID */}
      <TableCell>{capitalize(id)}</TableCell>
      {/* //! PRODUCTS */}
      <TableCell>
        <OTMDropdown
          relateDisplayField={fieldSettingsResolver(
            SALES,
            'products',
            'relateDisplayField',
          )}
          relateEntity={products}
          dropDownName={tc('products')}
          targetNavigate="products"
        />
      </TableCell>
      {/* //! USER */}
      <TableCell> {capitalize(MTOdata['user'])}</TableCell>

      {/* //! CLIENT */}
      <TableCell> {capitalize(MTOdata['client'])}</TableCell>

      {/* //! PRICE */}
      <TableCell> {capitalize(sellingPrice)} €</TableCell>

      {/* //! PROFIT */}
      <TableCell> {capitalize(profit)} €</TableCell>

      {/* //! CREATED_AT */}
      <TableCell>
        {format(capitalize(createdAt), 'dd/MM/yyyy - hh:mm')}
      </TableCell>

      {/* //! ACTIONS */}
      <TableCell>
        {hasAccess(user, [USER_ROLES.OPERATOR]) && (
          <SaleActionsDropdown {...sale} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default SaleRow;
