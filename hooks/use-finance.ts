'use client'

import useSWR from 'swr'
import { getFinanceData, getMonthNote, saveMonthNote } from '@/lib/storage'
import type { MonthNote } from '@/types/finance'

export function useFinanceData() {
  return useSWR('finance-data', getFinanceData, { revalidateOnFocus: false })
}

export function useMonthNote(mes: string) {
  const swr = useSWR(['month-note', mes], () => getMonthNote(mes), { revalidateOnFocus: false })

  async function save(note: MonthNote) {
    await swr.mutate(saveMonthNote(note), { revalidate: false })
  }

  return { ...swr, save }
}
