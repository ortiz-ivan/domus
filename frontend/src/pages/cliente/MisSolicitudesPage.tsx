import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { STATUS_META } from '@/lib/status'
import { useDemoStore } from '@/store/demo'
import { useSessionStore } from '@/store/session'

export function MisSolicitudesPage() {
  const userId = useSessionStore((s) => s.userId)
  const requests = useDemoStore((s) => s.requests)
  const own = requests.filter((r) => r.clientId === userId)

  return (
    <ScreenPlaceholder
      title="Mis solicitudes"
      description="Seguí el estado de cada servicio."
      planned={['Pestañas: activas / finalizadas', 'Tarjeta por solicitud con profesional, fecha y estado', 'Estado vacío con acceso a categorías']}
      links={own.map((r) => ({ to: `/cliente/solicitudes/${r.id}`, label: `${r.title} · ${STATUS_META[r.status].label}` }))}
    />
  )
}
