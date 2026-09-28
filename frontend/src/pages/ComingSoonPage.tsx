import { ArrowLeft, Hammer } from 'lucide-react'
import { Link } from 'react-router'
import { Logo } from '@/components/Logo'
import { LinkButton } from '@/components/ui/Button'

/** Destino de los CTA en la vista previa "solo landing": la plataforma todavía no está publicada */
export function ComingSoonPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className="rounded-lg" aria-label="Domus, volver al inicio">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-accent-soft">
            <Hammer className="size-8 text-accent-text" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-bold text-balance">Estamos construyendo la plataforma</h1>
          <p className="mt-3 text-muted-foreground">
            Esta es una vista previa de la portada de Domus. Muy pronto vas a poder buscar profesionales, pedir servicios y seguir cada trabajo desde acá.
          </p>
          <LinkButton to="/" size="lg" className="mt-8 rounded-full">
            <ArrowLeft className="size-5" aria-hidden="true" />
            Volver a la portada
          </LinkButton>
        </div>
      </main>
    </div>
  )
}
