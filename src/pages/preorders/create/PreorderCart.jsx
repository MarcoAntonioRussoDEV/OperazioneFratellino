import {
  decreaseQuantity,
  deleteItem,
  increaseQuantity,
  resetPreorderCart,
} from '@/redux/preorderCartSlice';
import { Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const PreorderCart = () => {
  const { preorderCart, totalPrice } = useSelector(
    (state) => state.preorderCart,
  );
  const tc = useTranslateAndCapitalize();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <Table>
      <TableCaption>
        {preorderCart.length < 1
          ? tc('cartIsEmpty')
          : `${tc('totalPrice')}: ${totalPrice} €`}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{t('code').toUpperCase()}</TableHead>
          <TableHead>{t('quantity').toUpperCase()}</TableHead>
          <TableHead>{t('unitPrice').toUpperCase()}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(preorderCart).map(
          ([_, { product, quantity, price, inStock }]) => {
            return (
              <TableRow key={product} className="text-left pulse">
                <TableCell className="font-medium">{product}</TableCell>
                <TableCell className="font-medium flex gap-4 justify-start">
                  <button
                    className="cursor-pointer"
                    onClick={() => dispatch(decreaseQuantity(product))}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    className={`cursor-pointer ${
                      quantity >= inStock && 'text-accent'
                    }`}
                    onClick={() => dispatch(increaseQuantity(product))}
                  >
                    +
                  </button>
                </TableCell>
                <TableCell className="font-medium">{price} €</TableCell>
                <TableCell className="font-medium">
                  <Trash2
                    className="text-destructive w-5 cursor-pointer"
                    onClick={() => dispatch(deleteItem(product))}
                  />
                </TableCell>
              </TableRow>
            );
          },
        )}
      </TableBody>
    </Table>
  );
};

export default PreorderCart;
