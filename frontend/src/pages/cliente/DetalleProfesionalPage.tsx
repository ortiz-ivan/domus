import { useParams } from 'react-router'
import { useServiceParam, withService } from '@/app/serviceParam'
import { ProfessionalProfile } from '@/components/ProfessionalProfile'
import { BackLink } from '@/components/ui/BackLink'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { useDirectory } from '@/store/selectors'

export function DetalleProfesionalPage() {
  const { professionalId } = useParams()
  const professional = useDemoStore((s) => s.professionals.find((p) => p.id === professionalId))
  const dir = useDirectory()
  const [service] = useServiceParam()

  if (!professional) return <MissingResource what="ese profesional" backTo="/cliente/categorias" backLabel="Ver categorías" />

  return (
    <>
      <BackLink to={withService(`/cliente/categorias/${professional.categoryIds[0]}`, service)} label={dir.category(professional.categoryIds[0])?.name ?? 'Volver'} />
      <ProfessionalProfile professional={professional} requestPath={withService(`/cliente/solicitudes/nueva?profesional=${professional.id}`, service)} />
    </>
  )
}
