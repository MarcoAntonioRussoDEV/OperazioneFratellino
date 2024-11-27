import React, { createContext, useEffect, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import SellForm from './SellForm';
import Cart from './Cart';
import { Separator } from '@/components/ui/separator';
import { useSelector } from 'react-redux';
const NewSell = () => {
  const { cart, totalPrice } = useSelector((state) => state.cart);

  // useEffect(() => {
  //   if (cart.length) {
  //     const productCart = cart.map((product) =>
  //       getProductByCode(product.product_code),
  //     );
  //     console.log(productCart);
  //     setTotalPrice(productCart.reduce((acc, product) => acc + product.price));
  //   }
  // }, [cart]);

  return (
    <>
      <div className="grid grid-cols-3 place-items-center">
        <SellForm />
        <Separator orientation="vertical" />
        <Cart />
      </div>
      <p className="mt-2 text-2xl">{totalPrice} €</p>
    </>
  );
};

export default NewSell;
