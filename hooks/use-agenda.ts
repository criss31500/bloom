'use client'

import useSWR from 'swr'
import {
  addAgendaItem,
  deleteAgendaItem,
  getAgendaItems,
  toggleAgendaItemDone,
  updateAgendaItem,
} from '@/lib/agenda-storage'
import type { AgendaItemInput } from '@/types/agenda'

export function useAgenda() {
  const swr = useSWR('agenda-items', getAgendaItems, { revalidateOnFocus: false })

  async function save(input: AgendaItemInput, id?: string) {
    await swr.mutate(id ? updateAgendaItem(id, input) : addAgendaItem(input), { revalidate: false })
  }

  async function remove(id: string) {
    await swr.mutate(deleteAgendaItem(id), { revalidate: false })
  }

  async function toggleDone(id: string, dateKey: string) {
    await swr.mutate(toggleAgendaItemDone(id, dateKey), { revalidate: false })
  }

  return { ...swr, save, remove, toggleDone }
}
