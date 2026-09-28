import { ScreenPlaceholder, type FlowLink } from '@/components/ScreenPlaceholder'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { STATUS_META } from '@/lib/status'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { useClientRequest } from './useClientRequest'

export function SeguimientoPage() {
  const request = useClientRequest()
  const hasReview = useDemoStore((s) => s.reviews.some((rv) => rv.requestId === request?.id))

  if (!request) return <MissingResource what="esa solicitud" backTo="/cliente/solicitudes" backLabel="Mis solicitudes" />

  const base = `/cliente/solicitudes/${request.id}`
  const next: FlowLink[] = []
  if (request.status === 'terminada') next.push({ to: `${base}/confirmar`, label: 'Confirmar trabajo' })
  if (request.status === 'confirmada' && !hasReview) next.push({ to: `${base}/calificar`, label: 'Calificar profesional' })
  if (request.status === 'confirmada' && hasReview) next.push({ to: `${base}/pago`, label: 'Ir al pago' })

  return (
    <ScreenPlaceholder
      title={request.title}
      description={`${request.code} · ${STATUS_META[request.status].hint}`}
      planned={[
        'Línea de tiempo: pendiente → aceptada → en proceso → terminada → confirmada → pagada',
        'Datos del profesional y del servicio (fecha, horario, dirección)',
        'Acción disponible según el estado (cancelar, confirmar, calificar, pagar)',
      ]}
      links={[...next, { to: '/cliente/solicitudes', label: 'Mis solicitudes' }]}
    >
      <p className="flex items-center gap-2 text-sm">
        Estado actual: <StatusBadge status={request.status} />
      </p>
    </ScreenPlaceholder>
  )
}
