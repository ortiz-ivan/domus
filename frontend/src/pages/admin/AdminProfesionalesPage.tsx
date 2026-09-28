import { BadgeCheck, Clock, HardHat } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { PageHeader } from '@/components/ui/PageHeader'
import { RatingStars } from '@/components/ui/RatingStars'
import { SearchField } from '@/components/ui/SearchField'
import { formatGs } from '@/lib/format'
import { normalize } from '@/lib/search'
import { useDemoStore } from '@/store/demo'
import { ratingOf, useDirectory } from '@/store/selectors'
import { toast } from '@/store/toast'
import type { Professional } from '@/types'

type Filter = 'todos' | 'verificados' | 'pendientes'

export function AdminProfesionalesPage() {
  const professionals = useDemoStore((s) => s.professionals)
  const reviews = useDemoStore((s) => s.reviews)
  const setVerified = useDemoStore((s) => s.setProfessionalVerified)
  const dir = useDirectory()
  const [filter, setFilter] = useState<Filter>('todos')
  const [query, setQuery] = useState('')

  const q = normalize(query)
  const list = professionals.filter((p) => {
    if (filter === 'verificados' && !p.verified) return false
    if (filter === 'pendientes' && p.verified) return false
    const categories = p.categoryIds.map((id) => dir.category(id)?.name).join(' ')
    return !q || normalize(`${p.name} ${p.city} ${categories}`).includes(q)
  })

  const toggle = (p: Professional) => {
    setVerified(p.id, !p.verified)
    toast(p.verified ? `Se quitó la verificación de ${p.name}` : `${p.name} ahora está verificado`)
  }

  const categoriesOf = (p: Professional) => p.categoryIds.map((id) => dir.category(id)?.name).join(', ')
  const status = (p: Professional) =>
    p.verified ? (
      <Badge tone="accepted">
        <BadgeCheck className="size-3.5" aria-hidden="true" />
        Verificado
      </Badge>
    ) : (
      <Badge tone="pending">
        <Clock className="size-3.5" aria-hidden="true" />
        Pendiente
      </Badge>
    )
  const action = (p: Professional) => (
    <Button variant={p.verified ? 'outline' : 'primary'} size="sm" onClick={() => toggle(p)}>
      {p.verified ? 'Quitar verificación' : 'Verificar'}
      <span className="sr-only"> a {p.name}</span>
    </Button>
  )

  return (
    <>
      <PageHeader title="Gestión de profesionales" description="Verificá identidades y seguí el desempeño de cada profesional." />
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <FilterTabs
          label="Filtrar por verificación"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'todos', label: 'Todos', count: professionals.length },
            { value: 'verificados', label: 'Verificados', count: professionals.filter((p) => p.verified).length },
            { value: 'pendientes', label: 'Pendientes', count: professionals.filter((p) => !p.verified).length },
          ]}
        />
        <SearchField label="Buscar profesionales" value={query} onChange={setQuery} placeholder="Nombre, ciudad o categoría" className="md:w-72" />
      </div>

      {list.length === 0 ? (
        <EmptyState icon={HardHat} title="Sin resultados" />
      ) : (
        <Card padded={false}>
          <ul className="divide-y divide-border lg:hidden">
            {list.map((p) => {
              const rating = ratingOf(reviews, p)
              return (
                <li key={p.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={p.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{categoriesOf(p)}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        {status(p)}
                        <RatingStars value={rating.average} count={rating.count} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">{action(p)}</div>
                </li>
              )
            })}
          </ul>
          <table className="hidden w-full text-left text-sm lg:table">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="px-6 py-3 font-medium">Profesional</th>
                <th scope="col" className="px-3 py-3 font-medium">Categorías</th>
                <th scope="col" className="px-3 py-3 font-medium">Calificación</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">Trabajos</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">Precio base</th>
                <th scope="col" className="px-3 py-3 font-medium">Estado</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const rating = ratingOf(reviews, p)
                return (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.name} size="sm" />
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-muted-foreground">{p.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">{categoriesOf(p)}</td>
                    <td className="px-3 py-3">
                      <RatingStars value={rating.average} count={rating.count} />
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{p.jobsCompleted}</td>
                    <td className="px-3 py-3 text-right whitespace-nowrap tabular-nums">{formatGs(p.basePrice)}</td>
                    <td className="px-3 py-3">{status(p)}</td>
                    <td className="px-6 py-3 text-right whitespace-nowrap">{action(p)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  )
}
