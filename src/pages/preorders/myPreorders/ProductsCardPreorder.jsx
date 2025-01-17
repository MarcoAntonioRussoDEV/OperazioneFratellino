import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { axios } from '@/config/axios/axiosConfig';
import { PRODUCTS_DATA } from '@/config/links/urls';
import { isEmpty } from '@/utils/booleanUtils';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { blobToSrc } from '@/utils/imageUtils';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ProductsCardPreorder = ({ productCode, productQuantity, className }) => {
  const tc = useTranslateAndCapitalize();
  const [product, setProduct] = useState({});

  const fetchProduct = async () => {
    try {
      const response = await axios.get(PRODUCTS_DATA.byCode + productCode);
      response.data.image = response.data.image
        ? blobToSrc(response.data.image)
        : '/img-placeholder.webp';
      setProduct(response.data);
    } catch (error) {
      console.log('error: ', error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  if (isEmpty(product)) {
    return <Spinner />;
  } else {
    return (
      <Card
        className={`overflow-hidden flex flex-col  justify-between hover:scale-[1.02] duration-150 ${className}`}
      >
        <CardHeader className="p-0 rounded-t-xl overflow-hidden h-36 w-full relative">
          <img
            src={product.image}
            alt="productImage"
            className="object-cover h-full w-full"
            style={{ flex: '1 1 200px' }}
          />
          <CardTitle className="absolute opacity-90 -translate-x-1/2 bottom-0 left-1/2 p-2 bg-accent w-full">
            {product.name} - {product.code}
          </CardTitle>
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
        <CardFooter className="flex justify-between items-end p-2">
          <p className="text-2xl">{product.sellingPrice}€</p>
          <p className="text-muted-foreground text-md">
            {tc('quantity')}: {productQuantity}
          </p>
        </CardFooter>
      </Card>
    );
  }
};

export default ProductsCardPreorder;
