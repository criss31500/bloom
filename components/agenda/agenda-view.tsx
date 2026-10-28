'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { CategoryLegend } from '@/components/agenda/category-legend'
import { DaySummary } from '@/components/agenda/day-summary'
import { ItemDialog, type EditorState } from '@/components/agenda/item-dialog'
import { WeekGrid, type WeekDay } from '@/components/agenda/week-grid'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAgenda } from '@/hooks/use-agenda'
import {
  DAY_INITIAL,
  addDays,
  formatWeekRange,
  fromDateKey,
  itemsForDate,
  startOfWeek,
  toDateKey,
  weekdayIndex,
} from '@/lib/agenda'
import { cn } from '@/lib/utils'
import type { AgendaItem, AgendaItemInput } from '@/types/agenda'

function buildDefaults(dateKey: string, hour: number): AgendaItemInput {
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    titulo: '',
    tipo: 'evento',
    categoria: 'personal',
    repeticion: 'una-vez',
    fecha: dateKey,
    dias: [weekdayIndex(fromDateKey(dateKey))],
    inicio: `${pad(hour)}:00`,
    fin: hour >= 23 ? '23:59' : `${pad(hour + 1)}:00`,
    notas: '',
  }
}

export function AgendaView() {
  const { data: items, error, save, remove, toggleDone } = useAgenda()
  const todayKey = toDateKey(new Date())
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [selectedKey, setSelectedKey] = useState(todayKey)
  const [editor, setEditor] = useState<EditorState | null>(null)

  if (error) return <p className="text-sm text-destructive">No se pudo cargar la agenda.</p>
  if (!items) return <AgendaSkeleton />

  const days: WeekDay[] = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index)
    return { key: toDateKey(date), date, index }
  })

  function goToWeek(start: Date) {
    setWeekStart(start)
    const currentWeek = startOfWeek(new Date())
    setSelectedKey(start.getTime() === currentWeek.getTime() ? todayKey : toDateKey(start))
  }

  function openCreate(dateKey: string, hour = 9) {
    setEditor({ defaults: buildDefaults(dateKey, hour) })
  }

  function openEdit(item: AgendaItem) {
    setEditor({ item, defaults: item })
  }

  async function handleSave(input: AgendaItemInput, id?: string) {
    await save(input, id)
    setEditor(null)
    toast.success(id ? 'Actividad actualizada' : 'Actividad agregada')
    if (input.repeticion === 'una-vez') {
      setSelectedKey(input.fecha)
      setWeekStart(startOfWeek(fromDateKey(input.fecha)))
    }
  }

  async function handleDelete(id: string) {
    await remove(id)
    setEditor(null)
    toast.success('Actividad eliminada')
  }

  const isCurrentWeek = weekStart.getTime() === startOfWeek(new Date()).getTime()

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Agenda semanal</h1>
          <p className="text-sm text-muted-foreground">Organiza tus horarios, rutinas y tareas de cada día.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
            <Button variant="ghost" size="icon-sm" onClick={() => goToWeek(addDays(weekStart, -7))} aria-label="Semana anterior">
              <ChevronLeft />
            </Button>
            <span className="min-w-40 px-1 text-center text-sm font-medium tabular-nums" aria-live="polite">
              {formatWeekRange(weekStart)}
            </span>
            <Button variant="ghost" size="icon-sm" onClick={() => goToWeek(addDays(weekStart, 7))} aria-label="Semana siguiente">
              <ChevronRight />
            </Button>
          </div>
          <Button variant="outline" onClick={() => goToWeek(startOfWeek(new Date()))} disabled={isCurrentWeek}>
            Hoy
          </Button>
          <Button onClick={() => openCreate(selectedKey)}>
            <Plus aria-hidden="true" />
            Nueva actividad
          </Button>
        </div>
      </header>

      <nav aria-label="Días de la semana" className="grid grid-cols-7 gap-1.5 lg:hidden">
        {days.map((day) => {
          const count = itemsForDate(items, day.key).length
          const selected = day.key === selectedKey
          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedKey(day.key)}
              aria-pressed={selected}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-lg border py-2 text-xs transition-colors',
                selected ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-muted',
                day.key === todayKey && !selected && 'border-primary text-primary',
              )}
            >
              <span className="font-medium">{DAY_INITIAL[day.index]}</span>
              <span className="text-sm font-semibold tabular-nums">{day.date.getDate()}</span>
              <span className={cn('text-[10px]', selected ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                {count > 0 ? count : '–'}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="gap-0 overflow-hidden py-0">
          <WeekGrid
            days={days}
            items={items}
            todayKey={todayKey}
            selectedKey={selectedKey}
            onSelectDay={setSelectedKey}
            onCreate={openCreate}
            onEdit={openEdit}
            onToggleDone={(item, dateKey) => toggleDone(item.id, dateKey)}
          />
        </Card>

        <aside className="flex flex-col gap-6" aria-label="Resumen del día">
          <DaySummary
            dateKey={selectedKey}
            isToday={selectedKey === todayKey}
            items={items}
            onAdd={() => openCreate(selectedKey)}
            onEdit={openEdit}
            onToggleDone={(item, dateKey) => toggleDone(item.id, dateKey)}
          />
          <CategoryLegend items={items} />
        </aside>
      </div>

      <ItemDialog
        editor={editor}
        onOpenChange={(open) => !open && setEditor(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}

function AgendaSkeleton() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6" aria-busy="true" aria-label="Cargando agenda">
      <div className="h-12 w-64 animate-pulse rounded-lg bg-muted" />
      <div className="h-[520px] animate-pulse rounded-xl bg-muted" />
    </div>
  )
}
