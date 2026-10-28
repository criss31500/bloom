import type { Currency } from '@/types/finance'

const LOCALE = 'es-MX'

const currencyFormatters = new Map<string, Intl.NumberFormat>()

export function formatCurrency(amount: number, currency: Currency = 'MXN', compact = false) {
  const key = `${currency}-${compact}`
  let formatter = currencyFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency,
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 2,
      minimumFractionDigits: compact ? 0 : 2,
    })
    currencyFormatters.set(key, formatter)
  }
  return formatter.format(amount)
}

export function formatPercent(value: number, withSign = false) {
  const formatted = new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: 1,
    signDisplay: withSign ? 'exceptZero' : 'auto',
  }).format(value)
  return `${formatted} %`
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export function toDateKey(date: Date) {
  return `${toMonthKey(date)}-${pad(date.getDate())}`
}

export function monthKeyToDate(mes: string) {
  const [year, month] = mes.split('-').map(Number)
  return new Date(year, month - 1, 1)
}

export function shiftMonth(mes: string, delta: number) {
  const date = monthKeyToDate(mes)
  date.setMonth(date.getMonth() + delta)
  return toMonthKey(date)
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatMonth(mes: string) {
  return capitalize(
    new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' }).format(monthKeyToDate(mes)),
  )
}

export function formatMonthName(mes: string) {
  return new Intl.DateTimeFormat(LOCALE, { month: 'long' }).format(monthKeyToDate(mes))
}

export function formatShortMonth(mes: string) {
  return capitalize(
    new Intl.DateTimeFormat(LOCALE, { month: 'short' }).format(monthKeyToDate(mes)).replace('.', ''),
  )
}

export function formatDate(fecha: string) {
  const [year, month, day] = fecha.split('-').map(Number)
  return new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short' }).format(
    new Date(year, month - 1, day),
  )
}
