import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import iconToast from '@/utils/toastUtils';
import { Spinner } from '@/components/ui/spinner.jsx';

import {
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
  FormField,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { capitalize } from '@/utils/formatUtils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const EntityForm = ({ entity, resetItem, createItem }) => {
  const { t } = useTranslation();
  const {
    [entity.store]: items,
    status: itemStatus,
    error: itemError,
    response: itemResponse,
  } = useSelector((state) => state[entity.store]);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(entity.formSchema),
    defaultValues: entity.defaultValues,
    mode: 'onChange',
  });
  const {
    formState: { isValid, errors },
  } = form;

  useEffect(() => {
    if (itemStatus === 'success' || itemStatus === 'failed') {
      const currentToast = toast(iconToast(itemStatus, t(itemResponse)));
      const timer = setTimeout(() => {
        dispatch(resetItem());
      }, 6000);
      form.reset();
      return () => {
        clearTimeout(timer);
        currentToast.dismiss();
        dispatch(resetItem());
        form.reset();
      };
    }
  }, [itemStatus, itemError, itemResponse, t, toast, dispatch]);

  const handleSubmit = (data) => {
    dispatch(createItem(data));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4 items-end"
      >
        {Object.entries(entity.fields).map(([key, { isFillable, type }]) => {
          if (isFillable) {
            return (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{capitalize(t(key))}</FormLabel>
                    <FormControl>
                      <Input
                        type={key}
                        className={errors.name ? 'border-destructive' : ''}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-end" />
                  </FormItem>
                )}
              />
            );
          }
        })}
        <Button
          size="thin"
          isNotValid={!isValid}
          isLoading={itemStatus === 'loading'}
        >
          {t('create').toUpperCase()}
        </Button>
      </form>
    </Form>
  );
};
EntityForm.propTypes = {
  entity: PropTypes.object.isRequired,
  resetItem: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
};
export default EntityForm;
