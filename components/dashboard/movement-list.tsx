import { CategoryIcon } from '@/components/category-icon'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TAG_LABELS, sumAmounts } from '@/lib/calculations'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Category, Currency, Transaction } from '@/types/finance'

interface MovementListProps {
  title: string
  description: string
  accent: 'income' | 'fixed' | 'variable'
  transactions: Transaction[]
  categories: Category[]
  moneda: Currency
  emptyMessage: string
}

const ACCENTS = {
  income: { bar: 'bg-income', total: 'text-income' },
  fixed: { bar: 'bg-primary', total: 'text-foreground' },
  variable: { bar: 'bg-expense', total: 'text-expense' },
} as const

export function MovementList({
  title,
  description,
  accent,
  transactions,
  categories,
  moneda,
  emptyMessage,
}: MovementListProps) {
  const styles = ACCENTS[accent]
  const total = sumAmounts(transactions)

  return (
    <Card className="relative h-full overflow-hidden">
      <span className={cn('absolute inset-x-0 top-0 h-1', styles.bar)} aria-hidden="true" />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-7" />
              <col />
              <col className="w-28" />
            </colgroup>
            <thead className="sr-only">
              <tr>
                <th scope="col">Nº</th>
                <th scope="col">Concepto</th>
                <th scope="col">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((t, index) => {
                const category = categories.find((c) => c.id === t.categoriaId)
                return (
                  <tr key={t.id}>
                    <td className="w-7 py-2.5 align-middle font-mono text-xs text-muted-foreground tabular-nums">
                      {index + 1}
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <CategoryIcon category={category} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{t.descripcion}</p>
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {formatDate(t.fecha)}
                            {t.etiqueta && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span
                                  className="size-1.5 rounded-full"
                                  style={{ backgroundColor: `var(--tag-${t.etiqueta})` }}
                                  aria-hidden="true"
                                />
                                {TAG_LABELS[t.etiqueta]}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums whitespace-nowrap">
                      {formatCurrency(t.monto, moneda)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Total</span>
        <span className={cn('font-mono text-base font-semibold tabular-nums', styles.total)}>
          {formatCurrency(total, moneda)}
        </span>
      </CardFooter>
    </Card>
  )
}
