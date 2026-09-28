import { SearchX } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router'
import { ProCard } from '@/components/ProCard'
import { BackLink } from '@/components/ui/BackLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { Select } from '@/components/ui/Field'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { ratingOf } from '@/store/selectors'

type SortKey = 'rating' | 'price' | 'experience'

const SORT_LABELS: Record<SortKey, string> = {
  rating: 'Mejor calificados',
  price: 'Menor precio',
  experience: 'Más experiencia',
}

export function ProfesionalesPage() {
  const { categoryId } = useParams()
  const category = useDemoStore((s) => s.categories.find((c) => c.id === categoryId))
  const professionals = useDemoStore((s) => s.professionals)
  const reviews = useDemoStore((s) => s.reviews)
  const [sort, setSort] = useState<SortKey>('rating')
  const [onlyVerified, setOnlyVerified] = useState(false)

  if (!category) return <MissingResource what="esa categoría" backTo="/cliente/categorias" backLabel="Ver categorías" />

  const list = professionals
    .filter((p) => p.categoryIds.includes(category.id) && (!onlyVerified || p.verified))
    .map((p) => ({ professional: p, rating: ratingOf(reviews, p) }))
    .sort((a, b) =>
      sort === 'price'
        ? a.professional.basePrice - b.professional.basePrice
        : sort === 'experience'
          ? b.professional.yearsExperience - a.professional.yearsExperience
          : b.rating.average - a.rating.average || b.rating.count - a.rating.count,
    )

  return (
    <>
      <BackLink to="/cliente/categorias" label="Categorías" />
      <header className="relative isolate mb-6 overflow-hidden rounded-2xl p-6 text-white sm:p-8">
        <img src={category.image} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/95 to-primary/60" aria-hidden="true" />
        <h1 className="text-2xl font-bold sm:text-3xl">{category.name}</h1>
        <p className="mt-1 text-white/90">{category.description}</p>
        <p className="mt-3 text-sm font-semibold">{list.length} profesionales disponibles</p>
      </header>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={(e) => setOnlyVerified(e.target.checked)}
            className="size-5 cursor-pointer accent-primary"
          />
          Solo verificados
        </label>
        <div className="flex items-center gap-2">
          <label htmlFor="orden" className="text-sm font-medium whitespace-nowrap">
            Ordenar por
          </label>
          <Select id="orden" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="w-auto">
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={SearchX} title="No hay profesionales con ese filtro" description="Probá quitando el filtro de verificados." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(({ professional, rating }) => (
            <li key={professional.id}>
              <ProCard professional={professional} rating={rating} to={`/cliente/profesionales/${professional.id}`} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
