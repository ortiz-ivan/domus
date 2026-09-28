import { SearchX } from 'lucide-react'
import { useState } from 'react'
import { ProCard } from '@/components/ProCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Select } from '@/components/ui/Field'
import { cn } from '@/lib/cn'
import { compareRecommended } from '@/lib/plans'
import { useDemoStore } from '@/store/demo'
import { ratingOf } from '@/store/selectors'
import type { Category } from '@/types'

type SortKey = 'recommended' | 'rating' | 'price' | 'experience'

const SORT_LABELS: Record<SortKey, string> = {
  // Planes Destacado y Premium primero (llevan insignia), después por calificación
  recommended: 'Recomendados',
  rating: 'Mejor calificados',
  price: 'Menor precio',
  experience: 'Más experiencia',
}

interface CategoryProfessionalsProps {
  category: Category
  /** Trabajo elegido (de "Trabajos más pedidos"), o null */
  service: string | null
  onServiceChange: (service: string | null) => void
  /** Link al perfil de cada profesional: en la app o el perfil público */
  profilePath: (professionalId: string) => string
}

/**
 * Profesionales de una categoría: el trabajo elegido, filtros, orden y tarjetas.
 * Lo usan la app del cliente y la página pública /servicios/:categoría.
 */
export function CategoryProfessionals({ category, service, onServiceChange, profilePath }: CategoryProfessionalsProps) {
  const professionals = useDemoStore((s) => s.professionals)
  const reviews = useDemoStore((s) => s.reviews)
  const [sort, setSort] = useState<SortKey>('recommended')
  const [onlyVerified, setOnlyVerified] = useState(false)

  const list = professionals
    .filter((p) => p.categoryIds.includes(category.id) && (!onlyVerified || p.verified))
    .map((p) => ({ professional: p, rating: ratingOf(reviews, p) }))
    .sort((a, b) =>
      sort === 'price'
        ? a.professional.basePrice - b.professional.basePrice
        : sort === 'experience'
          ? b.professional.yearsExperience - a.professional.yearsExperience
          : sort === 'recommended'
            ? compareRecommended(a, b)
            : b.rating.average - a.rating.average || b.rating.count - a.rating.count,
    )

  return (
    <>
      <header className="relative isolate mb-6 overflow-hidden rounded-2xl p-6 text-white sm:p-8">
        <img src={category.image} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/95 to-primary/60" aria-hidden="true" />
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">{category.name}</p>
        <h1 className="mt-1 text-2xl font-bold text-balance sm:text-3xl">{service ?? category.name}</h1>
        <p className="mt-1 text-white/90">{service ? `Profesionales de ${category.name.toLowerCase()} para este trabajo.` : category.description}</p>
        <p className="mt-3 text-sm font-semibold">{list.length} profesionales disponibles</p>
      </header>

      <fieldset className="mb-6">
        <legend className="mb-2 text-sm font-semibold">¿Qué trabajo necesitás?</legend>
        <div className="flex flex-wrap gap-2">
          {category.services.map((s) => {
            const selected = s === service
            return (
              <button
                key={s}
                type="button"
                aria-pressed={selected}
                // Tocar el trabajo elegido lo quita
                onClick={() => onServiceChange(selected ? null : s)}
                className={cn(
                  'inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors duration-150',
                  selected ? 'border-primary bg-primary text-on-primary' : 'border-border bg-card hover:bg-muted',
                )}
              >
                {s}
              </button>
            )
          })}
        </div>
      </fieldset>

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
              <ProCard professional={professional} rating={rating} to={profilePath(professional.id)} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
