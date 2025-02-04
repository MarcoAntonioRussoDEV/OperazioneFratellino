import { Form } from '@/components/ui/form';
import React, { useEffect, useState } from 'react';
import { axios } from '../../../config/axios/axiosConfig';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { capitalize, useTranslateAndCapitalize } from '@/utils/formatUtils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PREORDER, PREORDER_FORM, USER } from '@/config/entity/entities';
import withFormContext from '@/components/HOC/withFormContext';
import SimpleInput from '@/components/form/SimpleInput';
import SimpleCombobox from '@/components/form/SimpleCombobox';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { ScanQrCode } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';

import iconToast from '@/utils/toastUtils';
const EnhancedSimpleInput = withFormContext(SimpleInput);
const EnhancedSimpleCombobox = withFormContext(SimpleCombobox);
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { getAllProducts } from '@/redux/productSlice';
import { USER_DATA } from '@/config/links/urls';
import { preorderCartGetProductByCode } from '@/redux/preorderCartSlice';
import { getAuthUser } from '@/redux/userSlice';
import { getAllStatus } from '@/redux/statusSlice';

const PreordersForm = ({
  className,
  handleEmail,
  setClientEmail,
  setClientName,
  clientEmail,
  clientName,
}) => {
  const { user, status: userStatus } = useSelector((state) => state.user);
  const { status, fetchStatus: preorderStatus } = useSelector(
    (state) => state.preorderStatus,
  );
  const [isScan, setIsScan] = useState(false);

  const tc = useTranslateAndCapitalize();
  const { t } = useTranslation();
  const {
    products,
    status: productsStatus,
    error: productsError,
  } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const methods = useForm({
    resolver: zodResolver(PREORDER_FORM.formSchema),
    defaultValues: PREORDER_FORM.defaultValues,
    mode: 'onChange',
  });
  const handleShowScan = () => {
    setIsScan((oldValue) => !oldValue);
  };
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

  const handleScan = (result) => {
    const code = result[0].rawValue;
    setValue('product', code);
    trigger('product');
    const data = { products: code, quantity: 1 };
    onSubmit(data);
  };
  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(getAllProducts());
    }
  }, [productsStatus, dispatch]);

  const onSubmit = (data) => {
    dispatch(preorderCartGetProductByCode(data));
    reset();
  };

  useEffect(() => {
    dispatch(getAuthUser());
    dispatch(getAllStatus());
  }, []);

  useEffect(() => {
    if (userStatus === 'succeeded') {
      setClientEmail('clientEmail', user.email);
      handleEmail(user.email);
    }
  }, [userStatus]);

  return (
    <Form {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`grid grid-cols-1 lg:grid-cols-2 text-start gap-4 max-w-[50vw] mx-auto`}
      >
        <div className="mx-auto rounded-xl overflow-hidden col-span-full max-h-64">
          {isScan && <Scanner onScan={handleScan} allowMultiple={true} />}
        </div>
        <EnhancedSimpleCombobox
          list={products
            .filter((product) => !product.isDeleted)
            .map((product) => product.code)}
          name={'product'}
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
        {/* <EnhancedSimpleCombobox
          list={status.map((product) => product.value)}
          name={'status'}
          label={tc('status')}
          placeholder="selectStatus"
          className="w-full"
        /> */}
        <Button
          isLoading={preorderStatus === 'loading'}
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

export default PreordersForm;
