import { useParams } from 'react-router'
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'

export function DetalleProfesionalPage() {
  const { professionalId } = useParams()
  const professional = useDemoStore((s) => s.professionals.find((p) => p.id === professionalId))

  if (!professional) return <MissingResource what="ese profesional" backTo="/cliente/categorias" backLabel="Ver categorías" />

  return (
    <ScreenPlaceholder
      title={professional.name}
      description={professional.bio}
      planned={[
        'Encabezado con foto, calificación, verificación y ciudad',
        'Experiencia, trabajos realizados y precio referencial',
        'Reseñas de otros clientes',
        'Botón principal "Solicitar servicio"',
      ]}
      links={[
        { to: `/cliente/solicitudes/nueva?profesional=${professional.id}`, label: 'Solicitar servicio' },
        { to: `/cliente/categorias/${professional.categoryIds[0]}`, label: 'Volver al listado' },
      ]}
    />
  )
}
