import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { useDemoStore } from '@/store/demo'

export function AdminSolicitudesPage() {
  const total = useDemoStore((s) => s.requests.length)
  return (
    <ScreenPlaceholder
      title="Gestión de solicitudes"
      description={`${total} solicitudes registradas.`}
      planned={['Tabla con código, cliente, profesional, categoría, fecha, monto y estado', 'Filtros por estado y categoría', 'Detalle con historial de estados']}
    />
  )
}
