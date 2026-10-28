export type Currency = 'MXN' | 'USD' | 'EUR' | 'COP' | 'ARS' | 'CLP' | 'PEN'

export type AccountType = 'banco' | 'efectivo' | 'credito' | 'ahorro'

export interface Account {
  id: string
  nombre: string
  tipo: AccountType
  saldoInicial: number
  moneda: Currency
}

export type CategoryType = 'ingreso' | 'gasto'

export type CategoryIcon =
  | 'sueldo'
  | 'freelance'
  | 'vivienda'
  | 'alimentacion'
  | 'transporte'
  | 'servicios'
  | 'salud'
  | 'ocio'
  | 'educacion'
  | 'suscripciones'
  | 'otros'

export interface Category {
  id: string
  nombre: string
  tipo: CategoryType
  color: string
  icono: CategoryIcon
}

export type TransactionType = 'ingreso' | 'gasto' | 'transferencia'

/** Fijo: se repite cada mes (alquiler, teléfono). Variable: cambia según el consumo. */
export type ExpenseNature = 'fijo' | 'variable'

/** Etiquetas de la hoja de presupuesto: para qué fue el gasto. */
export type ExpenseTag = 'personal' | 'ocio' | 'necesidad' | 'viveres'

export interface Transaction {
  id: string
  /** Formato YYYY-MM-DD */
  fecha: string
  monto: number
  tipo: TransactionType
  categoriaId: string
  cuentaId: string
  cuentaDestinoId?: string
  descripcion: string
  notas?: string
  naturaleza?: ExpenseNature
  etiqueta?: ExpenseTag
}

export interface Budget {
  id: string
  categoriaId: string
  montoLimite: number
  /** Formato YYYY-MM */
  mes: string
}

export interface SavingsGoal {
  id: string
  nombre: string
  montoObjetivo: number
  montoActual: number
  fechaLimite?: string
}

export interface MonthNote {
  /** Formato YYYY-MM */
  mes: string
  nota: string
  reflexion: string
}

export interface Settings {
  moneda: Currency
}

export interface FinanceData {
  accounts: Account[]
  categories: Category[]
  transactions: Transaction[]
  budgets: Budget[]
  goals: SavingsGoal[]
  settings: Settings
}
