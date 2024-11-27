import { resetCart } from '@/redux/cartSlice';
import React from 'react';
import { useSelector } from 'react-redux';

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  console.log('cart: ', cart);
  return (
    <div className="grid gap-2">
      {Object.entries(cart).map(([_, { product_code, quantity, price }]) => {
        return (
          <div
            className="border rounded-lg p-3 flex justify-between gap-16"
            key={product_code}
          >
            <p>{product_code}</p>
            <p> {quantity}</p>
            <p>{price}€</p>
          </div>
        );
      })}
    </div>
  );
};

export default Cart;
