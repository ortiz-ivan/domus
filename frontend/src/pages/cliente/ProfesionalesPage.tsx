import { useParams } from 'react-router'
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'

export function ProfesionalesPage() {
  const { categoryId } = useParams()
  const category = useDemoStore((s) => s.categories.find((c) => c.id === categoryId))
  const professionals = useDemoStore((s) => s.professionals)

  if (!category) return <MissingResource what="esa categoría" backTo="/cliente/categorias" backLabel="Ver categorías" />

  const inCategory = professionals.filter((p) => p.categoryIds.includes(category.id))
  return (
    <ScreenPlaceholder
      title={category.name}
      description={category.description}
      planned={[
        'Tarjetas de profesionales: foto, calificación, experiencia y precio referencial',
        'Insignia de profesional verificado',
        'Orden por calificación o precio',
      ]}
      links={inCategory.map((p) => ({ to: `/cliente/profesionales/${p.id}`, label: p.name }))}
    />
  )
}
