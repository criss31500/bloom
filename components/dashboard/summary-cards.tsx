import { ArrowDownRight, ArrowUpRight, PiggyBank, TrendingDown, TrendingUp, Wallet, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatPercent } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Currency } from '@/types/finance'

interface SummaryCardData {
  label: string
  value: number
  icon: LucideIcon
  tone: 'neutral' | 'income' | 'expense'
  change?: number | null
  /** Cuando un aumento es negativo (p. ej. gastos). */
  invertChange?: boolean
  hint?: string
}

interface SummaryCardsProps {
  moneda: Currency
  saldoTotal: number
  ingresos: number
  gastos: number
  ahorro: number
  cambioIngresos: number | null
  cambioGastos: number | null
  cambioAhorro: number | null
}

const TONE_STYLES = {
  neutral: 'bg-accent text-accent-foreground',
  income: 'bg-income/12 text-income',
  expense: 'bg-expense/12 text-expense',
} as const

function ChangeBadge({ change, invert }: { change?: number | null; invert?: boolean }) {
  if (change === undefined) return null
  if (change === null) return <span className="text-xs text-muted-foreground">Sin datos del mes anterior</span>

  const positive = invert ? change <= 0 : change >= 0
  const Arrow = change >= 0 ? ArrowUpRight : ArrowDownRight

  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', positive ? 'text-income' : 'text-expense')}>
      <Arrow className="size-3.5" aria-hidden="true" />
      {formatPercent(change, true)}
      <span className="font-normal text-muted-foreground">vs mes anterior</span>
    </span>
  )
}

export function SummaryCards(props: SummaryCardsProps) {
  const cards: SummaryCardData[] = [
    { label: 'Saldo total', value: props.saldoTotal, icon: Wallet, tone: 'neutral', hint: 'En todas tus cuentas' },
    { label: 'Ingresos del mes', value: props.ingresos, icon: TrendingUp, tone: 'income', change: props.cambioIngresos },
    {
      label: 'Gastos del mes',
      value: props.gastos,
      icon: TrendingDown,
      tone: 'expense',
      change: props.cambioGastos,
      invertChange: true,
    },
    { label: 'Ahorro del mes', value: props.ahorro, icon: PiggyBank, tone: 'neutral', change: props.cambioAhorro },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label} size="sm">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                <span className={cn('flex size-8 items-center justify-center rounded-lg', TONE_STYLES[card.tone])}>
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              </div>
              <p
                className={cn(
                  'font-mono text-2xl font-semibold tracking-tight tabular-nums',
                  card.value < 0 && 'text-expense',
                )}
              >
                {formatCurrency(card.value, props.moneda)}
              </p>
              {card.hint ? (
                <span className="text-xs text-muted-foreground">{card.hint}</span>
              ) : (
                <ChangeBadge change={card.change} invert={card.invertChange} />
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
