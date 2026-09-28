import { LogOut, Menu, X } from 'lucide-react'
import { useEffect, useRef, type RefObject } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { BOTTOM_NAV_MAX, NAVIGATION, ROLE_LABELS, type NavItem } from '@/app/navigation'
import { useLiveNotifications } from '@/app/useLiveNotifications'
import { useNavBadges } from '@/app/useNavBadges'
import { Logo } from '@/components/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { Toaster } from '@/components/ui/Toaster'
import { cn } from '@/lib/cn'
import { useCurrentUser } from '@/store/selectors'
import { useSessionStore } from '@/store/session'
import type { Role } from '@/types'

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150',
          isActive ? 'bg-primary text-on-primary' : 'text-foreground hover:bg-muted',
        )
      }
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      {item.label}
      {item.badge && item.badge.count > 0 && (
        <span className="ml-auto min-w-6 rounded-full bg-accent px-2 text-center text-xs leading-6 font-semibold text-on-accent tabular-nums">
          {item.badge.count}
          <span className="sr-only"> {item.badge.label}</span>
        </span>
      )}
    </NavLink>
  )
}

function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex">
        {items.map(({ to, label, icon: Icon, end, badge }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-xs font-medium transition-colors duration-150',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'inline-flex h-7 w-12 items-center justify-center rounded-full',
                      isActive && 'bg-accent-soft',
                    )}
                  >
                    <span className="relative">
                      <Icon className="size-5" aria-hidden="true" />
                      {badge && badge.count > 0 && (
                        <span className="absolute -top-2 -right-3 min-w-5 rounded-full bg-accent px-1 text-center text-[11px] leading-5 font-semibold text-on-accent tabular-nums">
                          {badge.count}
                          <span className="sr-only"> {badge.label}</span>
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="text-center leading-tight">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Menú lateral móvil para roles con más de BOTTOM_NAV_MAX secciones. <dialog> da foco atrapado y cierre con Esc. */
function MobileDrawer({ items, dialogRef }: { items: NavItem[]; dialogRef: RefObject<HTMLDialogElement | null> }) {
  const close = () => dialogRef.current?.close()
  return (
    <dialog
      ref={dialogRef}
      aria-label="Menú"
      className="m-0 h-dvh max-h-none w-72 max-w-[85vw] bg-card p-4 backdrop:bg-primary/40 lg:hidden"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="mb-6 flex items-center justify-between">
        <Logo />
        <button
          type="button"
          onClick={close}
          className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-muted"
          aria-label="Cerrar menú"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <nav aria-label="Navegación principal">
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.to}>
              <SidebarLink item={item} onNavigate={close} />
            </li>
          ))}
        </ul>
      </nav>
    </dialog>
  )
}

export function AppShell({ role }: { role: Role }) {
  const user = useCurrentUser()
  const logout = useSessionStore((s) => s.logout)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const drawerRef = useRef<HTMLDialogElement>(null)

  const badges = useNavBadges(role)
  const items = NAVIGATION[role].map((item) => ({ ...item, badge: badges[item.to] }))
  const pendingTotal = Object.values(badges).reduce((sum, b) => sum + b.count, 0)
  useLiveNotifications(role)

  // El título de la pestaña muestra los pendientes: se ve desde la otra pestaña durante la demo
  useEffect(() => {
    document.title = pendingTotal > 0 ? `(${pendingTotal}) Domus` : 'Domus'
    return () => {
      document.title = 'Domus'
    }
  }, [pendingTotal])
  const useBottomNav = items.length <= BOTTOM_NAV_MAX

  // Al cambiar de pantalla: volver arriba y llevar el foco al contenido (lectores de pantalla)
  useEffect(() => {
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  const switchRole = () => {
    logout()
    navigate('/ingresar')
  }

  return (
    <div className="min-h-dvh lg:pl-64">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        Saltar al contenido
      </a>

      {/* Sidebar escritorio */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-card p-4 lg:flex">
        <Logo className="mb-2 px-2" />
        <p className="mb-6 px-2 text-xs font-semibold tracking-wide text-accent-text uppercase">{ROLE_LABELS[role]}</p>
        <nav aria-label="Navegación principal" className="flex-1">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.to}>
                <SidebarLink item={item} />
              </li>
            ))}
          </ul>
        </nav>
        {user && (
          <div className="border-t border-border pt-4">
            <div className="mb-3 flex items-center gap-3 px-2">
              <Avatar name={user.name} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={switchRole}
              className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-5" aria-hidden="true" />
              Cambiar de rol
            </button>
          </div>
        )}
      </aside>

      {/* Barra superior móvil */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-2 border-b border-border bg-card/95 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-1">
          {!useBottomNav && (
            <button
              type="button"
              onClick={() => drawerRef.current?.showModal()}
              className="-ml-2 inline-flex size-11 items-center justify-center rounded-lg hover:bg-muted"
              aria-label="Abrir menú"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          )}
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-text">
            {ROLE_LABELS[role]}
          </span>
          <button
            type="button"
            onClick={switchRole}
            className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Cambiar de rol"
          >
            <LogOut className="size-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main
        id="contenido"
        ref={mainRef}
        tabIndex={-1}
        className={cn('mx-auto max-w-6xl px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8', useBottomNav && 'pb-28 lg:pb-8')}
      >
        <Outlet />
      </main>

      {useBottomNav ? <BottomNav items={items} /> : <MobileDrawer items={items} dialogRef={drawerRef} />}
      <Toaster />
    </div>
  )
}
