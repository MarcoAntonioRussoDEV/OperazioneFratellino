import React, { useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useTranslation } from 'react-i18next';
import {
  dateRangeResolver,
  monthsRangeResolver,
  useTranslateAndCapitalize,
} from '@/utils/formatUtils';

const totalGainColor = 'hsl(var(--chart-1))';
const profitColor = 'hsl(var(--chart-3))';

const chartConfig = {
  totalGain: {
    label: 'Incassi',
    color: totalGainColor,
  },
  profit: {
    label: 'Utile',
    color: profitColor,
  },
};

const defaultDate = {
  from: new Date('01/01/1970'),
  to: new Date(),
};

const Gains = ({ chartData, date = defaultDate, className }) => {
  const { i18n } = useTranslation();
  const tc = useTranslateAndCapitalize();
  const from = dateRangeResolver(date.from, i18n.language);
  const to = dateRangeResolver(date.to, i18n.language);

  return (
    <Card className={'w-full h-full ' + className}>
      <CardHeader>
        <CardTitle>{tc('gains')}</CardTitle>
        <CardDescription>{monthsRangeResolver(from, to)}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={
              chartData.length
                ? chartData
                : [{ head: tc('noData'), totalGain: 0, profit: 0 }]
            }
            margin={{ top: 24 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="head"
              tickLine={false}
              tickMargin={10}
              axisLine={false}

              // tickFormatter={(value) => value.slice(0, 3)}
            />
            {/* <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                      /> */}
            <Bar dataKey="totalGain" fill="var(--color-totalGain)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value) => `${value} €`}
              />
            </Bar>
            <Bar dataKey="profit" fill="var(--color-profit)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value) => `${value} €`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground flex gap-2 items-center">
          <div className={`w-3 h-3 bg-[hsl(var(--chart-1))] rounded`} />
          {tc('gains')}
        </div>
        <div className="leading-none text-muted-foreground flex gap-2 items-center">
          <div className={`w-3 h-3 bg-[hsl(var(--chart-3))] rounded`} />
          {tc('profit')}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Gains;
