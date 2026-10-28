import {
  ArrowLeftRight,
  Landmark,
  LayoutDashboard,
  PiggyBank,
  Settings,
  Target,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  shortLabel: string
  icon: LucideIcon
  available: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', shortLabel: 'Inicio', icon: LayoutDashboard, available: true },
  { href: '/transacciones', label: 'Transacciones', shortLabel: 'Movimientos', icon: ArrowLeftRight, available: false },
  { href: '/presupuestos', label: 'Presupuestos', shortLabel: 'Presupuesto', icon: PiggyBank, available: false },
  { href: '/cuentas', label: 'Cuentas', shortLabel: 'Cuentas', icon: Landmark, available: false },
  { href: '/metas', label: 'Metas de ahorro', shortLabel: 'Metas', icon: Target, available: false },
  { href: '/configuracion', label: 'Configuración', shortLabel: 'Ajustes', icon: Settings, available: false },
]
