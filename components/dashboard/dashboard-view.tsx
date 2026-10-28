'use client'

import { useState } from 'react'
import { BudgetAlerts } from '@/components/dashboard/budget-alerts'
import { BudgetBanner } from '@/components/dashboard/budget-banner'
import { ClosingCard } from '@/components/dashboard/closing-card'
import { IncomeExpenseChart } from '@/components/dashboard/income-expense-chart'
import { MonthNotes } from '@/components/dashboard/month-notes'
import { MonthSwitcher } from '@/components/dashboard/month-switcher'
import { MovementList } from '@/components/dashboard/movement-list'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { TagDonutChart } from '@/components/dashboard/tag-donut-chart'
import { useFinanceData } from '@/hooks/use-finance'
import {
  budgetProgress,
  getMonthTransactions,
  monthlySeries,
  percentChange,
  sortByDate,
  spendingByTag,
  summarize,
  totalBalance,
  totalBudget,
} from '@/lib/calculations'
import { shiftMonth, toMonthKey } from '@/lib/format'

export function DashboardView() {
  const currentMonth = toMonthKey(new Date())
  const [mes, setMes] = useState(currentMonth)
  const { data, error } = useFinanceData()

  if (error) {
    return <p className="text-sm text-expense">No se pudieron cargar tus datos.</p>
  }

  if (!data) return <DashboardSkeleton />

  const { accounts, categories, transactions, budgets, settings } = data
  const moneda = settings.moneda

  const monthTransactions = sortByDate(getMonthTransactions(transactions, mes))
  const summary = summarize(monthTransactions)
  const previous = summarize(getMonthTransactions(transactions, shiftMonth(mes, -1)))

  const ingresos = monthTransactions.filter((t) => t.tipo === 'ingreso')
  const gastosFijos = monthTransactions.filter((t) => t.tipo === 'gasto' && t.naturaleza === 'fijo')
  const gastosVariables = monthTransactions.filter((t) => t.tipo === 'gasto' && t.naturaleza !== 'fijo')

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Finanzas</h1>
          <p className="text-sm text-muted-foreground">Resumen del mes: tu hoja de presupuesto, siempre al día.</p>
        </div>
        <MonthSwitcher mes={mes} maxMes={currentMonth} onChange={setMes} />
      </div>

      <BudgetBanner mes={mes} presupuesto={totalBudget(budgets, mes)} gastado={summary.gastos} moneda={moneda} />

      <SummaryCards
        moneda={moneda}
        saldoTotal={totalBalance(accounts, transactions)}
        ingresos={summary.ingresos}
        gastos={summary.gastos}
        ahorro={summary.ahorro}
        cambioIngresos={percentChange(summary.ingresos, previous.ingresos)}
        cambioGastos={percentChange(summary.gastos, previous.gastos)}
        cambioAhorro={percentChange(summary.ahorro, previous.ahorro)}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={monthlySeries(transactions, mes, 6)} moneda={moneda} />
        </div>
        <TagDonutChart data={spendingByTag(monthTransactions)} moneda={moneda} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MovementList
          title="Ingresos"
          description="Quincenas, extras y otros"
          accent="income"
          transactions={ingresos}
          categories={categories}
          moneda={moneda}
          emptyMessage="Aún no registras ingresos este mes."
        />
        <MovementList
          title="Gastos fijos"
          description="Se repiten cada mes"
          accent="fixed"
          transactions={gastosFijos}
          categories={categories}
          moneda={moneda}
          emptyMessage="Sin gastos fijos registrados."
        />
        <div className="md:col-span-2 xl:col-span-1">
          <MovementList
            title="Gastos variables"
            description="Cambian según tu consumo"
            accent="variable"
            transactions={gastosVariables}
            categories={categories}
            moneda={moneda}
            emptyMessage="Sin gastos variables este mes."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ClosingCard mes={mes} summary={summary} moneda={moneda} />
        <BudgetAlerts items={budgetProgress(budgets, categories, transactions, mes)} moneda={moneda} />
        <div className="md:col-span-2 xl:col-span-1">
          <MonthNotes mes={mes} />
        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6" aria-busy="true" aria-label="Cargando resumen">
      <div className="h-12 w-64 animate-pulse rounded-lg bg-muted" />
      <div className="h-32 animate-pulse rounded-xl bg-muted" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-xl bg-muted" />
    </div>
  )
}
