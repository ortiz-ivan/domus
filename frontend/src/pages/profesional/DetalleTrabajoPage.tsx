import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/lib/format'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { toast } from '@/store/toast'
import { JobDetails } from './JobDetails'
import { useProRequest } from './useProRequests'

const REJECT_REASONS = ['No tengo disponibilidad en esa fecha', 'Está fuera de mi zona de trabajo', 'No realizo ese tipo de trabajo', 'Otro motivo']

export function DetalleTrabajoPage() {
  const request = useProRequest()
  const transition = useDemoStore((s) => s.transition)
  const commissionRate = useDemoStore((s) => s.settings.commissionRate)
  const navigate = useNavigate()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState(REJECT_REASONS[0])

  if (!request) return <MissingResource what="esa solicitud" backTo="/profesional/solicitudes" backLabel="Solicitudes" />
  // Una vez aceptada, el trabajo se gestiona desde "En proceso"
  if (request.status !== 'pendiente' && request.status !== 'rechazada') return <Navigate to={`/profesional/trabajos/${request.id}`} replace />

  const accept = () => {
    transition(request.id, 'aceptada', 'profesional')
    toast('Aceptaste el trabajo. El cliente ya fue notificado.')
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
            <h2 className="font-semibold">¿Tomás este trabajo?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Al aceptar, el cliente recibe la confirmación y ves sus datos de contacto.</p>
            <div className="mt-5 flex flex-col gap-3">
              <Button size="lg" onClick={accept}>
                Aceptar trabajo
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
        <fieldset>
          <legend className="sr-only">Motivo</legend>
          <div className="space-y-2">
            {REJECT_REASONS.map((r) => (
              <label
                key={r}
                className={cn(
                  'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm',
                  reason === r ? 'border-primary bg-accent-soft' : 'border-border hover:bg-muted',
                )}
              >
                <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} className="size-4 accent-primary" />
                {r}
              </label>
            ))}
          </div>
        </fieldset>
      </Dialog>
    </>
  )
}
