'use client'

import { useEffect, useRef, useState } from 'react'
import { AgendaEventBlock } from '@/components/agenda/agenda-event-block'
import {
  DAY_NAMES,
  DAY_SHORT,
  END_HOUR,
  HOUR_HEIGHT,
  START_HOUR,
  formatHourLabel,
  isDone,
  itemsForDate,
  layoutDay,
} from '@/lib/agenda'
import { cn } from '@/lib/utils'
import type { AgendaItem } from '@/types/agenda'

export interface WeekDay {
  key: string
  date: Date
  index: number
}

interface WeekGridProps {
  days: WeekDay[]
  items: AgendaItem[]
  todayKey: string
  selectedKey: string
  onSelectDay: (key: string) => void
  onCreate: (dateKey: string, hour: number) => void
  onEdit: (item: AgendaItem) => void
  onToggleDone: (item: AgendaItem, dateKey: string) => void
}

const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i)

function useNowMinutes() {
  const [now, setNow] = useState(() => {
    const d = new Date()
    return d.getHours() * 60 + d.getMinutes()
  })
  useEffect(() => {
    const id = window.setInterval(() => {
      const d = new Date()
      setNow(d.getHours() * 60 + d.getMinutes())
    }, 60_000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

export function WeekGrid({ days, items, todayKey, selectedKey, onSelectDay, onCreate, onEdit, onToggleDone }: WeekGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const nowMinutes = useNowMinutes()
  const nowTop = ((nowMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: (7 - START_HOUR) * HOUR_HEIGHT })
  }, [])

  return (
    <div ref={scrollRef} className="relative max-h-[calc(100dvh-16rem)] min-h-[440px] overflow-y-auto overscroll-contain">
      <div className="sticky top-0 z-20 flex border-b bg-card">
        <div className="w-14 shrink-0" />
        {days.map((day) => {
          const isToday = day.key === todayKey
          const isSelected = day.key === selectedKey
          return (
            <button
              key={day.key}
              type="button"
              onClick={() => onSelectDay(day.key)}
              aria-pressed={isSelected}
              className={cn(
                'flex-1 flex-col items-center gap-0.5 border-l py-2 transition-colors hover:bg-muted/60',
                isSelected ? 'flex' : 'hidden lg:flex',
                isSelected && 'bg-muted/50',
              )}
            >
              <span className="text-xs font-medium text-muted-foreground">
                <span className="lg:hidden">{DAY_NAMES[day.index]}</span>
                <span className="hidden lg:inline">{DAY_SHORT[day.index]}</span>
              </span>
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full text-sm font-semibold tabular-nums',
                  isToday && 'bg-primary text-primary-foreground',
                )}
              >
                {day.date.getDate()}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex">
        <div className="w-14 shrink-0" aria-hidden="true">
          {HOURS.map((hour) => (
            <div key={hour} className="relative" style={{ height: HOUR_HEIGHT }}>
              {hour !== START_HOUR && (
                <span className="absolute -top-2 right-2 text-[11px] text-muted-foreground tabular-nums">
                  {formatHourLabel(hour)}
                </span>
              )}
            </div>
          ))}
        </div>

        {days.map((day) => {
          const isToday = day.key === todayKey
          const positioned = layoutDay(itemsForDate(items, day.key))
          return (
            <div
              key={day.key}
              className={cn(
                'relative flex-1 border-l',
                day.key === selectedKey ? 'block' : 'hidden lg:block',
                isToday && 'bg-primary/[0.03]',
              )}
            >
              {HOURS.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => onCreate(day.key, hour)}
                  aria-label={`Agregar actividad el ${DAY_NAMES[day.index]} a las ${formatHourLabel(hour)}`}
                  className="group block w-full border-b border-border/60 transition-colors hover:bg-muted/60 focus-visible:bg-muted focus-visible:outline-none"
                  style={{ height: HOUR_HEIGHT }}
                >
                  <span className="hidden text-[11px] text-muted-foreground group-hover:inline">+ Agregar</span>
                </button>
              ))}

              {positioned.map((p) => (
                <AgendaEventBlock
                  key={p.item.id}
                  positioned={p}
                  done={isDone(p.item, day.key)}
                  onEdit={() => onEdit(p.item)}
                  onToggleDone={() => onToggleDone(p.item, day.key)}
                />
              ))}

              {isToday && nowTop >= 0 && (
                <div className="pointer-events-none absolute inset-x-0 z-10 flex items-center" style={{ top: nowTop }}>
                  <span className="-ml-1 size-2 rounded-full bg-expense" />
                  <span className="h-px flex-1 bg-expense" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
