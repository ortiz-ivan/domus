import { Check, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/lib/format'
import { FLOW_STEPS, STATUS_META } from '@/lib/status'
import type { ServiceRequest } from '@/types'

const STEP_LABELS: Record<string, string> = {
  pendiente: 'Solicitud enviada',
  aceptada: 'Aceptada por el profesional',
  en_camino: 'En camino a tu domicilio',
  en_proceso: 'Trabajo en proceso',
  terminada: 'Trabajo terminado',
  confirmada: 'Confirmado por el cliente',
  pagada: 'Pagado',
}

/** Línea de tiempo vertical del camino feliz, o el estado final si se rechazó / canceló */
export function RequestTimeline({ request }: { request: ServiceRequest }) {
  const reached = new Map(request.history.map((h) => [h.status, h]))
  const stopped = request.status === 'rechazada' || request.status === 'cancelada'
  // Si se frenó (por ejemplo, cancelada después de aceptar), se muestran los pasos que llegaron a ocurrir y el corte
  // "En camino" es opcional: si el profesional inició directo, ese paso no se muestra
  const skippedTrip = !reached.has('en_camino') && request.status !== 'pendiente' && request.status !== 'aceptada'
  const flow = skippedTrip ? FLOW_STEPS.filter((s) => s !== 'en_camino') : FLOW_STEPS
  const steps = stopped ? [...flow.filter((s) => reached.has(s)), request.status] : flow
  // Pagada es el final del camino: todos los pasos se muestran completos
  const currentIndex = request.status === 'pagada' ? -1 : flow.indexOf(request.status)

  return (
    <ol className="relative">
      {steps.map((status, i) => {
        const entry = reached.get(status)
        const done = Boolean(entry)
        const isCurrent = stopped ? i === steps.length - 1 : i === currentIndex
        const isLast = i === steps.length - 1
        const isStop = status === 'rechazada' || status === 'cancelada'

        return (
          <li key={status} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={cn('absolute top-7 left-3.5 h-[calc(100%-1.75rem)] w-0.5 -translate-x-1/2', done && !isCurrent ? 'bg-status-done' : 'bg-border')}
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                'relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2',
                isStop
                  ? 'border-status-rejected bg-status-rejected text-white'
                  : done && !isCurrent
                    ? 'border-status-done bg-status-done text-white'
                    : isCurrent
                      ? 'border-primary bg-card'
                      : 'border-border bg-card',
              )}
              aria-hidden="true"
            >
              {isStop ? <X className="size-4" strokeWidth={3} /> : done && !isCurrent ? <Check className="size-4" strokeWidth={3} /> : null}
              {isCurrent && !isStop && <span className="size-2.5 rounded-full bg-primary" />}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={cn('font-medium', !done && 'text-muted-foreground')}>
                {isStop ? STATUS_META[status].label : STEP_LABELS[status]}
                <span className="sr-only">{done ? (isCurrent ? ' (estado actual)' : ' (completado)') : ' (pendiente)'}</span>
              </p>
              {entry && <p className="text-sm text-muted-foreground">{formatDateTime(entry.at)}</p>}
              {entry?.note && <p className="mt-1 text-sm text-muted-foreground">Motivo: {entry.note}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
