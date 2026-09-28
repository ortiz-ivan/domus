import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MissingResource } from '@/pages/NotFoundPage'
import { useProRequest } from './useProRequests'

export function TrabajoEnProcesoPage() {
  const request = useProRequest()
  if (!request) return <MissingResource what="ese trabajo" backTo="/profesional/trabajos" backLabel="Trabajos en proceso" />

  return (
    <ScreenPlaceholder
      title={request.title}
      description={`${request.code} · ${request.address}, ${request.city}`}
      planned={[
        'Línea de tiempo del trabajo',
        'Acción según estado: "Iniciar trabajo" (→ En proceso) o "Marcar como terminado" (→ Terminada)',
        'Monto acordado y datos del cliente',
      ]}
      links={[{ to: '/profesional/trabajos', label: 'Volver a trabajos' }]}
    >
      <p className="flex items-center gap-2 text-sm">
        Estado actual: <StatusBadge status={request.status} />
      </p>
    </ScreenPlaceholder>
  )
}
