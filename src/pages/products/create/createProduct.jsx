import { capitalize } from '@/utils/formatUtils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductForm from './ProductForm';

const CreateProduct = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-4xl">{capitalize(t('createNewProduct'))}</h1>
      <div className="flex justify-center text-start mt-10">
        <ProductForm />
      </div>
    </div>
  );
};

export default CreateProduct;
