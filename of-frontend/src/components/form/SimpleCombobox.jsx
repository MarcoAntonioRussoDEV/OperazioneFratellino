import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '../ui/form';
import { useTranslateAndCapitalize } from '@/utils/formatUtils';

const SimpleCombobox = ({
  control,
  register,
  list,
  label,
  name,
  children,
  placeholder,
  className,
}) => {
  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState('');
  const tc = useTranslateAndCapitalize();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{tc(label)}</FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <div className="flex gap-2 items-center">
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`justify-between ${className}`}
                  >
                    {field.value
                      ? list.find((el) => el === field.value)
                      : tc(placeholder) + '...'}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              {children}
            </div>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder={tc(placeholder) + '...'}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>{tc('noItems')}</CommandEmpty>
                  <CommandGroup>
                    {list.map((el) => (
                      <CommandItem
                        key={el}
                        {...register(name)}
                        value={el}
                        onSelect={(currentValue) => {
                          field.onChange(currentValue);
                          // setValue(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                      >
                        {el}
                        <Check
                          className={cn(
                            'ml-auto',
                            field.value === el ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
};

export default SimpleCombobox;
