import { CalendarDays, Clock, Lock, MapPin, Phone } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { formatRange } from '@/lib/estimates'
import { formatDate, formatGs, TIME_SLOT_LABELS } from '@/lib/format'
import { useDirectory } from '@/store/selectors'
import type { ServiceRequest } from '@/types'

/** Datos del trabajo y del cliente. El contacto se revela recién al aceptar. */
export function JobDetails({ request, commissionRate }: { request: ServiceRequest; commissionRate: number }) {
  const dir = useDirectory()
  const client = dir.user(request.clientId)
  const revealed = request.status !== 'pendiente' && request.status !== 'rechazada'
  const fee = Math.round(request.price * commissionRate)

  return (
    <>
      <Card>
        <h2 className="text-lg font-semibold">Pedido del cliente</h2>
        <p className="mt-2 text-muted-foreground">{request.description}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { icon: CalendarDays, label: 'Fecha', value: formatDate(request.date) },
            { icon: Clock, label: 'Horario', value: TIME_SLOT_LABELS[request.timeSlot] },
            { icon: MapPin, label: 'Dirección', value: revealed ? `${request.address}, ${request.city}` : `${request.city} (dirección exacta al aceptar)` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div>
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd>{value}</dd>
              </div>
            </div>
          ))}
        </dl>
        {request.estimate && (
          <p className="mt-4 rounded-lg bg-accent-soft p-3 text-sm">
            Al pedir, el cliente vio un presupuesto estimado de <span className="font-semibold tabular-nums">{formatRange(request.estimate)}</span>.
          </p>
        )}
      </Card>

      <Card>
        <p className="text-sm text-muted-foreground">Cliente</p>
        <div className="mt-2 flex items-center gap-3">
          {client && <Avatar name={client.name} />}
          <div>
            <p className="font-semibold">{client?.name}</p>
            {revealed ? (
              <a href={`tel:${client?.phone.replaceAll(' ', '')}`} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                <Phone className="size-4" aria-hidden="true" />
                {client?.phone}
              </a>
            ) : (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Lock className="size-4" aria-hidden="true" />
                Contacto visible al aceptar
              </p>
            )}
          </div>
        </div>
        <dl className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Monto del trabajo</dt>
            <dd className="tabular-nums">{formatGs(request.price)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Comisión Domus ({Math.round(commissionRate * 100)}%)</dt>
            <dd className="tabular-nums">−{formatGs(fee)}</dd>
          </div>
          <div className="flex justify-between pt-1 font-semibold">
            <dt>Recibís</dt>
            <dd className="font-heading text-lg tabular-nums">{formatGs(request.price - fee)}</dd>
          </div>
        </dl>
      </Card>
    </>
  )
}
