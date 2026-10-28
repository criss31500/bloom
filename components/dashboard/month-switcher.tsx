'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatMonth, shiftMonth } from '@/lib/format'

interface MonthSwitcherProps {
  mes: string
  maxMes: string
  onChange: (mes: string) => void
}

export function MonthSwitcher({ mes, maxMes, onChange }: MonthSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
      <Button variant="ghost" size="icon-sm" aria-label="Mes anterior" onClick={() => onChange(shiftMonth(mes, -1))}>
        <ChevronLeft className="size-4" aria-hidden="true" />
      </Button>
      <span className="min-w-32 text-center text-sm font-medium" aria-live="polite">
        {formatMonth(mes)}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Mes siguiente"
        disabled={mes >= maxMes}
        onClick={() => onChange(shiftMonth(mes, 1))}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
