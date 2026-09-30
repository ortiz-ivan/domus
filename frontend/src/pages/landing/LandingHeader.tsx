import { Menu, X } from 'lucide-react'
import { useEffect, useRef, type RefObject } from 'react'
import { Link, useLocation } from 'react-router'
import { LinkButton } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/cn'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { SearchForm } from '@/components/SearchForm'

const LINKS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  // Página propia, no una sección de la portada
  { href: '/para-profesionales', label: 'Soy profesional' },
]

interface LandingHeaderProps {
  showSearch?: boolean
  /** false en páginas públicas fuera de la portada (perfil de un profesional): los links vuelven a la portada */
  onLanding?: boolean
}

const linkClass =
  'inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground'

/** Sección de la portada (#ancla) o página propia; fuera de la portada, las anclas vuelven a ella */
function SectionLink({ href, label, onLanding, className, onNavigate }: { href: string; label: string; onLanding: boolean; className: string; onNavigate?: () => void }) {
  const { pathname } = useLocation()
  if (href.startsWith('/')) {
    return (
      <Link to={href} onClick={onNavigate} aria-current={pathname === href ? 'page' : undefined} className={className}>
        {label}
      </Link>
    )
  }
  return onLanding ? (
    <a href={href} onClick={onNavigate} className={className}>
      {label}
    </a>
  ) : (
    <Link to={`/${href}`} onClick={onNavigate} className={className}>
      {label}
    </Link>
  )
}

/** Menú de celular y tablet angosta (debajo de md el header no tiene lugar para los links). <dialog> da foco atrapado y cierre con Esc. */
function MobileMenu({ dialogRef, onLanding }: { dialogRef: RefObject<HTMLDialogElement | null>; onLanding: boolean }) {
  const close = () => dialogRef.current?.close()

  // Si la ventana crece a md con el menú abierto, el menú se oculta pero el modal seguiría bloqueando la página
  const isWide = useMediaQuery('(min-width: 768px)')
  useEffect(() => {
    if (isWide) dialogRef.current?.close()
  }, [isWide, dialogRef])

  return (
    <dialog
      ref={dialogRef}
      aria-label="Menú"
      className="m-0 ml-auto h-dvh max-h-none w-72 max-w-[85vw] bg-card p-4 text-foreground backdrop:bg-primary/40 md:hidden"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="flex h-full flex-col">
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={close}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg hover:bg-muted"
            aria-label="Cerrar menú"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Secciones" className="flex-1">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <SectionLink
                  href={link.href}
                  label={link.label}
                  onLanding={onLanding}
                  onNavigate={close}
                  className="flex min-h-12 items-center rounded-lg px-3 font-medium hover:bg-muted aria-[current=page]:bg-muted"
                />
              </li>
            ))}
          </ul>
        </nav>
        {/* Con el buscador compacto, "Ingresar" no entra en el header del celular: acá siempre está */}
        <LinkButton to="/ingresar" size="lg" className="w-full rounded-full" onClick={close}>
          Ingresar
        </LinkButton>
      </div>
    </dialog>
  )
}

/** Header fijo. Cuando el buscador del hero sale de pantalla, aparece uno compacto en su lugar (como Thumbtack). */
export function LandingHeader({ showSearch = false, onLanding = true }: LandingHeaderProps) {
  const menuRef = useRef<HTMLDialogElement>(null)
  const logo = (
    <>
      <span className="sm:hidden">
        <Logo compact={showSearch} />
      </span>
      <span className="hidden sm:block">
        <Logo />
      </span>
    </>
  )

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:h-18 sm:px-6 lg:px-8">
        {onLanding ? (
          <a href="#inicio" className="shrink-0 rounded-lg" aria-label="Domus, ir al inicio">
            {logo}
          </a>
        ) : (
          <Link to="/" className="shrink-0 rounded-lg" aria-label="Domus, ir a la portada">
            {logo}
          </Link>
        )}

        <div className="flex min-w-0 flex-1 justify-center">
          {showSearch ? (
            <SearchForm variant="compact" className="w-full max-w-xl" />
          ) : (
            <nav aria-label="Secciones" className="hidden md:block">
              <ul className="flex gap-1">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <SectionLink href={link.href} label={link.label} onLanding={onLanding} className={linkClass} />
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <LinkButton
          to="/ingresar"
          variant="soft"
          className={cn('shrink-0 rounded-full', showSearch && 'max-sm:hidden')}
        >
          Ingresar
        </LinkButton>

        <button
          type="button"
          onClick={() => menuRef.current?.showModal()}
          className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-muted md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </div>

      <MobileMenu dialogRef={menuRef} onLanding={onLanding} />
    </header>
  )
}
