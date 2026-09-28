import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

/** Volver a la pantalla padre (destino fijo y predecible, no el historial del navegador) */
export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="-ml-2 mb-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </Link>
  )
}
