import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatDate } from 'date-fns';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { TableCell, TableRow } from '@/components/ui/table';
import ProductsCardPreorder from './ProductsCardPreorder';
import { axios } from '@/config/axios/axiosConfig';
import { PRODUCTS_DATA } from '@/config/links/urls';
import { blobToSrc } from '@/utils/imageUtils';

const PreorderAccordion = ({
  id,
  createdAt,
  user,
  totalPrice,
  status,
  products,
  ...props
}) => {
  const tc = useTranslateAndCapitalize();
  const [textColor, setTextColor] = useState('text-warning');

  useEffect(() => {
    let color;
    switch (status) {
      case 'PENDING':
        color = 'text-warning';
        break;
      case 'COMPLETED':
        color = 'text-success';
        break;
      case 'READY':
        color = 'text-success';
        break;
      default:
        color = 'text-destructive';
    }

    setTextColor(color);
  });

  return (
    <AccordionItem value={id} {...props}>
      <AccordionTrigger className="text-left">
        <p className="w-full">{id}</p>
        <p className="w-full">{totalPrice} €</p>
        <p className="w-full">{formatDate(createdAt, 'dd/MM/yyyy - hh:mm')}</p>
        <p className={`w-full ${textColor} text-`}>{tc(status)}</p>
      </AccordionTrigger>
      <AccordionContent className="flex flex-wrap justify-between gap-2 gap-y-6 p-2">
        {products.map((product) => {
          return (
            <ProductsCardPreorder
              key={product.id}
              productCode={product.product}
              productQuantity={product.quantity}
              className={'flex-auto max-w-64 mx-auto'}
            />
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default PreorderAccordion;
