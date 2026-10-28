import {
  Briefcase,
  Bus,
  Ellipsis,
  GraduationCap,
  HeartPulse,
  House,
  Laptop,
  Popcorn,
  Repeat,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { Category, CategoryIcon as CategoryIconName } from '@/types/finance'
import { cn } from '@/lib/utils'

const ICONS: Record<CategoryIconName, LucideIcon> = {
  sueldo: Briefcase,
  freelance: Laptop,
  vivienda: House,
  alimentacion: UtensilsCrossed,
  transporte: Bus,
  servicios: Zap,
  salud: HeartPulse,
  ocio: Popcorn,
  educacion: GraduationCap,
  suscripciones: Repeat,
  otros: Ellipsis,
}

export function CategoryIcon({ category, className }: { category?: Category; className?: string }) {
  const Icon = category ? ICONS[category.icono] : Ellipsis
  return (
    <span
      className={cn('flex size-7 shrink-0 items-center justify-center rounded-md', className)}
      style={{
        backgroundColor: `color-mix(in oklch, ${category?.color ?? 'var(--muted-foreground)'} 16%, transparent)`,
        color: category?.color ?? 'var(--muted-foreground)',
      }}
      title={category?.nombre}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span className="sr-only">{category?.nombre ?? 'Sin categoría'}</span>
    </span>
  )
}
