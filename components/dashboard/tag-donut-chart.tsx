'use client'

import { Label, Pie, PieChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { TAG_LABELS } from '@/lib/calculations'
import { formatCurrency, formatPercent } from '@/lib/format'
import type { Currency, ExpenseTag } from '@/types/finance'

const chartConfig = {
  personal: { label: TAG_LABELS.personal, color: 'var(--tag-personal)' },
  ocio: { label: TAG_LABELS.ocio, color: 'var(--tag-ocio)' },
  necesidad: { label: TAG_LABELS.necesidad, color: 'var(--tag-necesidad)' },
  viveres: { label: TAG_LABELS.viveres, color: 'var(--tag-viveres)' },
} satisfies ChartConfig

interface TagDonutChartProps {
  data: { etiqueta: ExpenseTag; total: number }[]
  moneda: Currency
}

export function TagDonutChart({ data, moneda }: TagDonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.total, 0)
  const chartData = data.map((item) => ({ ...item, fill: `var(--color-${item.etiqueta})` }))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Gastos por etiqueta</CardTitle>
        <CardDescription>¿En qué se fue el dinero este mes?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {total === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Aún no hay gastos este mes.</p>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-44">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      nameKey="etiqueta"
                      formatter={(value, name) => (
                        <div className="flex w-full items-center justify-between gap-4">
                          <span className="text-muted-foreground">
                            {chartConfig[name as ExpenseTag]?.label}
                          </span>
                          <span className="font-mono font-medium tabular-nums">
                            {formatCurrency(Number(value), moneda)}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie data={chartData} dataKey="total" nameKey="etiqueta" innerRadius={52} outerRadius={80} strokeWidth={3} stroke="var(--card)">
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !('cx' in viewBox)) return null
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) - 8} className="fill-muted-foreground text-xs">
                            Total
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 12} className="fill-foreground font-mono text-sm font-semibold">
                            {formatCurrency(total, moneda, true)}
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {data.map((item) => (
                <li key={item.etiqueta} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-3 w-5 shrink-0 rounded-sm"
                    style={{ backgroundColor: `var(--tag-${item.etiqueta})` }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{TAG_LABELS[item.etiqueta]}</span>
                  <span className="ml-auto text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                    {formatPercent((item.total / total) * 100)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
