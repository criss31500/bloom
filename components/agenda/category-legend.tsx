import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AGENDA_CATEGORIES, CATEGORY_OPTIONS } from '@/lib/agenda'
import { cn } from '@/lib/utils'
import type { AgendaItem } from '@/types/agenda'

export function CategoryLegend({ items }: { items: AgendaItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Categorías</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2.5">
          {CATEGORY_OPTIONS.map((c) => (
            <li key={c.value} className="flex items-center gap-3 text-sm">
              <span className={cn('size-3 rounded-sm', AGENDA_CATEGORIES[c.value].dot)} aria-hidden="true" />
              <span className="flex-1">{c.label}</span>
              <span className="text-muted-foreground tabular-nums">
                {items.filter((i) => i.categoria === c.value).length}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
