import React, { useEffect, useState } from 'react';
import ProductsTable from './table/ProductsTable';
import ProductsCardsList from './cards/ProductsCardsList';
import { Button } from '@/components/ui/button.jsx';
import { Grid, LayoutGrid, Table } from 'lucide-react';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { useSidebar } from '@/components/ui/sidebar';
import { hasAccess } from '@/utils/authService';
import { USER_ROLES } from '@/utils/userRoles';
import { useSelector } from 'react-redux';

const ProductsList = () => {
  const tc = useTranslateAndCapitalize();
  const [layout, setLayout] = useState('table');
  const { isMobile } = useSidebar();
  const { user } = useSelector((state) => state.user);

  const handleLayout = () => {
    if (layout === 'table') {
      setLayout('grid');
    } else {
      setLayout('table');
    }
  };

  useEffect(() => {
    if (isMobile) {
      setLayout('grid');
    }
  }, [isMobile]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-start px-1">{tc('layout')}</p>
        {hasAccess(user.role, USER_ROLES.OPERATOR) && (
          <button
            className="flex gap-2 items-center border-2 w-fit p-2 px-4 rounded-xl hover:bg-foreground hover:text-background"
            onClick={handleLayout}
          >
            {layout === 'table' ? (
              <>
                <LayoutGrid size={36} />
                <span className="font-bold">{tc('grid')}</span>
              </>
            ) : (
              <>
                <Table size={36} />
                <span className="font-bold">{tc('table')}</span>
              </>
            )}
          </button>
        )}
      </div>
      {layout === 'table' && hasAccess(user.role, USER_ROLES.OPERATOR) ? (
        <ProductsTable />
      ) : (
        <ProductsCardsList />
      )}
    </div>
  );
};

export default ProductsList;
