import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { MonthSummary } from '@/lib/calculations'
import { formatCurrency, formatMonthName, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Currency } from '@/types/finance'

interface ClosingCardProps {
  mes: string
  summary: MonthSummary
  moneda: Currency
}

export function ClosingCard({ mes, summary, moneda }: ClosingCardProps) {
  const rows = [
    { label: 'Ingresos', value: summary.ingresos, className: 'text-income' },
    { label: 'Gastos fijos', value: -summary.gastosFijos, className: '' },
    { label: 'Gastos variables', value: -summary.gastosVariables, className: '' },
  ]
  const saved = summary.ahorro >= 0

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cierre de {formatMonthName(mes)}</CardTitle>
        <CardDescription>Cómo va el balance del mes</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <dl className="flex flex-col gap-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3 text-sm">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className={cn('font-mono tabular-nums', row.className)}>
                {formatCurrency(row.value, moneda)}
              </dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-3 border-t pt-2.5 text-sm font-medium">
            <dt>Ahorro</dt>
            <dd className={cn('font-mono tabular-nums', saved ? 'text-income' : 'text-expense')}>
              {formatCurrency(summary.ahorro, moneda)}
            </dd>
          </div>
        </dl>

        <div className={cn('rounded-lg p-4', saved ? 'bg-income/10' : 'bg-expense/10')}>
          <p className="text-xs text-muted-foreground">% de ahorro</p>
          <p className={cn('font-mono text-3xl font-semibold tabular-nums', saved ? 'text-income' : 'text-expense')}>
            {formatPercent(summary.tasaAhorro)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.ingresos === 0
              ? 'Registra tus ingresos para calcular tu ahorro.'
              : saved
                ? 'del total de tus ingresos quedó libre.'
                : 'Gastaste más de lo que ingresó este mes.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
