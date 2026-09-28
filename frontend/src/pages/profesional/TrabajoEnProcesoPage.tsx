import { CheckCircle2, Hourglass, Play } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router'
import { RequestTimeline } from '@/components/RequestTimeline'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatGs } from '@/lib/format'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { toast } from '@/store/toast'
import { JobDetails } from './JobDetails'
import { useProRequest } from './useProRequests'

export function TrabajoEnProcesoPage() {
  const request = useProRequest()
  const transition = useDemoStore((s) => s.transition)
  const commissionRate = useDemoStore((s) => s.settings.commissionRate)
  const payment = useDemoStore((s) => s.payments.find((p) => p.requestId === request?.id))
  const [confirmFinish, setConfirmFinish] = useState(false)

  if (!request) return <MissingResource what="ese trabajo" backTo="/profesional/trabajos" backLabel="Mis trabajos" />
  if (request.status === 'pendiente') return <Navigate to={`/profesional/solicitudes/${request.id}`} replace />

  const start = () => {
    transition(request.id, 'en_proceso', 'profesional')
    toast('Trabajo iniciado. El cliente puede seguir el avance.')
  }

  const finish = () => {
    transition(request.id, 'terminada', 'profesional')
    setConfirmFinish(false)
    toast('Marcaste el trabajo como terminado. Falta la confirmación del cliente.')
  }

  const actionCard = (() => {
    switch (request.status) {
      case 'aceptada':
        return (
          <>
            <h2 className="font-semibold">Trabajo agendado</h2>
            <p className="mt-1 text-sm text-muted-foreground">Cuando llegues al domicilio, iniciá el trabajo para que el cliente vea el avance.</p>
            <Button size="lg" className="mt-5 w-full" onClick={start}>
              <Play className="size-5" aria-hidden="true" />
              Iniciar trabajo
            </Button>
          </>
        )
      case 'en_proceso':
        return (
          <>
            <h2 className="font-semibold">Trabajando</h2>
            <p className="mt-1 text-sm text-muted-foreground">Al terminar, avisale al cliente para que confirme y pague.</p>
            <Button size="lg" className="mt-5 w-full" onClick={() => setConfirmFinish(true)}>
              <CheckCircle2 className="size-5" aria-hidden="true" />
              Marcar como terminado
            </Button>
          </>
        )
      case 'terminada':
      case 'confirmada':
        return (
          <div className="flex gap-3">
            <Hourglass className="mt-0.5 size-5 shrink-0 text-status-pending" aria-hidden="true" />
            <div>
              <h2 className="font-semibold">{request.status === 'terminada' ? 'Esperando confirmación' : 'Esperando el pago'}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {request.status === 'terminada'
                  ? 'El cliente tiene que confirmar que el trabajo quedó bien.'
                  : 'El cliente confirmó el trabajo y está por completar el pago.'}
              </p>
            </div>
          </div>
        )
      case 'pagada':
        return (
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-status-done" aria-hidden="true" />
            <div>
              <h2 className="font-semibold">Cobrado</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Recibiste {formatGs((payment?.amount ?? request.price) - (payment?.fee ?? 0))} neto por este trabajo.
              </p>
            </div>
          </div>
        )
      default:
        return <h2 className="font-semibold">Solicitud {request.status}</h2>
    }
  })()

  return (
    <>
      <BackLink to="/profesional/trabajos" label="Mis trabajos" />
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">{request.title}</h1>
          <StatusBadge status={request.status} />
        </div>
        <p className="mt-1 text-muted-foreground">{request.code}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="space-y-6">
          <Card aria-live="polite">{actionCard}</Card>
          <Card>
            <h2 className="mb-5 text-lg font-semibold">Avance</h2>
            <RequestTimeline request={request} />
          </Card>
        </div>
        <div className="space-y-6 lg:sticky lg:top-8">
          <JobDetails request={request} commissionRate={commissionRate} />
        </div>
      </div>

      <Dialog
        open={confirmFinish}
        onClose={() => setConfirmFinish(false)}
        title="¿Terminaste el trabajo?"
        description="Le vamos a pedir al cliente que confirme que quedó bien."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmFinish(false)}>
              Todavía no
            </Button>
            <Button onClick={finish}>Sí, terminé</Button>
          </>
        }
      />
    </>
  )
}
