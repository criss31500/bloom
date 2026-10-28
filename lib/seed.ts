import type {
  Account,
  Budget,
  Category,
  ExpenseNature,
  ExpenseTag,
  FinanceData,
  SavingsGoal,
  Transaction,
} from '@/types/finance'
import { shiftMonth, toDateKey, toMonthKey } from '@/lib/format'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-sueldo', nombre: 'Sueldo', tipo: 'ingreso', color: 'oklch(0.6 0.13 155)', icono: 'sueldo' },
  { id: 'cat-freelance', nombre: 'Freelance', tipo: 'ingreso', color: 'oklch(0.65 0.12 180)', icono: 'freelance' },
  { id: 'cat-vivienda', nombre: 'Vivienda', tipo: 'gasto', color: 'oklch(0.55 0.09 250)', icono: 'vivienda' },
  { id: 'cat-alimentacion', nombre: 'Alimentación', tipo: 'gasto', color: 'oklch(0.7 0.16 55)', icono: 'alimentacion' },
  { id: 'cat-transporte', nombre: 'Transporte', tipo: 'gasto', color: 'oklch(0.6 0.1 220)', icono: 'transporte' },
  { id: 'cat-servicios', nombre: 'Servicios', tipo: 'gasto', color: 'oklch(0.75 0.14 90)', icono: 'servicios' },
  { id: 'cat-salud', nombre: 'Salud', tipo: 'gasto', color: 'oklch(0.62 0.18 15)', icono: 'salud' },
  { id: 'cat-ocio', nombre: 'Ocio', tipo: 'gasto', color: 'oklch(0.58 0.17 295)', icono: 'ocio' },
  { id: 'cat-educacion', nombre: 'Educación', tipo: 'gasto', color: 'oklch(0.55 0.12 270)', icono: 'educacion' },
  { id: 'cat-suscripciones', nombre: 'Suscripciones', tipo: 'gasto', color: 'oklch(0.6 0.15 330)', icono: 'suscripciones' },
  { id: 'cat-otros', nombre: 'Otros', tipo: 'gasto', color: 'oklch(0.6 0.01 80)', icono: 'otros' },
]

const ACCOUNTS: Account[] = [
  { id: 'acc-banco', nombre: 'Banco', tipo: 'banco', saldoInicial: 5000, moneda: 'MXN' },
  { id: 'acc-efectivo', nombre: 'Efectivo', tipo: 'efectivo', saldoInicial: 800, moneda: 'MXN' },
  { id: 'acc-tarjeta', nombre: 'Tarjeta de crédito', tipo: 'credito', saldoInicial: 0, moneda: 'MXN' },
]

const GOALS: SavingsGoal[] = [
  { id: 'goal-emergencia', nombre: 'Fondo de emergencia', montoObjetivo: 30000, montoActual: 12500 },
  { id: 'goal-vacaciones', nombre: 'Vacaciones', montoObjetivo: 15000, montoActual: 4200 },
]

const BUDGET_LIMITS: Record<string, number> = {
  'cat-vivienda': 8000,
  'cat-alimentacion': 4500,
  'cat-transporte': 1200,
  'cat-servicios': 2200,
  'cat-salud': 800,
  'cat-ocio': 400,
  'cat-educacion': 700,
  'cat-suscripciones': 300,
  'cat-otros': 1000,
}

interface SeedEntry {
  dia: number
  descripcion: string
  monto: number
  categoriaId: string
  cuentaId: string
  tipo: 'ingreso' | 'gasto'
  naturaleza?: ExpenseNature
  etiqueta?: ExpenseTag
  /** Si es true, el monto varía ligeramente cada mes. */
  varia?: boolean
}

const ingreso = (dia: number, descripcion: string, monto: number, categoriaId = 'cat-sueldo', varia = false): SeedEntry => ({
  dia,
  descripcion,
  monto,
  categoriaId,
  cuentaId: 'acc-banco',
  tipo: 'ingreso',
  varia,
})

const fijo = (dia: number, descripcion: string, monto: number, categoriaId: string, etiqueta: ExpenseTag, cuentaId = 'acc-banco'): SeedEntry => ({
  dia,
  descripcion,
  monto,
  categoriaId,
  cuentaId,
  tipo: 'gasto',
  naturaleza: 'fijo',
  etiqueta,
})

