import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { formatGs } from '@/lib/format'
import { MissingResource } from '@/pages/NotFoundPage'
import { useClientRequest } from './useClientRequest'

export function PagoPage() {
  const request = useClientRequest()
  if (!request) return <MissingResource what="esa solicitud" backTo="/cliente/solicitudes" backLabel="Mis solicitudes" />

  return (
    <ScreenPlaceholder
      title="Resumen y pago"
      description={`Total a pagar: ${formatGs(request.price)}`}
      planned={[
        'Resumen del servicio: profesional, fecha, detalle y total',
        'Método de pago: tarjeta, transferencia o billetera (simulado)',
        'Aviso claro de que es un pago ficticio',
        'Pantalla de éxito con comprobante',
      ]}
      links={[{ to: `/cliente/solicitudes/${request.id}`, label: 'Volver al seguimiento' }]}
    />
  )
}
