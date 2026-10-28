import { Wallet } from 'lucide-react'
import { SidebarNav } from '@/components/app-shell/sidebar-nav'
import { MobileNav } from '@/components/app-shell/mobile-nav'
import { ThemeToggle } from '@/components/app-shell/theme-toggle'

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wallet className="size-5" aria-hidden="true" />
      </span>
      <span className="text-base font-semibold tracking-tight">Mis Finanzas</span>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <div className="px-2">
          <Brand />
        </div>
        <SidebarNav />
        <div className="mt-auto flex items-center justify-between rounded-lg px-2 pt-4">
          <span className="text-sm text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Brand />
          <ThemeToggle />
        </header>
        <main className="flex-1 px-4 pt-5 pb-28 sm:px-6 lg:px-10 lg:py-8">{children}</main>
      </div>

      <MobileNav />
    </div>
  )
}
