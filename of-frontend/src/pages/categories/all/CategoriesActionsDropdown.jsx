import ActionsDropdown from '@/components/table/ActionsDropdown';
import { useAppHooks } from '@/hooks/useAppHooks';
import { deleteCategory } from '@/redux/categorySlice';
import { Pencil } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoriesActionsDropdown = ({ id, code }) => {
  const { tc } = useAppHooks();
  const navigate = useNavigate();
  return (
    <ActionsDropdown
      label={code}
      entityName={'category'}
      primaryKey={id}
      permaDelete={deleteCategory}
    >
      <button
        className="flex justify-between gap-4"
        onClick={() => {
          navigate(`/categories/edit/${id}`);
        }}
      >
        {tc('category.edit')}
        <Pencil />
      </button>
    </ActionsDropdown>
  );
};

export default CategoriesActionsDropdown;
