'use client'

import { Check, Repeat } from 'lucide-react'
import { AGENDA_CATEGORIES, HOUR_HEIGHT, START_HOUR, toMinutes } from '@/lib/agenda'
import type { PositionedItem } from '@/lib/agenda'
import { cn } from '@/lib/utils'

interface AgendaEventBlockProps {
  positioned: PositionedItem
  done: boolean
  onEdit: () => void
  onToggleDone: () => void
}

export function AgendaEventBlock({ positioned, done, onEdit, onToggleDone }: AgendaEventBlockProps) {
  const { item, lane, lanes } = positioned
  const start = toMinutes(item.inicio)
  const end = Math.max(toMinutes(item.fin), start + 15)
  const top = ((start - START_HOUR * 60) / 60) * HOUR_HEIGHT
  const height = Math.max(((end - start) / 60) * HOUR_HEIGHT, 22)
  const width = 100 / lanes
  const isTask = item.tipo === 'tarea'
  const compact = height < 40

  return (
    <div
      className={cn(
        'absolute overflow-hidden rounded-md border-l-[3px] text-xs text-foreground shadow-xs transition-opacity',
        AGENDA_CATEGORIES[item.categoria].block,
        done && 'opacity-55',
      )}
      style={{
        top: Math.max(top, 0),
        height,
        left: `calc(${lane * width}% + 2px)`,
        width: `calc(${width}% - 4px)`,
      }}
    >
      <button
        type="button"
        onClick={onEdit}
        className={cn(
          'flex size-full flex-col items-start gap-0.5 px-1.5 text-left focus-visible:outline-2 focus-visible:outline-ring',
          compact ? 'justify-center' : 'py-1',
          isTask && 'pr-6',
        )}
      >
        <span className={cn('w-full font-medium leading-tight wrap-break-word hyphens-auto', compact ? 'truncate' : 'line-clamp-2', done && 'line-through')}>
          {item.titulo}
        </span>
        {!compact && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground tabular-nums">
            {item.inicio}–{item.fin}
            {item.repeticion === 'semanal' && <Repeat className="size-3" aria-label="Se repite cada semana" />}
          </span>
        )}
      </button>
      {isTask && (
        <button
          type="button"
          onClick={onToggleDone}
          aria-pressed={done}
          aria-label={done ? `Marcar "${item.titulo}" como pendiente` : `Marcar "${item.titulo}" como hecha`}
          className={cn(
            'absolute top-1 right-1 flex size-4 items-center justify-center rounded-sm border border-foreground/40 bg-card',
            done && 'border-primary bg-primary text-primary-foreground',
          )}
        >
          {done && <Check className="size-3" aria-hidden="true" />}
        </button>
      )}
    </div>
  )
}
