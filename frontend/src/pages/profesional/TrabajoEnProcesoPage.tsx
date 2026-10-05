import { CheckCircle2, Hourglass, MapPin, Navigation, Play } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { RequestTimeline } from '@/components/RequestTimeline'
import { TripTracker } from '@/components/TripTracker'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { controlClasses, Field } from '@/components/ui/Field'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn } from '@/lib/cn'
import { formatGs } from '@/lib/format'
import { START_CODE_LENGTH } from '@/lib/startCode'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { useCurrentProfessional, useDirectory } from '@/store/selectors'
import { toast } from '@/store/toast'
import { JobDetails } from './JobDetails'
import { ReasonPicker } from './ReasonPicker'
import { useProRequest } from './useProRequests'

const WITHDRAW_REASONS = ['Tuve un imprevisto', 'Ya no tengo disponibilidad en esa fecha', 'El trabajo es distinto a lo que se pidió', 'Otro motivo']

export function TrabajoEnProcesoPage() {
  const request = useProRequest()
  // Al redirigir se conserva el origen del link (useBackHere), para que "Volver" siga llevando ahí
  const location = useLocation()
  const transition = useDemoStore((s) => s.transition)
  const startJob = useDemoStore((s) => s.startJob)
  const startTrip = useDemoStore((s) => s.startTrip)
  const arrive = useDemoStore((s) => s.arrive)
  const professional = useCurrentProfessional()
  const dir = useDirectory()
  const commissionRate = useDemoStore((s) => s.settings.commissionRate)
  const payment = useDemoStore((s) => s.payments.find((p) => p.requestId === request?.id))
  const [confirmFinish, setConfirmFinish] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [reason, setReason] = useState(WITHDRAW_REASONS[0])
  const navigate = useNavigate()

  if (!request) return <MissingResource what="ese trabajo" backTo="/profesional/trabajos" backLabel="Mis trabajos" />
  // Pendiente o rechazada (también si se echó atrás después de aceptar) se ven en el detalle de la solicitud
  if (request.status === 'pendiente' || request.status === 'rechazada') return <Navigate to={`/profesional/solicitudes/${request.id}`} state={location.state} replace />

  const closeStart = () => {
    setStartOpen(false)
    setCode('')
    setCodeError('')
  }

  const start = () => {
    if (!startJob(request.id, code)) {
      setCodeError('Código incorrecto. Pedile al cliente que lo revise en su seguimiento.')
      return
    }
    closeStart()
    toast('Trabajo iniciado. El cliente puede seguir el avance.')
  }

  const withdraw = () => {
    transition(request.id, 'rechazada', 'profesional', reason)
    setWithdrawOpen(false)
    toast('Dejaste el trabajo. El cliente ya fue notificado.', 'info')
    navigate('/profesional/trabajos')
  }

  const leave = () => {
    if (startTrip(request.id)) toast('Saliste hacia el domicilio. El cliente ya te ve en el mapa.')
  }

  const withdrawButton = (
    <Button variant="outline" className="mt-3 w-full text-destructive" onClick={() => setWithdrawOpen(true)}>
      No puedo hacer este trabajo
    </Button>
  )

  const startButton = (
    <Button size="lg" className="mt-5 w-full" onClick={() => setStartOpen(true)}>
      <Play className="size-5" aria-hidden="true" />
      Iniciar trabajo
    </Button>
  )

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
            <h2 className="font-semibold">{request.urgent ? 'Pedido urgente' : 'Trabajo agendado'}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {request.urgent
                ? 'El cliente lo necesita ya: salí ahora hacia el domicilio.'
                : 'Avisá cuando salgas: el cliente va a ver en el mapa cuánto te falta para llegar.'}
            </p>
            <Button size="lg" className="mt-5 w-full" onClick={leave}>
              <Navigation className="size-5" aria-hidden="true" />
              {request.urgent ? 'Salir ahora' : 'Salir hacia el domicilio'}
            </Button>
            {!request.urgent && (
              <Button variant="outline" className="mt-3 w-full" onClick={() => setStartOpen(true)}>
                <Play className="size-4" aria-hidden="true" />
                Ya estoy ahí: iniciar trabajo
              </Button>
            )}
            {withdrawButton}
          </>
        )
      case 'en_camino':
        return (
          <>
            <h2 className="font-semibold">{request.trip?.arrivedAt ? 'Ya llegaste' : '¿Llegaste?'}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pedile al cliente su código de inicio para empezar el trabajo.</p>
            {startButton}
            {!request.trip?.arrivedAt && (
              <Button variant="outline" className="mt-3 w-full" onClick={() => arrive(request.id)}>
                <MapPin className="size-4" aria-hidden="true" />
                Avisar que llegué
              </Button>
            )}
            {withdrawButton}
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
          {request.status === 'en_camino' && request.trip && professional && (
            <TripTracker request={request} trip={request.trip} professional={professional} viewer="profesional" clientName={dir.user(request.clientId)?.name.split(' ')[0]} />
          )}
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
        open={startOpen}
        onClose={closeStart}
        title="Iniciar trabajo"
        description="Pedile al cliente el código de inicio que ve en su seguimiento."
        footer={
          <>
            <Button variant="ghost" onClick={closeStart}>
              Cancelar
            </Button>
            <Button type="submit" form="start-job-form" disabled={code.length !== START_CODE_LENGTH}>
              Iniciar
            </Button>
          </>
        }
      >
        <form
          id="start-job-form"
          onSubmit={(e) => {
            e.preventDefault()
            start()
          }}
        >
          <Field label="Código de inicio" error={codeError}>
            {(props) => (
              <input
                {...props}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, START_CODE_LENGTH))
                  setCodeError('')
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={START_CODE_LENGTH}
                className={cn(controlClasses, 'h-14 text-center font-heading text-2xl tracking-[0.5em] tabular-nums')}
              />
            )}
          </Field>
        </form>
      </Dialog>

      <Dialog
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        title="¿Dejar este trabajo?"
        description="El cliente va a ver el motivo y podrá pedírselo a otro profesional. Esta acción no se puede deshacer."
        footer={
          <>
            <Button variant="ghost" onClick={() => setWithdrawOpen(false)}>
              Volver
            </Button>
            <Button variant="destructive" onClick={withdraw}>
              Dejar el trabajo
            </Button>
          </>
        }
      >
        <ReasonPicker reasons={WITHDRAW_REASONS} value={reason} onChange={setReason} />
      </Dialog>

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
