import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { useDemoStore } from '@/store/demo'

export function AdminProfesionalesPage() {
  const professionals = useDemoStore((s) => s.professionals)
  const unverified = professionals.filter((p) => !p.verified).length
  return (
    <ScreenPlaceholder
      title="Gestión de profesionales"
      description={`${professionals.length} profesionales, ${unverified} pendientes de verificación.`}
      planned={['Tabla con categorías, calificación y trabajos realizados', 'Verificar / quitar verificación', 'Filtro por categoría y estado']}
    />
  )
}
