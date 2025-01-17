import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { Button } from '@/components/ui/button';
import { addItemToUserCart } from '@/redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

const ProductCard = ({ product, className }) => {
  const tc = useTranslateAndCapitalize();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(user.email);
  }, []);
  return (
    <Card
      className={
        'w-80  h-96 overflow-hidden flex flex-col  justify-between hover:scale-[1.02] duration-150 ' +
        className
      }
    >
      <CardHeader className="p-0 rounded-t-xl overflow-hidden h-48 w-full relative">
        <img
          src={product.image}
          alt="productImage"
          className="object-cover h-full w-full"
        />
        <CardTitle className="absolute opacity-90 -translate-x-1/2 bottom-0 left-1/2 p-2 bg-accent w-full">
          {product.name} - {product.code}
        </CardTitle>
        {/* <CardDescription className="mx-2">{`${product.code} - ${product.description}`}</CardDescription> */}
      </CardHeader>
      <CardContent className="flex justify-between gap-4 p-0 px-2">
        <ol className="separator w-full">
          {Object.entries(product.attributes).map(
            ([_, { name, value }], idx) => {
              return (
                <li key={idx} className="flex justify-between py-1">
                  <p className="text-muted-foreground">{tc(name)}:</p>
                  <p>{tc(value)}</p>
                </li>
              );
            },
          )}
        </ol>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-2xl">{product.sellingPrice}€</p>
        <Button
          onClick={() => {
            dispatch(
              addItemToUserCart({
                productCode: product.code,
                userEmail: user.email,
              }),
            );
          }}
        >
          {tc('addToCart')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
