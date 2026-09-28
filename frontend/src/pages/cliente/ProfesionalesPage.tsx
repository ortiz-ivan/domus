import { useParams } from 'react-router'
import { useServiceParam, withService } from '@/app/serviceParam'
import { CategoryProfessionals } from '@/components/CategoryProfessionals'
import { BackLink } from '@/components/ui/BackLink'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'

export function ProfesionalesPage() {
  const { categoryId } = useParams()
  const category = useDemoStore((s) => s.categories.find((c) => c.id === categoryId))
  const [param, setService] = useServiceParam()

  if (!category) return <MissingResource what="esa categoría" backTo="/cliente/categorias" backLabel="Ver categorías" />
  // Solo se acepta un trabajo de esta categoría
  const service = param && category.services.includes(param) ? param : null

  return (
    <>
      <BackLink to="/cliente/categorias" label="Categorías" />
      <CategoryProfessionals
        category={category}
        service={service}
        onServiceChange={setService}
        profilePath={(id) => withService(`/cliente/profesionales/${id}`, service)}
      />
    </>
  )
}
