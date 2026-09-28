import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MissingResource } from '@/pages/NotFoundPage'
import { useProRequest } from './useProRequests'

export function DetalleTrabajoPage() {
  const request = useProRequest()
  if (!request) return <MissingResource what="esa solicitud" backTo="/profesional/solicitudes" backLabel="Solicitudes" />

  return (
    <ScreenPlaceholder
      title={request.title}
      description={`${request.code} · ${request.city}`}
      planned={[
        'Descripción del problema, dirección, fecha y franja horaria',
        'Datos de contacto del cliente',
        'Acciones: aceptar (→ Aceptada) o rechazar con motivo (→ Rechazada)',
      ]}
      links={[
        { to: `/profesional/trabajos/${request.id}`, label: 'Ver como trabajo en proceso' },
        { to: '/profesional/solicitudes', label: 'Volver a solicitudes' },
      ]}
    >
      <p className="flex items-center gap-2 text-sm">
        Estado actual: <StatusBadge status={request.status} />
      </p>
    </ScreenPlaceholder>
  )
}
