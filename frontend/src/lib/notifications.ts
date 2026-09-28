import type { DemoData } from '@/data/seed'
import { formatGs } from '@/lib/format'
import { TRANSITIONS } from '@/lib/status'
import type { Role, ServiceRequest } from '@/types'

export interface Viewer {
  role: Role
  userId: string
}

export interface Notice {
  message: string
  action?: { label: string; to: string }
}

type Snapshot = Pick<DemoData, 'requests' | 'users' | 'professionals' | 'payments'>

/**
 * Qué avisarle a quien está mirando, comparando el estado anterior con el nuevo.
 * El autor de cada cambio se deduce de la tabla de transiciones: nunca se avisa
 * a alguien de lo que hizo él mismo. Los cambios "hacia atrás" (p. ej. al
 * reiniciar la demo) no son transiciones válidas y se ignoran.
 */
export function diffNotifications(prev: Snapshot, next: Snapshot, viewer: Viewer): Notice[] {
  if (prev.requests === next.requests) return []

  const before = new Map(prev.requests.map((r) => [r.id, r]))
  const ownProId = next.professionals.find((p) => p.userId === viewer.userId)?.id
  const clientName = (r: ServiceRequest) => next.users.find((u) => u.id === r.clientId)?.name.split(' ')[0] ?? 'El cliente'
  const proName = (r: ServiceRequest) => next.professionals.find((p) => p.id === r.professionalId)?.name.split(' ')[0] ?? 'El profesional'
  const notices: Notice[] = []

  for (const r of next.requests) {
    const old = before.get(r.id)
    const isMine = viewer.role === 'cliente' ? r.clientId === viewer.userId : viewer.role === 'profesional' ? r.professionalId === ownProId : true

    // Solicitud nueva: siempre la crea el cliente
    if (!old) {
      if (viewer.role === 'cliente' || !isMine || r.status !== 'pendiente') continue
      notices.push(
        viewer.role === 'profesional'
          ? { message: `Nueva solicitud de ${clientName(r)}: ${r.title}`, action: { label: 'Ver', to: `/profesional/solicitudes/${r.id}` } }
          : { message: `Nueva solicitud ${r.code}: ${r.title}`, action: { label: 'Ver', to: '/admin/solicitudes' } },
      )
      continue
    }

    if (old.status === r.status || !isMine) continue
    const actor = TRANSITIONS[old.status][r.status]
    if (!actor || actor === viewer.role) continue

    const title = `“${r.title}”`
    const base = `/cliente/solicitudes/${r.id}`
    const net = () => {
      const payment = next.payments.find((p) => p.requestId === r.id)
      return payment ? ` (${formatGs(payment.amount - payment.fee)} neto)` : ''
    }

    if (viewer.role === 'cliente') {
      const byStatus: Partial<Record<ServiceRequest['status'], Notice>> = {
        aceptada: { message: `${proName(r)} aceptó tu solicitud ${title}`, action: { label: 'Ver', to: base } },
        rechazada: { message: `${proName(r)} no puede tomar ${title}`, action: { label: 'Buscar otro', to: `/cliente/categorias/${r.categoryId}` } },
        en_proceso: { message: `${proName(r)} empezó a trabajar en ${title}`, action: { label: 'Seguir', to: base } },
        terminada: { message: `${proName(r)} terminó ${title}. Confirmá que quedó bien`, action: { label: 'Confirmar', to: `${base}/confirmar` } },
      }
      if (byStatus[r.status]) notices.push(byStatus[r.status]!)
    } else if (viewer.role === 'profesional') {
      const to = `/profesional/trabajos/${r.id}`
      const byStatus: Partial<Record<ServiceRequest['status'], Notice>> = {
        cancelada: { message: `${clientName(r)} canceló ${title}` },
        confirmada: { message: `${clientName(r)} confirmó que ${title} quedó bien`, action: { label: 'Ver', to } },
        pagada: { message: `Recibiste el pago de ${title}${net()}`, action: { label: 'Ganancias', to: '/profesional/ganancias' } },
      }
      if (byStatus[r.status]) notices.push(byStatus[r.status]!)
    } else if (r.status === 'pagada') {
      // Al admin solo le interesan los pagos: el resto sería ruido
      const payment = next.payments.find((p) => p.requestId === r.id)
      notices.push({ message: `Pago recibido: ${r.code}${payment ? ` · ${formatGs(payment.amount)}` : ''}`, action: { label: 'Finanzas', to: '/admin/finanzas' } })
    }
  }
  return notices
}
