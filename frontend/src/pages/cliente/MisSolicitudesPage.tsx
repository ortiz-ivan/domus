import { ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { RequestCard } from '@/components/RequestCard'
import { LinkButton } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { PageHeader } from '@/components/ui/PageHeader'
import { ACTIVE_STATUSES } from '@/lib/status'
import { useDemoStore } from '@/store/demo'
import { useDirectory } from '@/store/selectors'
import { useSessionStore } from '@/store/session'
import { clientNextAction } from './nextAction'

type Tab = 'activas' | 'finalizadas'

export function MisSolicitudesPage() {
  const userId = useSessionStore((s) => s.userId)
  const requests = useDemoStore((s) => s.requests)
  const reviews = useDemoStore((s) => s.reviews)
  const dir = useDirectory()
  const [tab, setTab] = useState<Tab>('activas')

  const own = requests.filter((r) => r.clientId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const active = own.filter((r) => ACTIVE_STATUSES.includes(r.status))
  const finished = own.filter((r) => !ACTIVE_STATUSES.includes(r.status))
  const list = tab === 'activas' ? active : finished

  return (
    <>
      <PageHeader
        title="Mis solicitudes"
        description="Seguí el estado de cada servicio."
        actions={<LinkButton to="/cliente/categorias">Nueva solicitud</LinkButton>}
      />
      <FilterTabs
        label="Filtrar solicitudes"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'activas', label: 'Activas', count: active.length },
          { value: 'finalizadas', label: 'Finalizadas', count: finished.length },
        ]}
        className="mb-6"
      />

      {list.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={tab === 'activas' ? 'No tenés solicitudes activas' : 'Todavía no hay solicitudes finalizadas'}
          description="Elegí una categoría y pedí tu primer servicio."
          action={<LinkButton to="/cliente/categorias">Ver categorías</LinkButton>}
        />
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {list.map((r) => {
            const action = clientNextAction(r, reviews.some((rv) => rv.requestId === r.id))
            return (
              <li key={r.id}>
                <RequestCard
                  request={r}
                  category={dir.category(r.categoryId)}
                  counterpart={dir.professional(r.professionalId)?.name}
                  to={`/cliente/solicitudes/${r.id}`}
                  highlight={action?.label}
                />
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
