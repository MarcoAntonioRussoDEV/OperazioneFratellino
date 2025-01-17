import React, { createContext, useEffect, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import SaleForm from './SaleForm';
import SellCart from './SellCart';
import { Separator } from '@/components/ui/separator';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { createSale } from '@/redux/salesSlice';
import { getAuthUser } from '@/redux/userSlice';
import { resetCart } from '@/redux/sellCartSlice';
import withFormContext from '@/components/HOC/withFormContext';
import SimpleInput from '@/components/form/SimpleInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { USER_DATA } from '@/config/links/urls';
import { axios } from '@/config/axios/axiosConfig';

const NewSale = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const { sellCart, totalPrice } = useSelector((state) => state.sellCart);
  const { user } = useSelector((state) => state.user);
  const [error, setError] = useState([]);
  const tc = useTranslateAndCapitalize();
  const dispatch = useDispatch();
  const handleConfirm = (cart) => {
    if (cart.length) {
      setError('');
      delete cart.price;
      const sale = {
        cart: cart,
        userEmail: user.email,
        clientName,
        clientEmail,
      };
      console.log(sale);
      dispatch(createSale(sale));
      dispatch(resetCart());
    } else {
      setError('Aggiungi almeno un prodotto al carrello');
    }
  };

  const handleEmail = async (email) => {
    setClientEmail(email);
    const response = await axios.get(USER_DATA.byEmail + email);
    if (response.data) {
      setClientName(response.data.name);
    }
  };

  return (
    <>
      <SaleForm
        handleEmail={handleEmail}
        clientEmail={clientEmail}
        setClientEmail={setClientEmail}
        clientName={clientName}
        setClientName={setClientName}
      />

      <Button
        className="mt-10"
        onClick={() => handleConfirm(sellCart)}
        disabled={!sellCart.length}
      >
        {tc('confirm')}
      </Button>
      <p className="text-sm text-destructive">{error}</p>
      <SellCart />
    </>
  );
};

export default NewSale;
