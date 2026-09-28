import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { useDemoStore } from '@/store/demo'

export function AdminUsuariosPage() {
  const clients = useDemoStore((s) => s.users).filter((u) => u.role === 'cliente').length
  return (
    <ScreenPlaceholder
      title="Gestión de usuarios"
      description={`${clients} clientes registrados.`}
      planned={['Tabla de usuarios con búsqueda y filtro por rol', 'Estado activo / suspendido (editable)', 'Fecha de registro y cantidad de solicitudes']}
    />
  )
}
