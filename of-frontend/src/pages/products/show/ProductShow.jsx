import { useAppHooks, useToastHooks } from '@/hooks/useAppHooks';
import { getProductByCode, resetStatus } from '@/redux/productSlice';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addItemToUserCart, getUserCart } from '@/redux/cartSlice';
import { STATUS_ENUM } from '@/utils/toastUtils';

const ProductShow = () => {
  const { code } = useParams();
  const { dispatch, tc } = useAppHooks();
  const {
    product: {
      code: productCode,
      name,
      description,
      sellingPrice,
      image,
      attributes,
    },
  } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);

  const { status, response } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getProductByCode(code));
    dispatch(getUserCart(user.email));

    return () => {
      dispatch(resetStatus());
    };
  }, []);

  useToastHooks(status, [STATUS_ENUM.ADDED, STATUS_ENUM.FAILED], response);

  useEffect;
  return (
    <div className="flex flex-col lg:flex-row justify-start items-center lg:items-start gap-4">
      <figure className="w-1/2 h-auto rounded-lg overflow-hidden">
        <img
          className="object-cover w-full aspect-square"
          src={image}
          alt={`${code}_image`}
        />
      </figure>

      <article className="flex-1 flex flex-col justify-between h-full gap-4 p-4">
        <header className="flex flex-col gap-2">
          <h1 className="text-5xl mx-auto">{name}</h1>
          <h2 className="text-muted-foreground">{code}</h2>
        </header>
        <section>
          {attributes?.map((attribute, idx) => (
            <div key={idx + attribute.name} className="flex gap-2">
              <h3>{tc(attribute.name)}:</h3>
              <p className="text-muted-foreground">{attribute.value}</p>
            </div>
          ))}
        </section>
        <section className="flex justify-between">
          <p className="text-3xl">{sellingPrice} €</p>
          <Button
            onClick={() => {
              dispatch(
                addItemToUserCart({
                  productCode: productCode,
                  userEmail: user.email,
                }),
              );
            }}
          >
            {tc('addToCart')}
          </Button>
        </section>
      </article>
    </div>
  );
};

export default ProductShow;
