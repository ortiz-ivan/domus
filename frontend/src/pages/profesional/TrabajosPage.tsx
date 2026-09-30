import { Hammer, SearchX } from 'lucide-react'
import { RequestCard } from '@/components/RequestCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchField } from '@/components/ui/SearchField'
import { normalize } from '@/lib/search'
import { useQueryParam } from '@/lib/useQueryParam'
import type { RequestStatus } from '@/types'
import { useDirectory } from '@/store/selectors'
import { useProRequests } from './useProRequests'

type Tab = 'iniciar' | 'proceso' | 'confirmar' | 'finalizados'

const TAB_STATUSES: Record<Tab, RequestStatus[]> = {
  iniciar: ['aceptada'],
  proceso: ['en_proceso'],
  confirmar: ['terminada', 'confirmada'],
  finalizados: ['pagada'],
}

const HIGHLIGHTS: Partial<Record<RequestStatus, string>> = {
  aceptada: 'Iniciá el trabajo cuando llegues',
  en_proceso: 'Marcalo como terminado al finalizar',
}

export function TrabajosPage() {
  const requests = useProRequests()
  const dir = useDirectory()
  // Pestaña y búsqueda en la URL: al abrir un trabajo y volver, se sigue viendo lo mismo
  const [tabParam, setTabParam] = useQueryParam('etapa')
  const tab: Tab = Object.hasOwn(TAB_STATUSES, tabParam) ? (tabParam as Tab) : 'proceso'
  const setTab = (next: Tab) => setTabParam(next === 'proceso' ? '' : next)
  const [query, setQuery] = useQueryParam('q')

  // La búsqueda se aplica a todas las pestañas: sus contadores muestran en cuál están los resultados
  const q = normalize(query)
  const matching = q
    ? requests.filter((r) => normalize(`${r.code} ${r.title} ${dir.user(r.clientId)?.name ?? ''} ${r.address} ${r.city}`).includes(q))
    : requests
  const count = (t: Tab) => matching.filter((r) => TAB_STATUSES[t].includes(r.status)).length
  const list = matching
    .filter((r) => TAB_STATUSES[tab].includes(r.status))
    .sort((a, b) => (tab === 'finalizados' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)))

  return (
    <>
      <PageHeader title="Mis trabajos" description="Gestioná los trabajos que aceptaste." />
      <SearchField
        label="Buscar trabajos"
        value={query}
        onChange={setQuery}
        placeholder="Trabajo, código, cliente o dirección"
        className="mb-4 max-w-xl"
      />
      <FilterTabs
        label="Filtrar trabajos"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: 'iniciar', label: 'Por iniciar', count: count('iniciar') },
          { value: 'proceso', label: 'En proceso', count: count('proceso') },
          { value: 'confirmar', label: 'Esperando al cliente', count: count('confirmar') },
          { value: 'finalizados', label: 'Cobrados', count: count('finalizados') },
        ]}
      />
      {list.length === 0 ? (
        q ? (
          <EmptyState
            icon={SearchX}
            title="Ningún trabajo coincide en esta etapa"
            description={matching.length > 0 ? 'Mirá las otras pestañas: los números muestran dónde hay resultados.' : 'Probá con otro nombre, código o dirección.'}
            action={
              <Button variant="outline" onClick={() => setQuery('')}>
                Borrar búsqueda
              </Button>
            }
          />
        ) : (
          <EmptyState icon={Hammer} title="No hay trabajos en esta etapa" />
        )
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {list.map((r) => (
            <li key={r.id}>
              <RequestCard
                request={r}
                category={dir.category(r.categoryId)}
                counterpart={dir.user(r.clientId)?.name}
                to={`/profesional/trabajos/${r.id}`}
                highlight={HIGHLIGHTS[r.status]}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
