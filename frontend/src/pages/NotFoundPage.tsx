import { SearchX } from 'lucide-react'
import { LinkButton } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <EmptyState
        icon={SearchX}
        title="Página no encontrada"
        description="La dirección no existe o cambió."
        action={<LinkButton to="/">Volver al inicio</LinkButton>}
      />
    </main>
  )
}

/** Para rutas válidas cuyo recurso (solicitud, profesional…) no existe */
export function MissingResource({ what, backTo, backLabel }: { what: string; backTo: string; backLabel: string }) {
  return (
    <EmptyState
      icon={SearchX}
      title={`No encontramos ${what}`}
      description="Puede que se haya reiniciado la demo."
      action={<LinkButton to={backTo}>{backLabel}</LinkButton>}
    />
  )
}
