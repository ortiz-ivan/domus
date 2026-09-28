import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { useDemoStore } from '@/store/demo'

export function CategoriasPage() {
  const categories = useDemoStore((s) => s.categories)
  return (
    <ScreenPlaceholder
      title="Categorías de servicios"
      description="Elegí el tipo de servicio que necesitás."
      planned={['Grilla de categorías con ícono y descripción', 'Cantidad de profesionales disponibles por categoría']}
      links={categories.map((c) => ({ to: `/cliente/categorias/${c.id}`, label: c.name }))}
    />
  )
}
