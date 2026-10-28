import { CalendarDays, Wallet, type LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  shortLabel: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Finanzas', shortLabel: 'Finanzas', icon: Wallet },
  { href: '/agenda', label: 'Agenda semanal', shortLabel: 'Agenda', icon: CalendarDays },
]
