import type { AgendaCategory, AgendaItem } from '@/types/agenda'

export const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
export const DAY_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
export const DAY_INITIAL = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export const START_HOUR = 5
export const END_HOUR = 24
export const HOUR_HEIGHT = 56

export const AGENDA_CATEGORIES: Record<AgendaCategory, { label: string; dot: string; block: string }> = {
  trabajo: { label: 'Trabajo', dot: 'bg-primary', block: 'bg-primary/12 border-primary' },
  personal: { label: 'Personal', dot: 'bg-tag-personal', block: 'bg-tag-personal/20 border-tag-personal' },
  estudio: { label: 'Estudio', dot: 'bg-tag-ocio', block: 'bg-tag-ocio/15 border-tag-ocio' },
  salud: { label: 'Salud', dot: 'bg-income', block: 'bg-income/15 border-income' },
  hogar: { label: 'Hogar', dot: 'bg-tag-viveres', block: 'bg-tag-viveres/18 border-tag-viveres' },
}

export const CATEGORY_OPTIONS = (Object.keys(AGENDA_CATEGORIES) as AgendaCategory[]).map((value) => ({
  value,
  label: AGENDA_CATEGORIES[value].label,
}))

const pad = (n: number) => String(n).padStart(2, '0')

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function fromDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function weekdayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

export function addDays(date: Date, amount: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function startOfWeek(date: Date) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return addDays(day, -weekdayIndex(day))
}

export function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function fromMinutes(total: number) {
  if (total >= 24 * 60) return '23:59'
  const safe = Math.max(0, total)
  return `${pad(Math.floor(safe / 60))}:${pad(safe % 60)}`
}

export function formatHourLabel(hour: number) {
  return `${pad(hour)}:00`
}

export function occursOn(item: AgendaItem, dateKey: string) {
  if (item.repeticion === 'una-vez') return item.fecha === dateKey
  return item.dias.includes(weekdayIndex(fromDateKey(dateKey)))
}

export function itemsForDate(items: AgendaItem[], dateKey: string) {
  return items
    .filter((item) => occursOn(item, dateKey))
    .sort((a, b) => toMinutes(a.inicio) - toMinutes(b.inicio) || toMinutes(a.fin) - toMinutes(b.fin))
}

export function isDone(item: AgendaItem, dateKey: string) {
  return item.tipo === 'tarea' && item.completadas.includes(dateKey)
}

const shortDate = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' })
const longDate = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' })

export function formatWeekRange(weekStart: Date) {
  const end = addDays(weekStart, 6)
  return `${shortDate.format(weekStart)} – ${shortDate.format(end)} ${end.getFullYear()}`
}

export function formatLongDate(dateKey: string) {
  const text = longDate.format(fromDateKey(dateKey))
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function describeRepeat(item: Pick<AgendaItem, 'repeticion' | 'dias'>) {
  if (item.repeticion === 'una-vez') return 'Una vez'
  const dias = [...item.dias].sort()
  if (dias.length === 7) return 'Todos los días'
  if (dias.join() === '0,1,2,3,4') return 'Lun a Vie'
  if (dias.join() === '5,6') return 'Fines de semana'
  return dias.map((d) => DAY_SHORT[d]).join(', ')
}

export interface PositionedItem {
  item: AgendaItem
  lane: number
  lanes: number
}

/** Reparte en carriles los elementos que se solapan para que no se tapen entre sí. */
export function layoutDay(items: AgendaItem[]): PositionedItem[] {
  const result: PositionedItem[] = []
  let cluster: PositionedItem[] = []
  let laneEnds: number[] = []
  let clusterEnd = -1

  const flush = () => {
    cluster.forEach((p) => (p.lanes = laneEnds.length))
    result.push(...cluster)
    cluster = []
    laneEnds = []
  }

  for (const item of items) {
    const start = toMinutes(item.inicio)
    const end = Math.max(toMinutes(item.fin), start + 15)
    if (start >= clusterEnd && cluster.length) flush()

    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(end)
    } else {
      laneEnds[lane] = end
    }
    cluster.push({ item, lane, lanes: 1 })
    clusterEnd = Math.max(clusterEnd, end)
  }
  flush()
  return result
}
