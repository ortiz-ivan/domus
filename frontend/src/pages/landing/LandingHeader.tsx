import { LinkButton } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/cn'
import { SearchForm } from '@/components/SearchForm'

const LINKS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#profesionales', label: 'Soy profesional' },
]

/** Header fijo. Cuando el buscador del hero sale de pantalla, aparece uno compacto en su lugar (como Thumbtack). */
export function LandingHeader({ showSearch }: { showSearch: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:h-18 sm:px-6 lg:px-8">
        <a href="#inicio" className="shrink-0 rounded-lg" aria-label="Domus, ir al inicio">
          <span className="sm:hidden">
            <Logo compact={showSearch} />
          </span>
          <span className="hidden sm:block">
            <Logo />
          </span>
        </a>

        <div className="flex min-w-0 flex-1 justify-center">
          {showSearch ? (
            <SearchForm variant="compact" className="w-full max-w-xl" />
          ) : (
            <nav aria-label="Secciones" className="hidden md:block">
              <ul className="flex gap-1">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
                    >
                      {link.label}
                    </a>
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
