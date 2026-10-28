'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatCurrency, formatShortMonth } from '@/lib/format'
import type { Currency } from '@/types/finance'

const chartConfig = {
  ingresos: { label: 'Ingresos', color: 'var(--income)' },
  gastos: { label: 'Gastos', color: 'var(--expense)' },
} satisfies ChartConfig

interface IncomeExpenseChartProps {
  data: { mes: string; ingresos: number; gastos: number }[]
  moneda: Currency
}

export function IncomeExpenseChart({ data, moneda }: IncomeExpenseChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ingresos vs gastos</CardTitle>
        <CardDescription>Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <BarChart data={data} margin={{ left: 0, right: 4 }} barGap={4}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatShortMonth} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tickFormatter={(value: number) => formatCurrency(value, moneda, true)}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--muted)', opacity: 0.6 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => formatShortMonth(String(payload?.[0]?.payload?.mes ?? ''))}
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                          className="size-2 rounded-[2px]"
                          style={{ backgroundColor: `var(--color-${String(name)})` }}
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {formatCurrency(Number(value), moneda)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="gastos" fill="var(--color-gastos)" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
