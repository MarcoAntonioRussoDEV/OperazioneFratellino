import {
  filterProduct,
  getAllProducts,
  orderProducts,
  resetProducts,
  resetStatus,
  setItemsPerPage,
  setPage,
} from '@/redux/productSlice';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import { Spinner } from '@/components/ui/spinner';
import { capitalize, useTranslateAndCapitalize } from '@/utils/formatUtils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CircleX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import iconToast from '@/utils/toastUtils';
import { useSidebar } from '@/components/ui/sidebar';
import Paginator from '@/components/table/Paginator';
import { PRODUCT } from '@/config/entity/entities';
import { useFilterHooks } from '@/hooks/useAppHooks';

const ProductsCardsList = () => {
  const {
    products,
    status: productStatus,
    pagination: { currentPage, itemsPerPage, totalItems, totalPages },
  } = useSelector((state) => state.products);
  const searchRef = useRef();
  const { status: cartStatus, response: cartResponse } = useSelector(
    (state) => state.cart,
  );
  const [currentToast, setCurrentToast] = useState();
  const { toast, dismiss } = useToast();
  const dispatch = useDispatch();
  const tc = useTranslateAndCapitalize();
  const { isMobile } = useSidebar();

  const { handlePreviousPage, handleNextPage } = useFilterHooks(
    getAllProducts,
    resetProducts,
    filterProduct,
    orderProducts,
    PRODUCT,
    setPage,
    setItemsPerPage,
  );

  useEffect(() => {
    if (productStatus === 'idle' && isMobile) {
      dispatch(getAllProducts());
    }

    return () => {
      dispatch(resetStatus());
      dismiss(currentToast);
    };
  }, []);

  useEffect(() => {
    if (productStatus === 'idle' && isMobile) {
      dispatch(getAllProducts());
    }
  }, [productStatus]);
  useEffect(() => {
    if (cartStatus === 'added') {
      setCurrentToast(toast(iconToast(cartStatus, cartResponse)));
    }
  }, [cartStatus]);

  const handleSearch = (search) => {
    dispatch(filterProduct(search));
  };

  const clearSearch = () => {
    searchRef.current.value = '';

    handleSearch('');
  };
  const checkClearSearch = (e) => {
    if (e.key === 'Delete') {
      clearSearch();
    }
  };

  if (productStatus === 'loading') {
    return (
      <Spinner size="large" className="mt-10">
        {tc('loading')}
      </Spinner>
    );
  } else {
    return (
      <>
        <div className="md:w-1/4 flex flex-col gap-2">
          <Label className="text-start">Cerca</Label>
          <div className="relative">
            <Input
              id="custom-cancel-button"
              onChange={(e) => handleSearch(e.target.value)}
              type="search"
              ref={searchRef}
              onKeyDown={checkClearSearch}
            />
            <p className="absolute top-1/2 -translate-y-1/2 right-0 p-2">
              <CircleX
                className={`w-4 opacity-40 cursor-pointer hover:opacity-100 ${
                  searchRef.current && searchRef.current.value ? '' : 'hidden'
                }`}
                onClick={clearSearch}
              />
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 justify-center mt-10">
          {products.map((product) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                className="mx-2"
              />
            );
          })}
        </div>
        <Paginator
          handlePrevious={handlePreviousPage}
          handleNext={handleNextPage}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          setPage={setPage}
        />
      </>
    );
  }
};

export default ProductsCardsList;
