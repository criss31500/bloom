/**
 * Igual que la capa de finanzas: localStorage detrás de funciones async para
 * poder migrar a una base de datos sin tocar los componentes.
 */
import type { AgendaItem, AgendaItemInput } from '@/types/agenda'
import { addDays, startOfWeek, toDateKey } from '@/lib/agenda'

const ITEMS_KEY = 'mf:agenda'
const SEEDED_KEY = 'mf:agenda-seeded'

function readItems(): AgendaItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(ITEMS_KEY)
    return raw ? (JSON.parse(raw) as AgendaItem[]) : []
  } catch {
    return []
  }
}

function writeItems(items: AgendaItem[]) {
  window.localStorage.setItem(ITEMS_KEY, JSON.stringify(items))
  return items
}

function createSeed(today: Date): AgendaItem[] {
  const weekStart = startOfWeek(today)
  const weekdays = [0, 1, 2, 3, 4]
  const base = { notas: '', completadas: [], fecha: toDateKey(weekStart) }
  const items: Omit<AgendaItem, 'id'>[] = [
    { ...base, titulo: 'Gimnasio', tipo: 'evento', categoria: 'salud', inicio: '06:30', fin: '07:30', repeticion: 'semanal', dias: [0, 2, 4] },
    { ...base, titulo: 'Jornada laboral', tipo: 'evento', categoria: 'trabajo', inicio: '08:00', fin: '12:00', repeticion: 'semanal', dias: weekdays },
    { ...base, titulo: 'Almuerzo', tipo: 'evento', categoria: 'personal', inicio: '12:00', fin: '13:00', repeticion: 'semanal', dias: weekdays },
    { ...base, titulo: 'Jornada laboral', tipo: 'evento', categoria: 'trabajo', inicio: '13:00', fin: '17:00', repeticion: 'semanal', dias: weekdays },
    { ...base, titulo: 'Clase de inglés', tipo: 'evento', categoria: 'estudio', inicio: '18:30', fin: '20:00', repeticion: 'semanal', dias: [1, 3] },
    { ...base, titulo: 'Lavandería', tipo: 'tarea', categoria: 'hogar', inicio: '10:00', fin: '11:00', repeticion: 'semanal', dias: [5] },
    { ...base, titulo: 'Compra de víveres', tipo: 'tarea', categoria: 'hogar', inicio: '11:30', fin: '12:30', repeticion: 'semanal', dias: [5] },
    { ...base, titulo: 'Revisar presupuesto', tipo: 'tarea', categoria: 'personal', inicio: '20:00', fin: '20:30', repeticion: 'semanal', dias: [6] },
    { ...base, titulo: 'Pagar alquiler', tipo: 'tarea', categoria: 'personal', inicio: '17:30', fin: '18:00', repeticion: 'una-vez', fecha: toDateKey(addDays(weekStart, 4)), dias: [] },
  ]
  return items.map((item) => ({ ...item, id: crypto.randomUUID() }))
}

export async function getAgendaItems(): Promise<AgendaItem[]> {
  if (typeof window !== 'undefined' && !window.localStorage.getItem(SEEDED_KEY)) {
    writeItems(createSeed(new Date()))
    window.localStorage.setItem(SEEDED_KEY, 'true')
  }
  return readItems()
}

export async function addAgendaItem(input: AgendaItemInput) {
  return writeItems([...readItems(), { ...input, id: crypto.randomUUID(), completadas: [] }])
}

export async function updateAgendaItem(id: string, input: AgendaItemInput) {
  return writeItems(readItems().map((item) => (item.id === id ? { ...item, ...input } : item)))
}

export async function deleteAgendaItem(id: string) {
  return writeItems(readItems().filter((item) => item.id !== id))
}

export async function toggleAgendaItemDone(id: string, dateKey: string) {
  return writeItems(
    readItems().map((item) => {
      if (item.id !== id) return item
      const done = item.completadas.includes(dateKey)
      return {
        ...item,
        completadas: done ? item.completadas.filter((d) => d !== dateKey) : [...item.completadas, dateKey],
      }
    }),
  )
}
