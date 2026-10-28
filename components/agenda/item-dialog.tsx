'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { AGENDA_CATEGORIES, CATEGORY_OPTIONS, DAY_INITIAL, DAY_NAMES, toMinutes } from '@/lib/agenda'
import { cn } from '@/lib/utils'
import type { AgendaCategory, AgendaItem, AgendaItemInput, AgendaKind, AgendaRepeat } from '@/types/agenda'

export interface EditorState {
  item?: AgendaItem
  defaults: AgendaItemInput
}

interface ItemDialogProps {
  editor: EditorState | null
  onOpenChange: (open: boolean) => void
  onSave: (input: AgendaItemInput, id?: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function ItemDialog({ editor, onOpenChange, onSave, onDelete }: ItemDialogProps) {
  return (
    <Dialog open={editor !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {editor && (
          <ItemForm
            key={editor.item?.id ?? `${editor.defaults.fecha}-${editor.defaults.inicio}`}
            editor={editor}
            onCancel={() => onOpenChange(false)}
            onSave={onSave}
            onDelete={onDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

const DAY_PRESETS = [
  { label: 'Lun a Vie', dias: [0, 1, 2, 3, 4] },
  { label: 'Fin de semana', dias: [5, 6] },
  { label: 'Todos', dias: [0, 1, 2, 3, 4, 5, 6] },
]

interface ItemFormProps {
  editor: EditorState
  onCancel: () => void
  onSave: ItemDialogProps['onSave']
  onDelete: ItemDialogProps['onDelete']
}

function ItemForm({ editor, onCancel, onSave, onDelete }: ItemFormProps) {
  const initial = editor.item ?? editor.defaults
  const [titulo, setTitulo] = useState(initial.titulo)
  const [tipo, setTipo] = useState<AgendaKind>(initial.tipo)
  const [categoria, setCategoria] = useState<AgendaCategory>(initial.categoria)
  const [repeticion, setRepeticion] = useState<AgendaRepeat>(initial.repeticion)
  const [fecha, setFecha] = useState(initial.fecha)
  const [dias, setDias] = useState<number[]>(initial.dias)
  const [inicio, setInicio] = useState(initial.inicio)
  const [fin, setFin] = useState(initial.fin)
  const [notas, setNotas] = useState(initial.notas)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const isEditing = Boolean(editor.item)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanTitle = titulo.trim()
    if (!cleanTitle) return setError('Escribe un nombre para la actividad.')
    if (!inicio || !fin || toMinutes(fin) <= toMinutes(inicio)) {
      return setError('La hora de fin debe ser posterior a la de inicio.')
    }
    if (repeticion === 'semanal' && dias.length === 0) return setError('Elige al menos un día de la semana.')
    if (repeticion === 'una-vez' && !fecha) return setError('Elige una fecha.')

    setSaving(true)
    await onSave(
      {
        titulo: cleanTitle.slice(0, 80),
        tipo,
        categoria,
        repeticion,
        fecha,
        dias: [...dias].sort(),
        inicio,
        fin,
        notas: notas.trim().slice(0, 500),
      },
      editor.item?.id,
    )
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Editar actividad' : 'Nueva actividad'}</DialogTitle>
        <DialogDescription>Define el horario y si se repite cada semana.</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <Label htmlFor="agenda-titulo">Nombre</Label>
        <Input
          id="agenda-titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. Gimnasio, reunión, pagar servicios…"
          maxLength={80}
          autoFocus
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Tipo</Label>
          <ToggleGroup
            variant="outline"
            value={[tipo]}
            onValueChange={(v) => v[0] && setTipo(v[0] as AgendaKind)}
            className="w-full"
            spacing={0}
          >
            <ToggleGroupItem value="evento" className="flex-1">Evento</ToggleGroupItem>
            <ToggleGroupItem value="tarea" className="flex-1">Tarea</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="agenda-categoria">Categoría</Label>
          <Select
            items={CATEGORY_OPTIONS}
            value={categoria}
            onValueChange={(v) => v && setCategoria(v as AgendaCategory)}
          >
            <SelectTrigger id="agenda-categoria" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <span className={cn('size-2.5 rounded-full', AGENDA_CATEGORIES[c.value].dot)} aria-hidden="true" />
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="agenda-inicio">Inicio</Label>
          <Input id="agenda-inicio" type="time" step={900} value={inicio} onChange={(e) => setInicio(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="agenda-fin">Fin</Label>
          <Input id="agenda-fin" type="time" step={900} value={fin} onChange={(e) => setFin(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Repetición</Label>
        <ToggleGroup
          variant="outline"
          value={[repeticion]}
          onValueChange={(v) => v[0] && setRepeticion(v[0] as AgendaRepeat)}
          className="w-full"
          spacing={0}
        >
          <ToggleGroupItem value="una-vez" className="flex-1">Una vez</ToggleGroupItem>
          <ToggleGroupItem value="semanal" className="flex-1">Cada semana</ToggleGroupItem>
        </ToggleGroup>

        {repeticion === 'una-vez' ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="agenda-fecha" className="text-muted-foreground">Fecha</Label>
            <Input id="agenda-fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <ToggleGroup
              multiple
              variant="outline"
              value={dias.map(String)}
              onValueChange={(v) => setDias(v.map(Number))}
              aria-label="Días de la semana"
              className="w-full"
            >
              {DAY_INITIAL.map((initialLetter, index) => (
                <ToggleGroupItem
                  key={index}
                  value={String(index)}
                  aria-label={DAY_NAMES[index]}
                  className="flex-1 data-pressed:bg-primary data-pressed:text-primary-foreground"
                >
                  {initialLetter}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <div className="flex flex-wrap gap-2">
              {DAY_PRESETS.map((preset) => (
                <Button key={preset.label} type="button" size="xs" variant="secondary" onClick={() => setDias(preset.dias)}>
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="agenda-notas">Notas</Label>
        <Textarea
          id="agenda-notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Detalles opcionales"
          rows={2}
          maxLength={500}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <DialogFooter className="sm:justify-between">
        {isEditing ? (
          <Button
            type="button"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => editor.item && onDelete(editor.item.id)}
          >
            <Trash2 aria-hidden="true" />
            Eliminar
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {isEditing ? 'Guardar cambios' : 'Agregar'}
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}
