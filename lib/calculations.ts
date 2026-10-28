import type {
  Account,
  Budget,
  Category,
  ExpenseTag,
  Transaction,
} from '@/types/finance'
import { shiftMonth } from '@/lib/format'

export interface MonthSummary {
  ingresos: number
  gastos: number
  gastosFijos: number
  gastosVariables: number
  ahorro: number
  /** Porcentaje del ingreso que se ahorró. */
  tasaAhorro: number
}

export type BudgetState = 'ok' | 'alerta' | 'excedido'

export interface BudgetProgress {
  budget: Budget
  category?: Category
  gastado: number
  porcentaje: number
  restante: number
  estado: BudgetState
}

export const EXPENSE_TAGS: ExpenseTag[] = ['personal', 'ocio', 'necesidad', 'viveres']

export const TAG_LABELS: Record<ExpenseTag, string> = {
  personal: 'Personal',
  ocio: 'Ocio',
  necesidad: 'Necesidad',
  viveres: 'Víveres',
}

export function getMonthTransactions(transactions: Transaction[], mes: string) {
  return transactions.filter((t) => t.fecha.startsWith(mes))
}

export function sortByDate(transactions: Transaction[], direction: 'asc' | 'desc' = 'asc') {
  return [...transactions].sort((a, b) =>
    direction === 'asc' ? a.fecha.localeCompare(b.fecha) : b.fecha.localeCompare(a.fecha),
  )
}

export function sumAmounts(transactions: Transaction[]) {
  return transactions.reduce((total, t) => total + t.monto, 0)
}

export function summarize(transactions: Transaction[]): MonthSummary {
  let ingresos = 0
  let gastosFijos = 0
  let gastosVariables = 0

  for (const t of transactions) {
    if (t.tipo === 'ingreso') ingresos += t.monto
    if (t.tipo === 'gasto') {
      if (t.naturaleza === 'fijo') gastosFijos += t.monto
      else gastosVariables += t.monto
    }
  }

  const gastos = gastosFijos + gastosVariables
  const ahorro = ingresos - gastos

  return {
    ingresos,
    gastos,
    gastosFijos,
    gastosVariables,
    ahorro,
    tasaAhorro: ingresos > 0 ? (ahorro / ingresos) * 100 : 0,
  }
}

/** Variación porcentual; null cuando no hay base de comparación. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / Math.abs(previous)) * 100
}

export function accountBalance(account: Account, transactions: Transaction[]) {
  return transactions.reduce((balance, t) => {
    if (t.tipo === 'ingreso' && t.cuentaId === account.id) return balance + t.monto
    if (t.tipo === 'gasto' && t.cuentaId === account.id) return balance - t.monto
    if (t.tipo === 'transferencia') {
      if (t.cuentaId === account.id) return balance - t.monto
      if (t.cuentaDestinoId === account.id) return balance + t.monto
    }
    return balance
  }, account.saldoInicial)
}

export function totalBalance(accounts: Account[], transactions: Transaction[]) {
  return accounts.reduce((total, account) => total + accountBalance(account, transactions), 0)
}

export function monthlySeries(transactions: Transaction[], endMes: string, count = 6) {
  return Array.from({ length: count }, (_, index) => {
    const mes = shiftMonth(endMes, index - (count - 1))
    const { ingresos, gastos } = summarize(getMonthTransactions(transactions, mes))
    return { mes, ingresos, gastos }
  })
}

export function spendingByTag(transactions: Transaction[]) {
  const totals = new Map<ExpenseTag, number>()
  for (const t of transactions) {
    if (t.tipo !== 'gasto' || !t.etiqueta) continue
    totals.set(t.etiqueta, (totals.get(t.etiqueta) ?? 0) + t.monto)
  }
  return EXPENSE_TAGS.map((etiqueta) => ({ etiqueta, total: totals.get(etiqueta) ?? 0 })).filter(
    (item) => item.total > 0,
  )
}

export function getBudgetState(porcentaje: number): BudgetState {
  if (porcentaje > 100) return 'excedido'
  if (porcentaje >= 80) return 'alerta'
  return 'ok'
}

export function budgetProgress(
  budgets: Budget[],
  categories: Category[],
  transactions: Transaction[],
  mes: string,
): BudgetProgress[] {
  const monthExpenses = getMonthTransactions(transactions, mes).filter((t) => t.tipo === 'gasto')

  return budgets
    .filter((b) => b.mes === mes)
    .map((budget) => {
      const gastado = sumAmounts(monthExpenses.filter((t) => t.categoriaId === budget.categoriaId))
      const porcentaje = budget.montoLimite > 0 ? (gastado / budget.montoLimite) * 100 : 0
      return {
        budget,
        category: categories.find((c) => c.id === budget.categoriaId),
        gastado,
        porcentaje,
        restante: budget.montoLimite - gastado,
        estado: getBudgetState(porcentaje),
      }
    })
}

export function totalBudget(budgets: Budget[], mes: string) {
  return budgets.filter((b) => b.mes === mes).reduce((total, b) => total + b.montoLimite, 0)
}
