'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/components/app-shell/nav-items'
import { cn } from '@/lib/utils'

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Principal" className="mt-8 flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href
        const className = cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          active
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
        )

        if (!item.available) {
          return (
            <span key={item.href} aria-disabled="true" className={cn(className, 'cursor-not-allowed opacity-50 hover:bg-transparent')}>
              <Icon className="size-4" aria-hidden="true" />
              {item.label}
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Pronto
              </span>
            </span>
          )
        }

        return (
          <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={className}>
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
