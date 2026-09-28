import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { MissingResource } from '@/pages/NotFoundPage'
import { useClientRequest } from './useClientRequest'

export function CalificacionPage() {
  const request = useClientRequest()
  if (!request) return <MissingResource what="esa solicitud" backTo="/cliente/solicitudes" backLabel="Mis solicitudes" />

  return (
    <ScreenPlaceholder
      title="Calificá al profesional"
      description="Tu opinión ayuda a otros clientes."
      planned={['Selector de 1 a 5 estrellas (accesible con teclado)', 'Comentario opcional', 'Al enviar: se guarda la reseña y se pasa al pago']}
      links={[
        { to: `/cliente/solicitudes/${request.id}/pago`, label: 'Siguiente: pago' },
        { to: `/cliente/solicitudes/${request.id}`, label: 'Volver al seguimiento' },
      ]}
    />
  )
}
