import React, { forwardRef } from 'react';
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
} from '../ui/form';
import { Input } from '../ui/input';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';

const SimpleInput = ({
  control,
  register,
  name,
  label,
  className = '',
  type = 'text',
  children,
  disabled,
  ...props
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
            <div className="flex gap-2 items-center">
              <Input
                type={type}
                {...register(`${name}`)}
                disabled={disabled}
                {...props}
              />
              {children}
            </div>
          </FormControl>
          <FormMessage translate_capitalize />
        </FormItem>
      )}
    />
  );
};
export default SimpleInput;
