import type { ServiceRequest } from '@/types'

export interface ClientAction {
  /** Qué falta, como frase ("Confirmá que el trabajo quedó bien") */
  label: string
  /** Texto corto del botón ("Confirmar trabajo") */
  cta: string
  to: string
}

/** Qué tiene que hacer el cliente con la solicitud, y a dónde lo lleva */
export function clientNextAction(request: ServiceRequest, hasReview: boolean): ClientAction | null {
  const base = `/cliente/solicitudes/${request.id}`
  if (request.status === 'terminada') return { label: 'Confirmá que el trabajo quedó bien', cta: 'Confirmar trabajo', to: `${base}/confirmar` }
  if (request.status === 'confirmada' && !hasReview) return { label: 'Calificá al profesional', cta: 'Calificar', to: `${base}/calificar` }
  if (request.status === 'confirmada') return { label: 'Completá el pago', cta: 'Pagar', to: `${base}/pago` }
  return null
}

/** Cuándo cambió de estado por última vez: lo que espera hace más tiempo va primero */
export const lastChangeAt = (request: ServiceRequest) => request.history.at(-1)?.at ?? request.createdAt
