import { Card, CardContent } from '@/components/ui/card'
import { getBudgetState } from '@/lib/calculations'
import { formatCurrency, formatMonthName, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Currency } from '@/types/finance'

interface BudgetBannerProps {
  mes: string
  presupuesto: number
  gastado: number
  moneda: Currency
}

const BAR_COLORS = {
  ok: 'bg-income',
  alerta: 'bg-warning',
  excedido: 'bg-expense',
} as const

export function BudgetBanner({ mes, presupuesto, gastado, moneda }: BudgetBannerProps) {
  const porcentaje = presupuesto > 0 ? (gastado / presupuesto) * 100 : 0
  const estado = getBudgetState(porcentaje)
  const restante = presupuesto - gastado

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Presupuesto de {formatMonthName(mes)}</p>
            <p className="font-mono text-3xl font-semibold tracking-tight tabular-nums">
              {formatCurrency(presupuesto, moneda)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{restante >= 0 ? 'Disponible' : 'Excedido por'}</p>
            <p className={cn('font-mono text-lg font-medium tabular-nums', restante < 0 && 'text-expense')}>
              {formatCurrency(Math.abs(restante), moneda)}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div
            role="progressbar"
            aria-label="Presupuesto utilizado"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(Math.min(porcentaje, 100))}
            className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn('h-full rounded-full transition-all', BAR_COLORS[estado])}
              style={{ width: `${Math.min(porcentaje, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Llevas gastado {formatCurrency(gastado, moneda)} · {formatPercent(porcentaje)} del presupuesto
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
