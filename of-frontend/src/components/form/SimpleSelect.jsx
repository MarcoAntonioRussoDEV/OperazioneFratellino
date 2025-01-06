/* eslint-disable react/prop-types */
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormItem,
  FormControl,
  FormLabel,
  FormField,
  FormMessage,
} from '@/components/ui/form';
import { Spinner } from '../ui/spinner';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useAppHooks } from '@/hooks/useAppHooks';

const SimpleSelect = ({
  control,
  register,
  name /* valore name come html */,
  label /* stringa da visualizzare nel label */,
  list /* oggetto iterabile da mostrare come elenco del select */,
  valueField /* proprietà dell'iterabile da usare come valore */,
  placeholder = '' /* placeholder html */,
  status = 'loading' /* stato del fetch in caso di lista recuperata da api */,
  reFetch /* metodo per il refetch della lista */,
  onValueChange = () => {},
  className,
  children,
}) => {
  const { tc, dispatch } = useAppHooks();

  const renderContent = () => {
    if (status === 'success') {
      return list.map((item) => {
        return (
          <SelectItem key={item.id} value={item[valueField]}>
            {tc(item.name)}
          </SelectItem>
        );
      });
    } else if (status === 'loading') {
      return <Spinner>{tc(`loading`)}</Spinner>;
    } else {
      return (
        <Button
          variant="ghost"
          className="flex justify-center mx-auto"
          onClick={() => dispatch(reFetch())}
        >
          {tc('refresh')}
          <RefreshCcw />
        </Button>
      );
    }
  };

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="truncate">{tc(label)}</FormLabel>
            <Select
              {...register(name)}
              onValueChange={(value) => {
                field.onChange(value);
                onValueChange(value);
              }}
              onCloseAutoFocus={(e) => {
                e.preventDefault();
              }}
              {...field}
            >
              <FormControl>
                <div className="flex">
                  <SelectTrigger className={className}>
                    <SelectValue placeholder={tc(placeholder)} />
                  </SelectTrigger>
                  {children}
                </div>
              </FormControl>
              <SelectContent>{renderContent()}</SelectContent>
            </Select>
            <FormMessage translate_capitalize className="text-end" />
          </FormItem>
        )}
      />
    </>
  );
};

export default SimpleSelect;
