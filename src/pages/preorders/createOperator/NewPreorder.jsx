import React, { createContext, useEffect, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Separator } from '@/components/ui/separator';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { createSale } from '@/redux/salesSlice';
import { getAuthUser } from '@/redux/userSlice';
import { resetPreorderCart } from '@/redux/preorderCartSlice';
import withFormContext from '@/components/HOC/withFormContext';
import SimpleInput from '@/components/form/SimpleInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PREORDER_DATA, USER_DATA } from '@/config/links/urls';
import { axios } from '@/config/axios/axiosConfig';
import PreordersForm from './PreordersForm';
import PreorderCart from '../create/PreorderCart';
import { PREORDER } from '@/config/entity/entities';

const NewPreorder = () => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const { user } = useSelector((state) => state.user);
  const { preorderCart } = useSelector((state) => state.preorderCart);
  const [error, setError] = useState([]);
  const tc = useTranslateAndCapitalize();
  const dispatch = useDispatch();

  const handleConfirm = async (preorderCart) => {
    if (preorderCart.length) {
      setError('');
      delete preorderCart.price;
      const preorder = {
        preorderCart: preorderCart,
        userEmail: user.email,
        clientName,
        clientEmail,
        status: 'PENDING',
      };
      dispatch(resetPreorderCart());

      try {
        const response = await axios.post(PREORDER_DATA.create, preorder);
        return response.data;
      } catch (error) {
        console.log(error.status);
      }
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
      <PreordersForm
        handleEmail={handleEmail}
        clientEmail={clientEmail}
        setClientEmail={setClientEmail}
        clientName={clientName}
        setClientName={setClientName}
      />

      <Button
        className="mt-10"
        onClick={() => handleConfirm(preorderCart)}
        disabled={!preorderCart.length}
      >
        {tc('confirm')}
      </Button>
      <p className="text-sm text-destructive">{error}</p>
      <PreorderCart />
    </>
  );
};

export default NewPreorder;
