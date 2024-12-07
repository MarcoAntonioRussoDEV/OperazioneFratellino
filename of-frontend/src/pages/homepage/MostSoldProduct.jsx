import React, { useEffect, useState } from 'react';
import { Label, Pie, PieChart, Sector } from 'recharts';
// import { PieSectorDataItem } from 'recharts/types/polar/Pie';
import { dateRangeResolver, monthsRangeResolver } from '@/utils/FormatUtils';
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
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useTranslateAndCapitalize } from '@/utils/FormatUtils';

const prod1Color = 'hsl(var(--chart-1))';
const prod2Color = 'hsl(var(--chart-2))';
const prod3Color = 'hsl(var(--chart-3))';
const prod4Color = 'hsl(var(--chart-4))';
const prod5Color = 'hsl(var(--chart-5))';

const chartConfig = {
  quantity: {
    label: 'sold',
  },
  PROD1: {
    label: 'PROD1',
    color: prod1Color,
  },
  PROD2: {
    label: 'PROD2',
    color: prod2Color,
  },
  PROD3: {
    label: 'PROD3',
    color: prod3Color,
  },
  PROD4: {
    label: 'PROD4',
    color: prod4Color,
  },
  PROD5: {
    label: 'PROD5',
    color: prod5Color,
  },
};

MostSoldProducts.propTypes = {
  chartData: PropTypes.array,
};

export default function MostSoldProducts({ chartData, date }) {
  const { i18n } = useTranslation();
  const tc = useTranslateAndCapitalize();
  const from = dateRangeResolver(date.from, i18n.language);
  const to = dateRangeResolver(date.to, i18n.language);
  const [noDataChartFallback, setNodataChartFallback] = useState(chartData);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (!chartData.length) {
      setNodataChartFallback([
        {
          product: tc('noData'),
          quantity: 1,
          fill: 'hsl(var(--accent))',
          isInvalid: true,
        },
      ]);
      setIsFallback(true);
    } else {
      setNodataChartFallback(chartData);
      setIsFallback(false);
    }
  }, [chartData]);

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="items-center pb-0">
        {/* Needed to render variables in tailwindCSS */}
        <span className={'hidden bg-[hsl(var(--chart-1))]'}></span>
        <span className={'hidden bg-[hsl(var(--chart-2))]'}></span>
        <span className={'hidden bg-[hsl(var(--chart-3))]'}></span>
        <span className={'hidden bg-[hsl(var(--chart-4))]'}></span>
        <span className={'hidden bg-[hsl(var(--chart-5))]'}></span>
        <CardTitle>{tc('mostSoldProducts')}</CardTitle>
        <CardDescription>{monthsRangeResolver(from, to)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={noDataChartFallback}
              dataKey="quantity"
              nameKey="product"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={chartData.length ? 0 : ''}
              activeShape={({ outerRadius = 0, ...props }) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-lg font-bold"
                        >
                          {noDataChartFallback[0].product}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {isFallback ? '' : noDataChartFallback[0].quantity}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {isFallback || (
        <CardFooter
          className={`grid grid-cols-3 gap-y-2 justify-items-center text-sm`}
        >
          {noDataChartFallback.map((entry, idx) => {
            return (
              <article
                key={entry}
                className="text-muted-foreground flex gap-2 items-center"
              >
                <div className={`w-3 h-3 rounded bg-[${entry.fill}]`} />
                <section>
                  <span>{entry.product}</span>:{' '}
                  <span className="font-bold">{entry.quantity}</span>
                </section>
              </article>
            );
          })}
        </CardFooter>
      )}
    </Card>
  );
}
