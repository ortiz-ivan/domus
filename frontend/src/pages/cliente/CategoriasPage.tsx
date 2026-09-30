import { SearchX } from 'lucide-react'
import { Link } from 'react-router'
import { useBackHere } from '@/app/useBackHere'
import { CategoryIcon } from '@/components/CategoryIcon'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchField } from '@/components/ui/SearchField'
import { rankCategories } from '@/lib/search'
import { useQueryParam } from '@/lib/useQueryParam'
import { useDemoStore } from '@/store/demo'

export function CategoriasPage() {
  const categories = useDemoStore((s) => s.categories)
  const professionals = useDemoStore((s) => s.professionals)
  // Filtra mientras se escribe: entiende el problema ("gotea la canilla") y palabras a medio escribir
  const [query, setQuery] = useQueryParam('q')
  const results = rankCategories(query, categories)
  const backHere = useBackHere()

  return (
    <>
      <PageHeader title="Categorías de servicios" description="Elegí el tipo de servicio que necesitás." />
      <SearchField
        label="Buscar un servicio"
        value={query}
        onChange={setQuery}
        placeholder='Ej.: "plomería" o "gotea la canilla"'
        className="mb-6 max-w-xl"
      />
      <p className="sr-only" aria-live="polite">
        {query && (results.length === 0 ? 'Ningún servicio coincide' : `${results.length} ${results.length === 1 ? 'servicio' : 'servicios'}`)}
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No encontramos ese servicio"
          description="Probá con otras palabras, por ejemplo qué se rompió o qué necesitás hacer."
          action={
            <Button variant="outline" onClick={() => setQuery('')}>
              Ver todas las categorías
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((c) => {
            const count = professionals.filter((p) => p.categoryIds.includes(c.id)).length
            return (
              <li key={c.id}>
                <Link
                  to={`/cliente/categorias/${c.id}`}
                  state={backHere}
                  className="group relative isolate flex aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[3/4]"
                >
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary/95 via-primary/40 to-transparent" aria-hidden="true" />
                  <div className="mt-auto p-5 text-white">
                    <CategoryIcon name={c.icon} className="mb-2 size-6 text-accent" />
                    <h2 className="text-xl font-bold">{c.name}</h2>
                    <p className="mt-1 text-sm text-white/85">{c.description}</p>
                    <p className="mt-3 text-sm font-semibold">
                      {count} {count === 1 ? 'profesional' : 'profesionales'}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
