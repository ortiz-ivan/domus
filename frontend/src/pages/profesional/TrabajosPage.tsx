import { Hammer } from 'lucide-react'
import { useState } from 'react'
import { RequestCard } from '@/components/RequestCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { PageHeader } from '@/components/ui/PageHeader'
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
  const [tab, setTab] = useState<Tab>('proceso')

  const count = (t: Tab) => requests.filter((r) => TAB_STATUSES[t].includes(r.status)).length
  const list = requests
    .filter((r) => TAB_STATUSES[tab].includes(r.status))
    .sort((a, b) => (tab === 'finalizados' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)))

  return (
    <>
      <PageHeader title="Mis trabajos" description="Gestioná los trabajos que aceptaste." />
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
        <EmptyState icon={Hammer} title="No hay trabajos en esta etapa" />
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
