import React, { createContext, useEffect, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import SaleForm from './SaleForm';
import Cart from './Cart';
import { Separator } from '@/components/ui/separator';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { useTranslateAndCapitalize } from '@/utils/FormatUtils';
import { createSale } from '@/redux/salesSlice';
import { getAuthUser } from '@/redux/userSlice';
import { resetCart } from '@/redux/cartSlice';
const NewSale = () => {
  const { cart, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const [error, setError] = useState([]);
  const tc = useTranslateAndCapitalize();
  const dispatch = useDispatch();
  const handleConfirm = (cart) => {
    if (cart.length) {
      setError('');
      delete cart.price;
      const sale = { cart: cart, userEmail: user.email };
      console.log(sale);
      dispatch(createSale(sale));
      dispatch(resetCart());
    } else {
      setError('Aggiungi almeno un prodotto al carrello');
    }
  };
  return (
    <>
      <div className="grid grid-cols-4 place-items-center">
        <SaleForm />
        <Separator orientation="vertical" />
        <div className="col-span-2">
          <Cart />
        </div>
      </div>
      <Button
        className="mt-10"
        onClick={() => handleConfirm(cart)}
        disabled={!cart.length}
      >
        {tc('confirm')}
      </Button>
      <p className="text-sm text-destructive">{error}</p>
    </>
  );
};

export default NewSale;
