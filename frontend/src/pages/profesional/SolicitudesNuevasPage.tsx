import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { formatDate } from '@/lib/format'
import { useProRequests } from './useProRequests'

export function SolicitudesNuevasPage() {
  const pending = useProRequests().filter((r) => r.status === 'pendiente')
  return (
    <ScreenPlaceholder
      title="Solicitudes nuevas"
      description="Revisá cada pedido y decidí si lo tomás."
      planned={['Tarjeta por solicitud: problema, zona, fecha y monto', 'Acceso rápido a aceptar o rechazar', 'Estado vacío cuando no hay pedidos']}
      links={pending.map((r) => ({ to: `/profesional/solicitudes/${r.id}`, label: `${r.title} · ${formatDate(r.date)}` }))}
    />
  )
}
