import {
  decreaseQuantity,
  deleteItem,
  increaseQuantity,
  resetCart,
} from '@/redux/cartSlice';
import { Trash2 } from 'lucide-react';
import React from 'react';
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
import { useTranslateAndCapitalize } from '@/utils/FormatUtils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const Cart = () => {
  const { cart, totalPrice } = useSelector((state) => state.cart);
  const tc = useTranslateAndCapitalize();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <Table>
      <TableCaption>
        {cart.length < 1
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
        {Object.entries(cart).map(
          ([_, { products, quantity, price, inStock }]) => {
            return (
              <TableRow key={products} className="text-baseline">
                <TableCell className="font-medium">{products}</TableCell>
                <TableCell className="font-medium flex gap-4 justify-center">
                  <button
                    className="cursor-pointer"
                    onClick={() => dispatch(decreaseQuantity(products))}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    className={`cursor-pointer ${
                      quantity >= inStock && 'text-accent'
                    }`}
                    onClick={() => dispatch(increaseQuantity(products))}
                  >
                    +
                  </button>
                </TableCell>
                <TableCell className="font-medium">{price} €</TableCell>
                <TableCell className="font-medium">
                  <Trash2
                    className="text-destructive w-5 cursor-pointer"
                    onClick={() => dispatch(deleteItem(products))}
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

export default Cart;
