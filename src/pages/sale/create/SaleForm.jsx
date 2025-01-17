import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import iconToast from '@/utils/toastUtils';
import { Form } from '@/components/ui/form';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
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
import { sellCartGetProductByCode } from '@/redux/sellCartSlice';
import { getAllProducts } from '@/redux/productSlice';
import { resetStatus } from '@/redux/salesSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SaleForm = ({
  className,
  handleEmail,
  setClientEmail,
  setClientName,
  clientEmail,
  clientName,
}) => {
  const { t } = useTranslation();
  const [isScan, setIsScan] = useState(false);
  const {
    sales,
    status: salesStatus,
    error: salesError,
    response: itemResponse,
  } = useSelector((state) => state.sales);
  const {
    products,
    status: productsStatus,
    error: productsError,
  } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const tc = useTranslateAndCapitalize();

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(getAllProducts());
    }
  }, [productsStatus, dispatch]);

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
    getValues,
    reset,
    setValue,
    trigger,

    formState: { isValid, errors, setIsValid },
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
    dispatch(sellCartGetProductByCode(data));
    reset();
  };

  const handleScan = (result) => {
    const code = result[0].rawValue;
    setValue('products', code);
    trigger('products');
    const data = { products: code, quantity: 1 };
    onSubmit(data);
  };

  const handleShowScan = () => {
    setIsScan((oldValue) => !oldValue);
  };

  useEffect(() => {
    return () => {
      dispatch(resetStatus());
    };
  }, []);

  return (
    <Form {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`grid grid-cols-1 lg:grid-cols-2 text-start gap-4 max-w-[50vw] mx-auto ${className}`}
      >
        <div className="mx-auto rounded-xl overflow-hidden col-span-full max-h-64">
          {isScan && <Scanner onScan={handleScan} allowMultiple={true} />}
        </div>

        <EnhancedSimpleCombobox
          list={products
            .filter((product) => !product.isDeleted)
            .map((product) => product.code)}
          name={'products'}
          label={tc('code')}
          placeholder="selectProduct"
          className="w-full"
        >
          <ScanQrCode
            onClick={handleShowScan}
            className={`cursor-pointer  ${
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
        <section className="flex flex-col gap-2 justify-end">
          <Label>{tc('clientEmail')}</Label>
          <Input
            name="clientEmail"
            label={tc('clientEmail')}
            type="email"
            value={clientEmail}
            onChange={(e) => handleEmail(e.target.value)}
          />
        </section>
        <section className="flex flex-col gap-2 justify-end">
          <Label>{tc('clientName')}</Label>
          <Input
            name="clientName"
            label={tc('clientName')}
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </section>

        <Button
          isLoading={salesStatus === 'loading'}
          className="lg:col-span-2"
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
