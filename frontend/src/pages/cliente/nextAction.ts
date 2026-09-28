import type { ServiceRequest } from '@/types'

/** Qué tiene que hacer el cliente con la solicitud, y a dónde lo lleva */
export function clientNextAction(request: ServiceRequest, hasReview: boolean): { label: string; to: string } | null {
  const base = `/cliente/solicitudes/${request.id}`
  if (request.status === 'terminada') return { label: 'Confirmá que el trabajo quedó bien', to: `${base}/confirmar` }
  if (request.status === 'confirmada' && !hasReview) return { label: 'Calificá al profesional', to: `${base}/calificar` }
  if (request.status === 'confirmada') return { label: 'Completá el pago', to: `${base}/pago` }
  return null
}
