import { CalendarDays, ChevronRight, MapPin, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { CategoryIcon } from '@/components/CategoryIcon'
import { useBackHere } from '@/app/useBackHere'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatGs, scheduleLabel } from '@/lib/format'
import type { Category, ServiceRequest } from '@/types'

interface RequestCardProps {
  request: ServiceRequest
  category?: Category
  /** Nombre de la otra parte: el profesional (vista cliente) o el cliente (vista profesional) */
  counterpart?: string
  to: string
  /** Llamado a la acción destacado, p. ej. "Confirmá el trabajo" */
  highlight?: string
  children?: ReactNode
}

export function RequestCard({ request, category, counterpart, to, highlight, children }: RequestCardProps) {
  const backHere = useBackHere()
  return (
    <article className="rounded-xl border border-border bg-card transition-colors duration-150 hover:border-accent">
      <Link to={to} state={backHere} className="flex gap-4 p-4 sm:p-5">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-soft">
          <CategoryIcon name={category?.icon ?? ''} className="size-5 text-accent-text" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <h3 className="font-semibold [overflow-wrap:anywhere]">{request.title}</h3>
            <span className="flex flex-wrap gap-1.5">
              {request.urgent && (request.status === 'pendiente' || request.status === 'aceptada' || request.status === 'en_camino') && (
                <Badge tone="rejected">
                  <Zap className="size-3.5" aria-hidden="true" />
                  Urgente
                </Badge>
              )}
              <StatusBadge status={request.status} />
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {request.code}
            {counterpart && <> · {counterpart}</>}
          </p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {scheduleLabel(request)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {request.city}
            </span>
            <span className="font-medium text-foreground tabular-nums">{formatGs(request.price)}</span>
          </p>
          {highlight && <p className="mt-2 text-sm font-semibold text-accent-text">{highlight}</p>}
        </div>
        <ChevronRight className="size-5 shrink-0 self-center text-muted-foreground" aria-hidden="true" />
      </Link>
      {children && <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3 sm:px-5">{children}</div>}
    </article>
  )
}
