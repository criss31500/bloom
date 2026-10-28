'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/components/app-shell/nav-items'
import { cn } from '@/lib/utils'

const MOBILE_ITEMS = NAV_ITEMS.slice(0, 5)

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="flex">
        {MOBILE_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          const content = (
            <>
              <Icon className="size-5" aria-hidden="true" />
              <span className="text-[11px] font-medium">{item.shortLabel}</span>
            </>
          )
          const className = cn(
            'flex flex-col items-center gap-1 py-2.5',
            active ? 'text-primary' : 'text-muted-foreground',
          )

          return (
            <li key={item.href} className="flex-1">
              {item.available ? (
                <Link href={item.href} aria-current={active ? 'page' : undefined} className={className}>
                  {content}
                </Link>
              ) : (
                <span aria-disabled="true" className={cn(className, 'opacity-40')}>
                  {content}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
