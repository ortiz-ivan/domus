import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Avatar } from '@/components/ui/Avatar'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Field, Textarea } from '@/components/ui/Field'
import { formatDateTime, formatGs } from '@/lib/format'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { useDirectory } from '@/store/selectors'
import { toast } from '@/store/toast'
import { useClientRequest } from './useClientRequest'

export function ConfirmacionPage() {
  const request = useClientRequest()
  const transition = useDemoStore((s) => s.transition)
  const dir = useDirectory()
  const navigate = useNavigate()
  const [reportOpen, setReportOpen] = useState(false)
  const [report, setReport] = useState('')

  if (!request) return <MissingResource what="esa solicitud" backTo="/cliente/solicitudes" backLabel="Mis solicitudes" />
  // Solo tiene sentido confirmar un trabajo terminado
  if (request.status !== 'terminada') return <Navigate to={`/cliente/solicitudes/${request.id}`} replace />

  const professional = dir.professional(request.professionalId)
  const finishedAt = request.history.find((h) => h.status === 'terminada')?.at

  const confirm = () => {
    transition(request.id, 'confirmada', 'cliente')
    toast('¡Listo! Confirmaste el trabajo')
    navigate(`/cliente/solicitudes/${request.id}/calificar`)
  }

  const sendReport = () => {
    setReportOpen(false)
    setReport('')
    toast('Recibimos tu reporte. Soporte se va a comunicar con vos (simulado).', 'info')
  }

  return (
    <div className="mx-auto max-w-xl">
      <BackLink to={`/cliente/solicitudes/${request.id}`} label="Volver al seguimiento" />
      <Card className="text-center">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-status-done/10">
          <CheckCircle2 className="size-9 text-status-done" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Trabajo terminado</h1>
        <p className="mt-2 text-muted-foreground">
          {professional?.name} marcó <span className="font-semibold text-foreground">“{request.title}”</span> como terminado
          {finishedAt && ` el ${formatDateTime(finishedAt)}`}.
        </p>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-muted p-4 text-left">
          <div className="flex items-center gap-3">
            {professional && <Avatar name={professional.name} />}
            <div>
              <p className="font-semibold">{professional?.name}</p>
              <p className="text-sm text-muted-foreground">{request.code}</p>
            </div>
          </div>
          <p className="font-heading text-lg font-bold tabular-nums">{formatGs(request.price)}</p>
        </div>

        <p className="mt-6 font-semibold">¿El trabajo quedó bien?</p>
        <div className="mt-4 flex flex-col gap-3">
          <Button size="lg" onClick={confirm}>
            Sí, quedó bien
          </Button>
          <Button variant="outline" size="lg" onClick={() => setReportOpen(true)}>
            Reportar un problema
          </Button>
        </div>
      </Card>

      <Dialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Reportar un problema"
        description="Contanos qué pasó. En la demo el reporte es simulado."
        footer={
          <>
            <Button variant="ghost" onClick={() => setReportOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={sendReport} disabled={report.trim().length < 5}>
              Enviar reporte
            </Button>
          </>
        }
      >
        <Field label="¿Qué problema hubo?">
          {(props) => <Textarea {...props} value={report} onChange={(e) => setReport(e.target.value)} />}
        </Field>
      </Dialog>
    </div>
  )
}
