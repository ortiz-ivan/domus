import { CalendarDays, Clock, MapPin, Receipt } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { RequestTimeline } from '@/components/RequestTimeline'
import { Avatar } from '@/components/ui/Avatar'
import { useBackHere } from '@/app/useBackHere'
import { BackLink } from '@/components/ui/BackLink'
import { Button, LinkButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { RatingStars } from '@/components/ui/RatingStars'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate, formatGs, TIME_SLOT_LABELS } from '@/lib/format'
import { canTransition, STATUS_META } from '@/lib/status'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { ratingOf, useDirectory } from '@/store/selectors'
import { toast } from '@/store/toast'
import { clientNextAction } from './nextAction'
import { useClientRequest } from './useClientRequest'

export function SeguimientoPage() {
  const request = useClientRequest()
  const reviews = useDemoStore((s) => s.reviews)
  const transition = useDemoStore((s) => s.transition)
  const dir = useDirectory()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const backHere = useBackHere()

  if (!request) return <MissingResource what="esa solicitud" backTo="/cliente/solicitudes" backLabel="Mis solicitudes" />

  const professional = dir.professional(request.professionalId)
  const action = clientNextAction(request, reviews.some((rv) => rv.requestId === request.id))
  const canCancel = canTransition(request.status, 'cancelada', 'cliente')

  const cancel = () => {
    transition(request.id, 'cancelada', 'cliente')
    setConfirmCancel(false)
    toast('Solicitud cancelada', 'info')
  }

  return (
    <>
      <BackLink to="/cliente/solicitudes" label="Mis solicitudes" />
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">{request.title}</h1>
          <StatusBadge status={request.status} />
        </div>
        <p className="mt-1 text-muted-foreground">
          {request.code} · {STATUS_META[request.status].hint}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="space-y-6">
          {(action || request.status === 'pagada' || request.status === 'rechazada') && (
            <Card className="border-accent bg-accent-soft">
              {action && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold">{action.label}</p>
                  <LinkButton to={action.to}>{action.cta}</LinkButton>
                </div>
              )}
              {request.status === 'pagada' && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold">Servicio completado y pagado. ¡Gracias por usar Domus!</p>
                  <LinkButton to={`/cliente/solicitudes/${request.id}/pago`} variant="outline">
                    <Receipt className="size-4" aria-hidden="true" />
                    Ver comprobante
                  </LinkButton>
                </div>
              )}
              {request.status === 'rechazada' && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold">El profesional no puede tomar este trabajo. Podés pedírselo a otro.</p>
                  <LinkButton to={`/cliente/categorias/${request.categoryId}`}>Buscar otro profesional</LinkButton>
                </div>
              )}
            </Card>
          )}

          <Card>
            <h2 className="mb-5 text-lg font-semibold">Seguimiento</h2>
            <RequestTimeline request={request} />
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Detalle del pedido</h2>
            <p className="mt-2 text-muted-foreground">{request.description}</p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { icon: CalendarDays, label: 'Fecha', value: formatDate(request.date) },
                { icon: Clock, label: 'Horario', value: TIME_SLOT_LABELS[request.timeSlot] },
                { icon: MapPin, label: 'Dirección', value: `${request.address}, ${request.city}` },
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
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-8">
          {professional && (
            <Card>
              <p className="text-sm text-muted-foreground">Profesional</p>
              <Link to={`/cliente/profesionales/${professional.id}`} state={backHere} className="mt-2 flex items-center gap-3 rounded-lg hover:underline">
                <Avatar name={professional.name} />
                <span>
                  <span className="block font-semibold">{professional.name}</span>
                  <RatingStars value={ratingOf(reviews, professional).average} count={ratingOf(reviews, professional).count} />
                </span>
              </Link>
            </Card>
          )}
          <Card>
            <p className="text-sm text-muted-foreground">Monto acordado</p>
            <p className="font-heading text-2xl font-bold tabular-nums">{formatGs(request.price)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {request.status === 'pagada' ? 'Pagado.' : 'Se paga al final, cuando confirmás el trabajo.'}
            </p>
          </Card>
          {canCancel && (
            <Button variant="outline" className="w-full text-destructive" onClick={() => setConfirmCancel(true)}>
              Cancelar solicitud
            </Button>
          )}
        </div>
      </div>

      <Dialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="¿Cancelar la solicitud?"
        description={`Se le avisará a ${professional?.name ?? 'el profesional'}. Esta acción no se puede deshacer.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmCancel(false)}>
              Volver
            </Button>
            <Button variant="destructive" onClick={cancel}>
              Sí, cancelar
            </Button>
          </>
        }
      />
    </>
  )
}
