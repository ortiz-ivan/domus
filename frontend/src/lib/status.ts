import type { RequestStatus, Role } from '@/types'

export type StatusTone = 'pending' | 'accepted' | 'progress' | 'done' | 'rejected'

interface StatusMeta {
  label: string
  tone: StatusTone
  /** Texto de ayuda para el seguimiento del cliente */
  hint: string
}

export const STATUS_META: Record<RequestStatus, StatusMeta> = {
  pendiente: { label: 'Pendiente', tone: 'pending', hint: 'Esperando que el profesional acepte la solicitud.' },
  rechazada: { label: 'Rechazada', tone: 'rejected', hint: 'El profesional no puede tomar este trabajo.' },
  aceptada: { label: 'Aceptada', tone: 'accepted', hint: 'El profesional aceptó y asistirá en la fecha acordada.' },
  en_camino: { label: 'En camino', tone: 'progress', hint: 'El profesional va hacia tu domicilio.' },
  en_proceso: { label: 'En proceso', tone: 'progress', hint: 'El profesional está trabajando en tu hogar.' },
  terminada: { label: 'Terminada', tone: 'done', hint: 'El profesional terminó. Confirmá que todo quedó bien.' },
  confirmada: { label: 'Confirmada', tone: 'done', hint: 'Confirmaste el trabajo. Falta calificar y pagar.' },
  pagada: { label: 'Pagada', tone: 'done', hint: 'Servicio completado y pagado.' },
  cancelada: { label: 'Cancelada', tone: 'rejected', hint: 'La solicitud fue cancelada.' },
}

/** Pasos del camino feliz, en orden, para la línea de tiempo del seguimiento */
export const FLOW_STEPS: RequestStatus[] = ['pendiente', 'aceptada', 'en_camino', 'en_proceso', 'terminada', 'confirmada', 'pagada']

/** Qué rol puede mover una solicitud de un estado a otro */
export const TRANSITIONS: Record<RequestStatus, Partial<Record<RequestStatus, Role>>> = {
  pendiente: { aceptada: 'profesional', rechazada: 'profesional', cancelada: 'cliente' },
  // Hasta que empieza el trabajo, el profesional todavía puede echarse atrás (queda rechazada, con motivo)
  // y el cliente cancelar. "En camino" es opcional: si ya está en el domicilio, inicia directo con el código.
  aceptada: { en_camino: 'profesional', en_proceso: 'profesional', rechazada: 'profesional', cancelada: 'cliente' },
  en_camino: { en_proceso: 'profesional', rechazada: 'profesional', cancelada: 'cliente' },
  en_proceso: { terminada: 'profesional' },
  terminada: { confirmada: 'cliente' },
  confirmada: { pagada: 'cliente' },
  pagada: {},
  rechazada: {},
  cancelada: {},
}

export function canTransition(from: RequestStatus, to: RequestStatus, role: Role): boolean {
  return TRANSITIONS[from][to] === role
}

/** Solicitudes que todavía requieren atención de alguien */
export const ACTIVE_STATUSES: RequestStatus[] = ['pendiente', 'aceptada', 'en_camino', 'en_proceso', 'terminada', 'confirmada']
