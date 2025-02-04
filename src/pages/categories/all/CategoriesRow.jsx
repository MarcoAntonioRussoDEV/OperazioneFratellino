import { Label } from '@/components/ui/label';
import { TableCell, TableRow } from '@/components/ui/table';
import { useAppHooks, useOTMHooks } from '@/hooks/useAppHooks';
import { hasAccess } from '@/utils/authService';
import { USER_ROLES } from '@/utils/userRoles';
import React from 'react';
import { useSelector } from 'react-redux';
import CategoriesActionsDropdown from './CategoriesActionsDropdown';
import OTMDropdown from '@/components/table/OTMDropdown';
import { CATEGORY } from '@/config/entity/entities';

import { fieldSettingsResolver } from '@/utils/customUtils';

const CategoriesRow = (category) => {
  const { tc, capitalize } = useAppHooks();
  const { id, name, code, isDeleted } = category;
  const { user } = useSelector((state) => state.user);
  const { OTMdata } = useOTMHooks(CATEGORY, category, 'products');

  return (
    <TableRow className={`text-left`}>
      {/* //! ID */}
      <TableCell>{capitalize(id)}</TableCell>

      {/* //! CODE */}
      <TableCell>{capitalize(code)}</TableCell>

      {/* //! NAME */}
      <TableCell>{capitalize(name)}</TableCell>

      {/* //! PRODUCTS */}
      <TableCell>
        <OTMDropdown
          relateDisplayField={fieldSettingsResolver(
            CATEGORY,
            'products',
            'relateDisplayField',
          )}
          relateEntity={category.products}
          dropDownName={tc('products')}
          targetNavigate="products"
        />
      </TableCell>

      {/* //! ACTIONS */}
      <TableCell>
        {hasAccess(user, [USER_ROLES.ADMIN]) && (
          <CategoriesActionsDropdown {...category} />
        )}
      </TableCell>
    </TableRow>
  );
};

export default CategoriesRow;
