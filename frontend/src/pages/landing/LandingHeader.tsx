import { Link } from 'react-router'
import { LinkButton } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/cn'
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

/** Header fijo. Cuando el buscador del hero sale de pantalla, aparece uno compacto en su lugar (como Thumbtack). */
export function LandingHeader({ showSearch = false, onLanding = true }: LandingHeaderProps) {
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
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    ) : onLanding ? (
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    ) : (
                      <Link to={`/${link.href}`} className={linkClass}>
                        {link.label}
                      </Link>
                    )}
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
      </div>
    </header>
  )
}
