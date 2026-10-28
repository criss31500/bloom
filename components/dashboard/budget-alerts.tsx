import { CircleCheck, TriangleAlert } from 'lucide-react'
import { CategoryIcon } from '@/components/category-icon'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { BudgetProgress } from '@/lib/calculations'
import { formatCurrency, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Currency } from '@/types/finance'

interface BudgetAlertsProps {
  items: BudgetProgress[]
  moneda: Currency
}

export function BudgetAlerts({ items, moneda }: BudgetAlertsProps) {
  const alerts = items.filter((item) => item.estado !== 'ok').sort((a, b) => b.porcentaje - a.porcentaje)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Alertas de presupuesto
          {alerts.length > 0 && (
            <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-foreground">
              {alerts.length}
            </span>
          )}
        </CardTitle>
        <CardDescription>Categorías por encima del 80 %</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <CircleCheck className="size-8 text-income" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Todo bajo control. Ninguna categoría pasa del 80 %.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {alerts.map((item) => {
              const exceeded = item.estado === 'excedido'
              return (
                <li key={item.budget.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon category={item.category} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.category?.nombre}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {formatCurrency(item.gastado, moneda)} de {formatCurrency(item.budget.montoLimite, moneda)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-semibold tabular-nums',
                        exceeded ? 'text-expense' : 'text-warning',
                      )}
                    >
                      <TriangleAlert className="size-3.5" aria-hidden="true" />
                      {formatPercent(item.porcentaje)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <div
                      className={cn('h-full rounded-full', exceeded ? 'bg-expense' : 'bg-warning')}
                      style={{ width: `${Math.min(item.porcentaje, 100)}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
