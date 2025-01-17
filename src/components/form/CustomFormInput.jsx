import React from 'react';
import {
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
  FormField,
  FormMessage,
} from '@/components/ui/form';
import { capitalize } from '@/utils/formatUtils';
import { Input } from '../ui/input';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
const CustomFormInput = ({
  form,
  type,
  name,
  label,
  value,
  disabled = false,
}) => {
  const { errors } = form.formState;
  const { t } = useTranslation();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{capitalize(t(label))}</FormLabel>
          <FormControl>
            <Input
              type={type}
              className={errors[name] ? 'border-destructive' : ''}
              disabled={disabled}
              {...field}
              value={value}
            />
          </FormControl>
          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
};

CustomFormInput.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.string,
};

export default CustomFormInput;
