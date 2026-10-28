'use client'

import { CalendarPlus, Repeat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { AGENDA_CATEGORIES, describeRepeat, formatLongDate, isDone, itemsForDate } from '@/lib/agenda'
import { cn } from '@/lib/utils'
import type { AgendaItem } from '@/types/agenda'

interface DaySummaryProps {
  dateKey: string
  isToday: boolean
  items: AgendaItem[]
  onAdd: () => void
  onEdit: (item: AgendaItem) => void
  onToggleDone: (item: AgendaItem, dateKey: string) => void
}

export function DaySummary({ dateKey, isToday, items, onAdd, onEdit, onToggleDone }: DaySummaryProps) {
  const dayItems = itemsForDate(items, dateKey)
  const tasks = dayItems.filter((i) => i.tipo === 'tarea')
  const doneCount = tasks.filter((t) => isDone(t, dateKey)).length

  return (
    <Card>
      <CardHeader>
        <CardDescription>{isToday ? 'Hoy' : 'Día seleccionado'}</CardDescription>
        <CardTitle className="text-lg">{formatLongDate(dateKey)}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {tasks.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Tareas completadas</span>
              <span className="text-muted-foreground tabular-nums">
                {doneCount} de {tasks.length}
              </span>
            </div>
            <Progress value={(doneCount / tasks.length) * 100} aria-label="Progreso de tareas del día" />
          </div>
        )}

        {dayItems.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">No hay actividades para este día.</p>
            <Button size="sm" variant="outline" onClick={onAdd}>
              <CalendarPlus aria-hidden="true" />
              Agregar actividad
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {dayItems.map((item) => {
              const done = isDone(item, dateKey)
              const checkboxId = `done-${item.id}-${dateKey}`
              return (
                <li key={item.id} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-muted/60">
                  {item.tipo === 'tarea' ? (
                    <Checkbox
                      id={checkboxId}
                      checked={done}
                      onCheckedChange={() => onToggleDone(item, dateKey)}
                      aria-label={`Marcar "${item.titulo}" como hecha`}
                      className="mt-0.5"
                    />
                  ) : (
                    <span className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', AGENDA_CATEGORIES[item.categoria].dot)} aria-hidden="true" />
                  )}
                  <button type="button" onClick={() => onEdit(item)} className="flex min-w-0 flex-1 flex-col text-left">
                    <span className={cn('truncate text-sm font-medium', done && 'text-muted-foreground line-through')}>
                      {item.titulo}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                      {item.inicio}–{item.fin}
                      <span aria-hidden="true">·</span>
                      {item.repeticion === 'semanal' && <Repeat className="size-3" aria-hidden="true" />}
                      {describeRepeat(item)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
