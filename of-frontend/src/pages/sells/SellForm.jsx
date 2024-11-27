import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import iconToast from '@/utils/toastUtils';
import { Spinner } from '@/components/ui/spinner.jsx';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslateAndCapitalize } from '@/utils/FormatUtils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { SELLS } from '@/config/entity/entities';
import SimpleInput from '@/components/form/SimpleInput';
import withFormContext from '@/components/HOC/withFormContext';
const EnhancedSimpleInput = withFormContext(SimpleInput);
import { Scanner } from '@yudiel/react-qr-scanner';
import { createSell } from '@/redux/sellsSlice';
import { ScanQrCode } from 'lucide-react';
import { addItem, getProductByCode } from '@/redux/cartSlice';

const SellForm = () => {
  const { cart } = useSelector((state) => state.cart);
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const [isScan, setIsScan] = useState(true);
  const {
    sells,
    status: sellsStatus,
    error: sellsError,
    response: itemResponse,
  } = useSelector((state) => state.sells);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const tc = useTranslateAndCapitalize();

  const methods = useForm({
    resolver: zodResolver(SELLS.formSchema),
    defaultValues: SELLS.defaultValues,
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
    if (sellsStatus === 'success' || sellsStatus === 'failed') {
      const currentToast = toast(iconToast(sellsStatus, t(itemResponse)));
      const timer = setTimeout(() => {
        dispatch(reset());
      }, 6000);
      reset();
      return () => {
        clearTimeout(timer);
        currentToast.dismiss();
        dispatch(reset());
        reset();
      };
    }
  }, [sellsStatus, sellsError, itemResponse, toast, dispatch]);

  const onSubmit = (data) => {
    console.log('data: ', data);

    // data = { ...data, user_email: user.email };
    // console.log(data);
    // dispatch(createSell(data));
    dispatch(getProductByCode(data));
  };

  const handleScan = (result) => {
    // console.log(result);
    // console.log(result[0].rawValue);
    const code = result[0].rawValue;
    setValue('product_code', code);
    trigger('product_code');
    const data = { product_code: code, quantity: 1 };
    dispatch(getProductByCode(data));

    // dispatch(addItem({ product_code: result[0].rawValue, quantity: 1 }));
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
        {Object.entries(SELLS.fields)
          .filter(([key, value]) => value.isFillable)
          .map(([key, value]) => {
            return (
              <EnhancedSimpleInput key={key} name={key} label={key}>
                {key == 'product_code' && (
                  <ScanQrCode onClick={handleShowScan} />
                )}
              </EnhancedSimpleInput>
            );
          })}
        <Button
          isLoading={sellsStatus === 'loading'}
          className="mt-10 col-span-3"
          disabled={!isValid}
        >
          {tc('add')}
        </Button>
      </form>
    </Form>
  );
};
SellForm.propTypes = {
  entity: PropTypes.object.isRequired,
  resetItem: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
};
export default SellForm;
