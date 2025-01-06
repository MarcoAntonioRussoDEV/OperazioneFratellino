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
import PropTypes from 'prop-types';

import { capitalize } from '@/utils/formatUtils';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../ui/spinner';
import { RefreshCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { retryAttempt } from '@/config/axios/axiosConfig';

const CustomSelect = ({
  form,
  label,
  iterable,
  name,
  onValueChangeFunc,
  customValue,
  selector,
  reFetch,
}) => {
  const { t } = useTranslation();
  const { error, status } = selector;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{capitalize(t(label))}</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onValueChangeFunc(value);
            }}
            value={field.value}
            {...field}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {iterable.length > 0 ? (
                iterable.map((item) => {
                  return (
                    <SelectItem
                      key={item.id}
                      value={item[customValue] ?? item.id}
                    >
                      {capitalize(t(item.name))}
                    </SelectItem>
                  );
                })
              ) : status === 'failed' ? (
                <Button
                  variant="ghost"
                  className="flex justify-center mx-auto"
                  onClick={() => reFetch()}
                >
                  {capitalize(t('refresh'))}
                  <RefreshCcw />
                </Button>
              ) : status === 'loading' && retryAttempt ? (
                <Spinner>
                  {capitalize(t(`retryAttempt`) + ` n° ${retryAttempt}`)}
                </Spinner>
              ) : (
                <Spinner>{capitalize(t(`loading`))}</Spinner>
              )}
            </SelectContent>
          </Select>
          <FormMessage className="text-end" />
        </FormItem>
      )}
    />
  );
};

CustomSelect.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onValueChangeFunc: PropTypes.func,
  iterable: PropTypes.object.isRequired,
  customValue: PropTypes.string,
  reFetch: PropTypes.func,
  selector: PropTypes.object,
};
export default CustomSelect;
