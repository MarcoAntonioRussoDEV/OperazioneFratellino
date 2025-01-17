import { capitalize } from '@/utils/formatUtils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CategoryForm from './CategoryForm';

const CreateCategories = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-4xl">{capitalize(t('createNewCategory'))}</h1>
      <div className="flex justify-center text-start mt-10">
        <CategoryForm />
      </div>
    </div>
  );
};

export default CreateCategories;
