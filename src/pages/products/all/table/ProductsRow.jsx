import QrCodeGenerator from '@/components/QRCodeGenerator/QrCodeGenerator';
import EAVDropdown from '@/components/table/EAVDropdown';
import ImageDrawer from '@/components/table/ImageDrawer';
import OTMDropdown from '@/components/table/MTMDropdown';
import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import { TableCell, TableRow } from '@/components/ui/table';
import { PRODUCT } from '@/config/entity/entities';
import { useAppHooks, useMTOHooks } from '@/hooks/useAppHooks';
import { format } from 'date-fns';
import React from 'react';
import ProductsActionsDropdown from './ProductsActionsDropdown';
import { hasAccess } from '@/utils/authService';
import { USER_ROLES } from '@/utils/userRoles';
import { useSelector } from 'react-redux';

const ProductsRow = (product) => {
  const { tc, capitalize } = useAppHooks();
  const { MTOdata } = useMTOHooks(PRODUCT, product);
  const { user } = useSelector((state) => state.user);
  const {
    id,
    QRCode,
    code,
    name,
    description,
    purchasePrice,
    sellingPrice,
    stock,
    reservedPreorders,
    category,
    attributes,
    createdAt,
    image,
    isDeleted,
  } = product;

  return (
    <TableRow
      className={`text-left ${
        isDeleted && 'striped-background text-destructive'
      }`}
    >
      {/* //! ID */}
      <TableCell>{capitalize(id)}</TableCell>

      {/* //! QR CODE */}
      <TableCell>
        <QrCodeGenerator value={code} size={48} />
      </TableCell>

      {/* //! CODE */}
      <TableCell>{capitalize(code)}</TableCell>

      {/* //! NAME */}
      <TableCell>{capitalize(name)}</TableCell>

      {/* //! DESCRIPTION */}
      <TableCell>{capitalize(description)}</TableCell>

      {/* //! PURCHASE PRICE */}
      <TableCell className="text-lg">{purchasePrice} €</TableCell>

      {/* //! SELLING PRICE */}
      <TableCell className="text-lg">{sellingPrice} €</TableCell>

      {/* //! STOCK */}
      <TableCell
        className={`${
          isDeleted
            ? ''
            : stock > reservedPreorders
            ? 'text-success'
            : stock < reservedPreorders
            ? 'text-danger'
            : 'text-warning'
        } text-lg`}
      >
        {stock}
      </TableCell>

      {/* //! RESERVED PREORDERS */}
      <TableCell className={reservedPreorders || 'opacity-0'}>
        {reservedPreorders}
      </TableCell>

      {/* //! CATEGORY */}
      <TableCell>{capitalize(MTOdata['category'])}</TableCell>

      {/* //! ATTRIBUTES */}
      <TableCell>
        <EAVDropdown
          relateEntity={attributes}
          dropDownName={tc('attributes')}
          relateDisplayField={PRODUCT.fields.attributes.relateDisplayField}
          relateDisplayValue={PRODUCT.fields.attributes.relateDisplayValue}
          className={isDeleted && 'text-destructive'}
        />
      </TableCell>

      {/* //! CREATED AT */}
      <TableCell>{format(createdAt, 'dd/MM/yyyy - HH:mm')}</TableCell>

      {/* //! IMAGE */}
      <Drawer>
        <DrawerTrigger asChild>
          <TableCell className="text-left">
            <div className="w-14 h-14 cursor-pointer hover:scale-[1.1]">
              <img
                src={image}
                alt=""
                className="rounded-lg object-cover h-full w-full"
              />
            </div>
          </TableCell>
        </DrawerTrigger>
        <ImageDrawer title={name} description={code} imgSrc={image} />
      </Drawer>

      {/* //! ACTIONS */}
      {hasAccess(user.role, USER_ROLES.OPERATOR) && (
        <TableCell>
          <ProductsActionsDropdown code={code} isDeleted={isDeleted} />
        </TableCell>
      )}
    </TableRow>
  );
};

export default ProductsRow;
