export type AgendaCategory = 'trabajo' | 'personal' | 'estudio' | 'salud' | 'hogar'

export type AgendaKind = 'evento' | 'tarea'

export type AgendaRepeat = 'una-vez' | 'semanal'

export interface AgendaItem {
  id: string
  titulo: string
  tipo: AgendaKind
  categoria: AgendaCategory
  /** Formato HH:MM */
  inicio: string
  /** Formato HH:MM */
  fin: string
  repeticion: AgendaRepeat
  /** YYYY-MM-DD. Solo aplica cuando repeticion es 'una-vez'. */
  fecha: string
  /** 0 = lunes … 6 = domingo. Solo aplica cuando repeticion es 'semanal'. */
  dias: number[]
  notas: string
  /** Fechas (YYYY-MM-DD) en las que la tarea se marcó como hecha. */
  completadas: string[]
}

export type AgendaItemInput = Omit<AgendaItem, 'id' | 'completadas'>
