import React, { forwardRef, useEffect, useState } from 'react';
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';
import { Switch } from '@/components/ui/switch';
import { Label } from '../ui/label';

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
  const [showPassword, setShowPassword] = useState(false);
  const [typeToggle, setTypeToggle] = useState(type);

  useEffect(() => {
    setTypeToggle(showPassword ? 'text' : type);
  }, [showPassword]);
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel>{tc(label)}</FormLabel>
          <FormControl>
            <>
              <div className="flex gap-2 items-center">
                <Input
                  type={typeToggle}
                  {...register(`${name}`)}
                  disabled={disabled}
                  {...props}
                />
                {children}
              </div>
              {type === 'password' && (
                <div className="flex items-center gap-2 justify-between">
                  <Label className="px-1 text-xs text-muted-foreground">
                    {tc('showPassword')}
                  </Label>
                  <Switch
                    className="h-5 scale-[0.8] data-[state=checked]:bg-muted-foreground"
                    checked={showPassword}
                    onCheckedChange={() => setShowPassword(!showPassword)}
                  />
                </div>
              )}
            </>
          </FormControl>
          <FormMessage translate_capitalize />
        </FormItem>
      )}
    />
  );
};
export default SimpleInput;
