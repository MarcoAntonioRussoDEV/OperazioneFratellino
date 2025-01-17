import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import {
  convertToPreorder,
  decreaseItemToUserCart,
  decreaseQuantity,
  deleteItem,
  deleteItemToUserCart,
  getUserCart,
  increaseItemToUserCart,
  increaseQuantity,
  resetStatus as resetCartStatus,
} from '@/redux/cartSlice';
import { getAuthUser, resetStatus } from '@/redux/userSlice';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import iconToast from '@/utils/toastUtils';
import { Button } from '@/components/ui/button';

const Cart = () => {
  const tc = useTranslateAndCapitalize();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { toast, dismiss } = useToast();
  const [currentToast, setCurrentToast] = useState();
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  const {
    cart,
    status: cartStatus,
    totalPrice,
    response: cartResponse,
  } = useSelector((state) => state.cart);

  const { user, status: userStatus } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAuthUser());
    dispatch(resetCartStatus());
    return () => {
      dispatch(resetStatus());
      dispatch(resetCartStatus());
      dismiss(currentToast);
    };
  }, []);

  useEffect(() => {
    if (userStatus === 'succeeded') {
      dispatch(getUserCart(user.email));
    }
  }, [userStatus]);

  useEffect(() => {
    if (cartStatus === 'fulfilled') {
      setCurrentToast(toast(iconToast(cartStatus, cartResponse)));
    }

    if (cart.products?.length < 1) {
      setIsCartEmpty(true);
    } else {
      setIsCartEmpty(false);
    }
  }, [cartStatus]);

  const handleToPreorder = () => {
    dispatch(convertToPreorder());
  };

  useEffect(() => {
    if (cartStatus === 'converted') {
      dispatch(getUserCart(user.email));
      setCurrentToast(toast(iconToast(cartStatus, cartResponse)));
    }
  }, [cartStatus]);

  return (
    <>
      {!cart ? (
        <Spinner />
      ) : (
        <>
          <Table>
            <TableCaption
              className={`${
                isCartEmpty || 'font-semibold text-foreground text-2xl'
              }`}
            >
              {isCartEmpty
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
              {cart.products?.map(({ id, product, quantity, price }) => {
                return (
                  <TableRow
                    key={product}
                    className="text-baseline pulse text-start"
                  >
                    <TableCell className="font-medium ">{product}</TableCell>
                    <TableCell className="font-medium flex gap-4 justify-start">
                      <button
                        className="cursor-pointer"
                        onClick={() =>
                          dispatch(
                            decreaseItemToUserCart({
                              productCode: product,
                              userEmail: user.email,
                            }),
                          )
                        }
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button
                        className="cursor-pointer"
                        onClick={() =>
                          dispatch(increaseItemToUserCart(product))
                        }
                      >
                        +
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">{price} €</TableCell>
                    <TableCell className="font-medium">
                      <Trash2
                        className="text-destructive w-5 cursor-pointer"
                        onClick={() =>
                          dispatch(
                            deleteItemToUserCart({
                              productCode: product,
                              userEmail: user.email,
                            }),
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button disabled={isCartEmpty} onClick={handleToPreorder}>
            {tc('confirm')}
          </Button>
        </>
      )}
    </>
  );
};

export default Cart;
