import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import iconToast from '@/utils/toastUtils';
import { Form } from '@/components/ui/form';
import { useTranslateAndCapitalize } from '@/utils/FormatUtils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { SALES } from '@/config/entity/entities';
import SimpleInput from '@/components/form/SimpleInput';
import withFormContext from '@/components/HOC/withFormContext';
import SimpleCombobox from '@/components/form/SimpleCombobox';
const EnhancedSimpleInput = withFormContext(SimpleInput);
const EnhancedSimpleCombobox = withFormContext(SimpleCombobox);
import { Scanner } from '@yudiel/react-qr-scanner';
import { ScanQrCode } from 'lucide-react';
import { getProductByCode } from '@/redux/cartSlice';
import { getAllProducts } from '@/redux/productSlice';

const SaleForm = () => {
  const { cart } = useSelector((state) => state.cart);
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const [isScan, setIsScan] = useState(false);
  const {
    sales,
    status: salesStatus,
    error: salesError,
    response: itemResponse,
  } = useSelector((state) => state.sales);
  const { products, status: productsStatus } = useSelector(
    (state) => state.products,
  );
  const dispatch = useDispatch();
  const { toast } = useToast();
  const tc = useTranslateAndCapitalize();

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(getAllProducts())
        .unwrap()
        .catch((error) => console.error('Failed to load products:', error));
    }
  }, [productsStatus, dispatch]);

  useEffect(() => {
    console.log('productsStatus: ', productsStatus);
  }, [productsStatus]);

  const methods = useForm({
    resolver: zodResolver(SALES.formSchema),
    defaultValues: SALES.defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    register,
    getFieldState,
    reset,
    setValue,
    trigger,
    formState: { isValid, errors },
  } = methods;

  useEffect(() => {
    if (salesStatus === 'created' || salesStatus === 'failed') {
      const currentToast = toast(iconToast(salesStatus, t(itemResponse)));
      const timer = setTimeout(() => {
        dispatch(reset());
      }, 6000);
      reset();
      return () => {
        clearTimeout(timer);
        currentToast.dismiss();
        reset();
      };
    }
  }, [salesStatus, salesError, itemResponse, toast, dispatch]);

  const onSubmit = (data) => {
    data = { ...data, user_email: user.email };
    // console.log(data);
    // dispatch(createSale(data));
    dispatch(getProductByCode(data));
  };

  const handleScan = (result) => {
    // console.log(result);
    // console.log(result[0].rawValue);
    const code = result[0].rawValue;
    setValue('products', code);
    trigger('products');
    const data = { products: code, quantity: 1 };
    dispatch(getProductByCode(data));

    // dispatch(addItem({ products: result[0].rawValue, quantity: 1 }));
    // console.log(cart);
  };

  const handleShowScan = () => {
    setIsScan((oldValue) => !oldValue);
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="w-1/2  mx-auto mt-10 rounded rounded-xl overflow-hidden">
          {isScan && <Scanner onScan={handleScan} allowMultiple={false} />}
        </div>

        <EnhancedSimpleCombobox
          list={products.map((product) => product.code)}
          // name={key}
          label={tc('code')}
          // type={value.type}
          // min="1"
        >
          <ScanQrCode
            onClick={handleShowScan}
            className={`cursor-pointer ${
              isScan ? 'text-destructive' : 'text-green-500'
            }`}
          />
        </EnhancedSimpleCombobox>
        <EnhancedSimpleInput
          name="quantity"
          label={tc('quantity')}
          type="number"
          min={1}
        />

        <Button
          isLoading={salesStatus === 'loading'}
          className="mt-5 col-span-3"
          disabled={!isValid}
          variant="outline"
        >
          {tc('add')}
        </Button>
      </form>
    </Form>
  );
};
SaleForm.propTypes = {
  entity: PropTypes.object.isRequired,
  resetItem: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
};
export default SaleForm;
