import type { DemoData } from '@/data/seed'
import { formatGs } from '@/lib/format'
import { TRANSITIONS } from '@/lib/status'
import type { RequestStatus, Role, ServiceRequest } from '@/types'

export interface Viewer {
  role: Role
  userId: string
}

export interface Notice {
  message: string
  action?: { label: string; to: string }
}

type Snapshot = Pick<DemoData, 'requests' | 'users' | 'professionals' | 'payments'>

/** Un aviso del historial, con cuándo pasó */
export interface FeedItem extends Notice {
  id: string
  at: string
}

/**
 * Qué avisarle a quien está mirando cuando `r` pasa de `from` a `to` (`from` null: recién creada).
 * El autor de cada cambio se deduce de la tabla de transiciones: nunca se avisa
 * a alguien de lo que hizo él mismo. Los cambios "hacia atrás" (p. ej. al
 * reiniciar la demo) no son transiciones válidas y se ignoran.
 */
function noticeFor(r: ServiceRequest, from: RequestStatus | null, to: RequestStatus, data: Snapshot, viewer: Viewer): Notice | null {
  const ownProId = data.professionals.find((p) => p.userId === viewer.userId)?.id
  const isMine = viewer.role === 'cliente' ? r.clientId === viewer.userId : viewer.role === 'profesional' ? r.professionalId === ownProId : true
  if (!isMine) return null
  const clientName = () => data.users.find((u) => u.id === r.clientId)?.name.split(' ')[0] ?? 'El cliente'
  const proName = () => data.professionals.find((p) => p.id === r.professionalId)?.name.split(' ')[0] ?? 'El profesional'

  // Solicitud nueva: siempre la crea el cliente
  if (from === null) {
    if (viewer.role === 'cliente' || to !== 'pendiente') return null
    return viewer.role === 'profesional'
      ? { message: `Nueva solicitud${r.urgent ? ' urgente' : ''} de ${clientName()}: ${r.title}`, action: { label: 'Ver', to: `/profesional/solicitudes/${r.id}` } }
      : { message: `Nueva solicitud ${r.code}: ${r.title}`, action: { label: 'Ver', to: '/admin/solicitudes' } }
  }

  const actor = TRANSITIONS[from][to]
  if (!actor || actor === viewer.role) return null

  const title = `“${r.title}”`
  const base = `/cliente/solicitudes/${r.id}`
  const payment = () => data.payments.find((p) => p.requestId === r.id)

  if (viewer.role === 'cliente') {
    const byStatus: Partial<Record<RequestStatus, Notice>> = {
      aceptada: { message: `${proName()} aceptó tu solicitud ${title}`, action: { label: 'Ver', to: base } },
      en_camino: {
        message: `${proName()} está en camino${r.trip ? ` · llega en ~${r.trip.etaMinutes} min` : ''}`,
        action: { label: 'Ver en el mapa', to: base },
      },
      rechazada: { message: `${proName()} no puede tomar ${title}`, action: { label: 'Buscar otro', to: `/cliente/categorias/${r.categoryId}` } },
      en_proceso: { message: `${proName()} empezó a trabajar en ${title}`, action: { label: 'Seguir', to: base } },
      terminada: { message: `${proName()} terminó ${title}. Confirmá que quedó bien`, action: { label: 'Confirmar', to: `${base}/confirmar` } },
    }
    return byStatus[to] ?? null
  }
  if (viewer.role === 'profesional') {
    const job = `/profesional/trabajos/${r.id}`
    const net = () => {
      const p = payment()
      return p ? ` (${formatGs(p.amount - p.fee)} neto)` : ''
    }
    const byStatus: Partial<Record<RequestStatus, Notice>> = {
      cancelada: { message: `${clientName()} canceló ${title}` },
      confirmada: { message: `${clientName()} confirmó que ${title} quedó bien`, action: { label: 'Ver', to: job } },
      pagada: { message: `Recibiste el pago de ${title}${net()}`, action: { label: 'Ganancias', to: '/profesional/ganancias' } },
    }
    return byStatus[to] ?? null
  }
  // Al admin solo le interesan los pagos: el resto sería ruido
  if (to !== 'pagada') return null
  const p = payment()
  return { message: `Pago recibido: ${r.code}${p ? ` · ${formatGs(p.amount)}` : ''}`, action: { label: 'Finanzas', to: '/admin/finanzas' } }
}

/** Al cliente: el profesional llegó (no es un cambio de estado, es el fin del viaje) */
function arrivalNotice(r: ServiceRequest, data: Snapshot, viewer: Viewer): Notice | null {
  if (viewer.role !== 'cliente' || r.clientId !== viewer.userId) return null
  const name = data.professionals.find((p) => p.id === r.professionalId)?.name.split(' ')[0] ?? 'El profesional'
  return { message: `${name} llegó a tu domicilio. Dale tu código de inicio`, action: { label: 'Ver código', to: `/cliente/solicitudes/${r.id}` } }
}

/** Qué avisarle a quien está mirando, comparando el estado anterior con el nuevo (los toasts en vivo) */
export function diffNotifications(prev: Snapshot, next: Snapshot, viewer: Viewer): Notice[] {
  if (prev.requests === next.requests) return []
  const before = new Map(prev.requests.map((r) => [r.id, r]))
  const notices: Notice[] = []
  for (const r of next.requests) {
    const old = before.get(r.id)
    if (r.trip?.arrivedAt && old?.trip && !old.trip.arrivedAt) {
      const notice = arrivalNotice(r, next, viewer)
      if (notice) notices.push(notice)
    }
    // Un aviso por cada paso nuevo del historial: si llegan dos juntos (aceptar un urgente
    // también lo pone en camino), se avisan los dos. Si el historial se acortó (reinicio), nada.
    for (let i = old ? old.history.length : 0; i < r.history.length; i++) {
      const notice = noticeFor(r, i === 0 ? null : r.history[i - 1].status, r.history[i].status, next, viewer)
      if (notice) notices.push(notice)
    }
  }
  return notices
}

/**
 * Historial de avisos, del más nuevo al más viejo. Sale del historial de cada solicitud,
 * así incluye lo que pasó con la pestaña cerrada y dice lo mismo que los toasts.
 */
export function notificationFeed(data: Snapshot, viewer: Viewer, limit = 30): FeedItem[] {
  const items: FeedItem[] = []
  for (const r of data.requests) {
    r.history.forEach((entry, i) => {
      const notice = noticeFor(r, i === 0 ? null : r.history[i - 1].status, entry.status, data, viewer)
      if (notice) items.push({ ...notice, id: `${r.id}:${i}`, at: entry.at })
    })
    const arrivedAt = r.trip?.arrivedAt
    const arrival = arrivedAt ? arrivalNotice(r, data, viewer) : null
    if (arrival && arrivedAt) items.push({ ...arrival, id: `${r.id}:llegada`, at: arrivedAt })
  }
  return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit)
}
