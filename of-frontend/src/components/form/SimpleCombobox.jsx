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
import { useTranslateAndCapitalize } from '@/utils/FormatUtils';

const SimpleCombobox = ({ control, register, list, label }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const tc = useTranslateAndCapitalize();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{tc(label)}</FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? list.find((el) => el.value === value)?.label
                    : 'Select framework...'}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>{tc('noProducts')}</CommandEmpty>
                  <CommandGroup>
                    {list.map((el) => (
                      <CommandItem
                        key={el}
                        value={el}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                      >
                        {el}
                        <Check
                          className={cn(
                            'ml-auto',
                            value === el.value ? 'opacity-100' : 'opacity-0',
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
