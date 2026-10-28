'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/components/app-shell/nav-items'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="flex">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="text-[11px] font-medium">{item.shortLabel}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
