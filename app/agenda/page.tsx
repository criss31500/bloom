import type { Metadata } from 'next'
import { AgendaView } from '@/components/agenda/agenda-view'

export const metadata: Metadata = {
  title: 'Agenda semanal · Mis Finanzas',
  description: 'Organiza tus horarios, rutinas y tareas de cada día de la semana.',
}

export default function AgendaPage() {
  return <AgendaView />
}
