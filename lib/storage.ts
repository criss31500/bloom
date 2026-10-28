/**
 * Capa de acceso a datos. Hoy usa localStorage; las funciones son async para
 * poder sustituirlas por llamadas a una base de datos sin tocar los componentes.
 */
import type {
  Account,
  Budget,
  Category,
  FinanceData,
  MonthNote,
  SavingsGoal,
  Settings,
  Transaction,
} from '@/types/finance'
import { createSeedData } from '@/lib/seed'

const KEYS = {
  seeded: 'mf:seeded',
  accounts: 'mf:accounts',
  categories: 'mf:categories',
  transactions: 'mf:transactions',
  budgets: 'mf:budgets',
  goals: 'mf:goals',
  settings: 'mf:settings',
  notes: 'mf:notes',
} as const

const DEFAULT_SETTINGS: Settings = { moneda: 'MXN' }

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function createId() {
  return crypto.randomUUID()
}

function ensureSeeded() {
  if (typeof window === 'undefined' || window.localStorage.getItem(KEYS.seeded)) return
  const seed = createSeedData(new Date())
  write(KEYS.accounts, seed.accounts)
  write(KEYS.categories, seed.categories)
  write(KEYS.transactions, seed.transactions)
  write(KEYS.budgets, seed.budgets)
  write(KEYS.goals, seed.goals)
  write(KEYS.settings, seed.settings)
  write(KEYS.seeded, true)
}

export async function getFinanceData(): Promise<FinanceData> {
  ensureSeeded()
  return {
    accounts: await getAccounts(),
    categories: await getCategories(),
    transactions: await getTransactions(),
    budgets: await getBudgets(),
    goals: await getGoals(),
    settings: await getSettings(),
  }
}

export async function getAccounts() {
  return read<Account[]>(KEYS.accounts, [])
}

export async function getCategories() {
  return read<Category[]>(KEYS.categories, [])
}

export async function getTransactions() {
  return read<Transaction[]>(KEYS.transactions, [])
}

export async function addTransaction(input: Omit<Transaction, 'id'>) {
  const transaction: Transaction = { ...input, id: createId() }
  write(KEYS.transactions, [...(await getTransactions()), transaction])
  return transaction
}

export async function updateTransaction(id: string, patch: Partial<Omit<Transaction, 'id'>>) {
  const transactions = await getTransactions()
  write(
    KEYS.transactions,
    transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
  )
}

export async function deleteTransaction(id: string) {
  write(
    KEYS.transactions,
    (await getTransactions()).filter((t) => t.id !== id),
  )
}

export async function getBudgets() {
  return read<Budget[]>(KEYS.budgets, [])
}

export async function getGoals() {
  return read<SavingsGoal[]>(KEYS.goals, [])
}

export async function getSettings() {
  return read<Settings>(KEYS.settings, DEFAULT_SETTINGS)
}

export async function getMonthNote(mes: string): Promise<MonthNote> {
  const notes = read<MonthNote[]>(KEYS.notes, [])
  return notes.find((n) => n.mes === mes) ?? { mes, nota: '', reflexion: '' }
}

export async function saveMonthNote(note: MonthNote) {
  const notes = read<MonthNote[]>(KEYS.notes, []).filter((n) => n.mes !== note.mes)
  write(KEYS.notes, [...notes, note])
  return note
}
