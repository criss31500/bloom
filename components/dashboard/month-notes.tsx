'use client'

import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useMonthNote } from '@/hooks/use-finance'
import type { MonthNote } from '@/types/finance'

export function MonthNotes({ mes }: { mes: string }) {
  const { data, save } = useMonthNote(mes)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Nota y reflexión</CardTitle>
        <CardDescription>Se guardan al salir de cada campo</CardDescription>
      </CardHeader>
      <CardContent>
        {data ? <NotesForm key={mes} note={data} onSave={save} /> : <div className="h-48 animate-pulse rounded-lg bg-muted" />}
      </CardContent>
    </Card>
  )
}

function NotesForm({ note, onSave }: { note: MonthNote; onSave: (note: MonthNote) => Promise<void> }) {
  async function handleBlur(field: 'nota' | 'reflexion', value: string) {
    if (note[field] === value) return
    await onSave({ ...note, [field]: value })
    toast.success(field === 'nota' ? 'Nota guardada' : 'Reflexión guardada')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="month-note" className="text-sm font-medium">
          Nota
        </label>
        <Textarea
          id="month-note"
          defaultValue={note.nota}
          placeholder="Ej. Pendiente pagar la nevera a Paty."
          className="min-h-20 resize-none"
          onBlur={(e) => handleBlur('nota', e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="month-reflection" className="text-sm font-medium">
          Reflexión
        </label>
        <Textarea
          id="month-reflection"
          defaultValue={note.reflexion}
          placeholder="¿Qué salió bien este mes? ¿Qué cambiarías el próximo?"
          className="min-h-24 resize-none"
          onBlur={(e) => handleBlur('reflexion', e.target.value)}
        />
      </div>
    </div>
  )
}
