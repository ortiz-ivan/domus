import { Navigation, Zap } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDateTime } from '@/lib/format'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { toast } from '@/store/toast'
import { JobDetails } from './JobDetails'
import { ReasonPicker } from './ReasonPicker'
import { useProRequest } from './useProRequests'

const REJECT_REASONS = ['No tengo disponibilidad en esa fecha', 'Está fuera de mi zona de trabajo', 'No realizo ese tipo de trabajo', 'Otro motivo']

export function DetalleTrabajoPage() {
  const request = useProRequest()
  const transition = useDemoStore((s) => s.transition)
  const acceptRequest = useDemoStore((s) => s.accept)
  const commissionRate = useDemoStore((s) => s.settings.commissionRate)
  const navigate = useNavigate()
  // Al redirigir se conserva el origen del link (useBackHere), para que "Volver" siga llevando ahí
  const location = useLocation()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState(REJECT_REASONS[0])

  if (!request) return <MissingResource what="esa solicitud" backTo="/profesional/solicitudes" backLabel="Solicitudes" />
  // Una vez aceptada, el trabajo se gestiona desde "En proceso"
  if (request.status !== 'pendiente' && request.status !== 'rechazada') return <Navigate to={`/profesional/trabajos/${request.id}`} state={location.state} replace />

  const accept = () => {
    acceptRequest(request.id)
    toast(request.urgent ? 'Aceptaste y saliste hacia el domicilio. El cliente te ve en el mapa.' : 'Aceptaste el trabajo. El cliente ya fue notificado.')
    navigate(`/profesional/trabajos/${request.id}`)
  }

  const reject = () => {
    transition(request.id, 'rechazada', 'profesional', reason)
    setRejectOpen(false)
    toast('Solicitud rechazada', 'info')
    navigate('/profesional/solicitudes')
  }

  return (
    <>
      <BackLink to="/profesional/solicitudes" label="Solicitudes nuevas" />
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">{request.title}</h1>
          <StatusBadge status={request.status} />
        </div>
        <p className="mt-1 text-muted-foreground">
          {request.code} · Recibida el {formatDateTime(request.createdAt)}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="space-y-6">
          <JobDetails request={request} commissionRate={commissionRate} />
        </div>

        {request.status === 'pendiente' && (
          <Card className="lg:sticky lg:top-8">
            {request.urgent && (
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-status-rejected/10 px-3 py-1 text-sm font-semibold text-status-rejected">
                <Zap className="size-4" aria-hidden="true" />
                Urgente: lo necesita ya
              </p>
            )}
            <h2 className="font-semibold">¿Tomás este trabajo?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {request.urgent
                ? 'Es un pedido para ahora: al aceptar salís en ese momento hacia el domicilio y el cliente te sigue en el mapa.'
                : 'Al aceptar, el cliente recibe la confirmación y ves sus datos de contacto.'}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button size="lg" onClick={accept}>
                {request.urgent && <Navigation className="size-5" aria-hidden="true" />}
                {request.urgent ? 'Aceptar y salir ahora' : 'Aceptar trabajo'}
              </Button>
              <Button variant="outline" size="lg" onClick={() => setRejectOpen(true)}>
                Rechazar
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Dialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Rechazar solicitud"
        description="Contale al cliente por qué no podés tomarla."
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>
              Volver
            </Button>
            <Button variant="destructive" onClick={reject}>
              Rechazar solicitud
            </Button>
          </>
        }
      >
        <ReasonPicker reasons={REJECT_REASONS} value={reason} onChange={setReason} />
      </Dialog>
    </>
  )
}
