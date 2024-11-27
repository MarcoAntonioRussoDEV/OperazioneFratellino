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
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
  FormField,
  FormMessage,
} from '@/components/ui/form';
import { useTranslateAndCapitalize } from '@/utils/FormatUtils';
import { Spinner } from '../ui/spinner';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useDispatch } from 'react-redux';
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
  retryAttempt /* numero di tentativo del retry fetch di axios */,
  onValueChange = () => {},
}) => {
  const tc = useTranslateAndCapitalize();
  const dispatch = useDispatch();
  const renderContent = () => {
    if (status === 'success') {
      return list.map((item) => {
        return (
          <SelectItem key={item.id} value={item[valueField]}>
            {tc(item.name)}
          </SelectItem>
        );
      });
    } else if (status === 'loading' && retryAttempt === 0) {
      return <Spinner>{tc(`loading`)}</Spinner>;
    } else if (status === 'loading') {
      return (
        <Spinner className="p-2">
          {tc(`retryAttempt`) + ` n° ${retryAttempt}`}
        </Spinner>
      );
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
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{tc(label)}</FormLabel>
          <Select
            {...register(name)}
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange(value);
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={tc(placeholder)} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>{renderContent()}</SelectContent>
          </Select>
          <FormMessage translate_capitalize className="text-end" />
        </FormItem>
      )}
    />
  );
};

export default SimpleSelect;
