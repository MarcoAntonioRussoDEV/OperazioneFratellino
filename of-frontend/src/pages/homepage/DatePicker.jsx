import * as React from 'react';
import { addDays, format, setDefaultOptions } from 'date-fns';
import * as locale from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTranslateAndCapitalize } from '@/utils/FormatUtils';
import { useTranslation } from 'react-i18next';

export default function DatePicker({ date, setDate, className }) {
  const { i18n } = useTranslation();
  setDefaultOptions({ locale: locale[i18n.language] });
  const tc = useTranslateAndCapitalize();
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd MMM  y')} -{' '}
                  {format(date.to, 'dd MMM  y')}
                </>
              ) : (
                format(date.from, 'dd LLL  y')
              )
            ) : (
              <span>{tc('pickInterval')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