const variable = (dia: number, descripcion: string, monto: number, categoriaId: string, etiqueta: ExpenseTag, cuentaId = 'acc-efectivo'): SeedEntry => ({
  dia,
  descripcion,
  monto,
  categoriaId,
  cuentaId,
  tipo: 'gasto',
  naturaleza: 'variable',
  etiqueta,
  varia: true,
})

const MONTH_TEMPLATE: SeedEntry[] = [
  ingreso(15, '1ª Quincena', 11250),
  ingreso(30, '2ª Quincena', 11250),
  ingreso(20, 'Horas extras', 1500, 'cat-sueldo', true),
  fijo(1, 'Alquiler', 8000, 'cat-vivienda', 'necesidad'),
  fijo(2, 'Pasaje (transporte)', 900, 'cat-transporte', 'necesidad', 'acc-efectivo'),
  fijo(5, 'Servicios (luz, agua, gas)', 1410, 'cat-servicios', 'necesidad'),
  fijo(8, 'Teléfono', 350, 'cat-servicios', 'necesidad'),
  fijo(10, 'Streaming', 299, 'cat-suscripciones', 'ocio', 'acc-tarjeta'),
  variable(4, 'Supermercado', 2400, 'cat-alimentacion', 'viveres', 'acc-tarjeta'),
  variable(6, 'Préstamo (Jenifer)', 750, 'cat-otros', 'personal'),
  variable(9, 'Mini compra', 345, 'cat-alimentacion', 'viveres'),
  variable(10, 'Dulces', 90, 'cat-alimentacion', 'ocio'),
  variable(11, 'Comida rápida', 150, 'cat-alimentacion', 'ocio'),
  variable(12, 'Lavandería', 165, 'cat-servicios', 'necesidad'),
  variable(13, 'Consumo interno', 930, 'cat-alimentacion', 'viveres'),
  variable(16, 'Farmacia', 420, 'cat-salud', 'necesidad', 'acc-tarjeta'),
  variable(18, 'Cine', 280, 'cat-ocio', 'ocio', 'acc-tarjeta'),
  variable(22, 'Curso en línea', 600, 'cat-educacion', 'personal', 'acc-tarjeta'),
  variable(24, 'Comida rápida', 160, 'cat-alimentacion', 'ocio'),
  variable(26, 'Lavandería', 165, 'cat-servicios', 'necesidad'),
]

const MONTH_VARIATION = [0.88, 1.06, 0.97]

function round(value: number) {
  return Math.round(value / 5) * 5
}

export function createSeedData(today: Date): FinanceData {
  const currentMonth = toMonthKey(today)
  const todayKey = toDateKey(today)
  const months = [shiftMonth(currentMonth, -2), shiftMonth(currentMonth, -1), currentMonth]

  const transactions: Transaction[] = []
  const budgets: Budget[] = []

  months.forEach((mes, monthIndex) => {
    const [year, month] = mes.split('-').map(Number)
    const lastDay = new Date(year, month, 0).getDate()
    const factor = MONTH_VARIATION[monthIndex]

    MONTH_TEMPLATE.forEach((entry, entryIndex) => {
      const dia = Math.min(entry.dia, lastDay)
      const fecha = `${mes}-${String(dia).padStart(2, '0')}`
      if (fecha > todayKey) return

      transactions.push({
        id: `seed-${mes}-${entryIndex}`,
        fecha,
        monto: entry.varia ? round(entry.monto * factor) : entry.monto,
        tipo: entry.tipo,
        categoriaId: entry.categoriaId,
        cuentaId: entry.cuentaId,
        descripcion: entry.descripcion,
        naturaleza: entry.naturaleza,
        etiqueta: entry.etiqueta,
      })
    })

    Object.entries(BUDGET_LIMITS).forEach(([categoriaId, montoLimite]) => {
      budgets.push({ id: `budget-${mes}-${categoriaId}`, categoriaId, montoLimite, mes })
    })
  })

  return {
    accounts: ACCOUNTS,
    categories: DEFAULT_CATEGORIES,
    transactions,
    budgets,
    goals: GOALS,
    settings: { moneda: 'MXN' },
  }
}
