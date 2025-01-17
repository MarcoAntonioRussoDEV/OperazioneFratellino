import React from 'react';
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
} from '../ui/form';
import { Input } from '../ui/input';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { Textarea } from '../ui/textarea';
const SimpleTextarea = ({
  control,
  register,
  name,
  label,
  className = '',
  disabled,
}) => {
  const tc = useTranslateAndCapitalize();
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{tc(label)}</FormLabel>
          <FormControl>
            <Textarea {...register(`${name}`)} disabled={disabled} />
          </FormControl>
          <FormMessage translate_capitalize />
        </FormItem>
      )}
    />
  );
};

export default SimpleTextarea;
