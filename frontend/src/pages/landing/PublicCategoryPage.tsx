import { useParams } from 'react-router'
import { useServiceParam, withService } from '@/app/serviceParam'
import { CategoryProfessionals } from '@/components/CategoryProfessionals'
import { BackLink } from '@/components/ui/BackLink'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { LandingFooter } from './LandingFooter'
import { LandingHeader } from './LandingHeader'

/**
 * Profesionales de una categoría, sin iniciar sesión (se ve también en el deploy "solo landing").
 * Destino de "Trabajos más pedidos", "Ver profesionales" y el buscador de la portada.
 */
export function PublicCategoryPage() {
  const { categoryId } = useParams()
  const category = useDemoStore((s) => s.categories.find((c) => c.id === categoryId))
  const [param, setService] = useServiceParam()
  const service = category && param && category.services.includes(param) ? param : null

  return (
    <>
      <LandingHeader onLanding={false} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {category ? (
          <>
            <BackLink to="/#servicios" label="Todos los servicios" />
            <CategoryProfessionals
              category={category}
              service={service}
              onServiceChange={setService}
              profilePath={(id) => withService(`/profesionales/${id}`, service)}
            />
          </>
        ) : (
          <div className="py-12">
            <MissingResource what="esa categoría" backTo="/#servicios" backLabel="Ver servicios" />
          </div>
        )}
      </main>
      <LandingFooter />
    </>
  )
}
