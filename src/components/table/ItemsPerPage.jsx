import React from 'react';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components//ui/select';
import { useAppHooks } from '@/hooks/useAppHooks';

const ItemsPerPage = ({
  placeholder,
  values,
  className,
  onValueChange,
  itemsPerPage,
}) => {
  const { tc } = useAppHooks();
  if (itemsPerPage > values[values.length - 1]) {
    itemsPerPage = -1;
  }
  return (
    <Select value={itemsPerPage} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {values.map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
        <SelectItem value={-1}>{tc('all')}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ItemsPerPage;
