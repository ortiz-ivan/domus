import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { MissingResource } from '@/pages/NotFoundPage'
import { useClientRequest } from './useClientRequest'

export function ConfirmacionPage() {
  const request = useClientRequest()
  if (!request) return <MissingResource what="esa solicitud" backTo="/cliente/solicitudes" backLabel="Mis solicitudes" />

  return (
    <ScreenPlaceholder
      title="Trabajo terminado"
      description={`El profesional marcó "${request.title}" como terminado.`}
      planned={['Resumen de lo realizado', 'Botón "Confirmar que quedó bien" → estado Confirmada', 'Opción de reportar un problema (simulada)']}
      links={[
        { to: `/cliente/solicitudes/${request.id}/calificar`, label: 'Siguiente: calificar' },
        { to: `/cliente/solicitudes/${request.id}`, label: 'Volver al seguimiento' },
      ]}
    />
  )
}
