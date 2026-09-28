import { Users } from 'lucide-react'
import { useState } from 'react'
import { ROLE_LABELS } from '@/app/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchField } from '@/components/ui/SearchField'
import { formatDate } from '@/lib/format'
import { normalize } from '@/lib/search'
import { useDemoStore } from '@/store/demo'
import { toast } from '@/store/toast'
import type { Role, User } from '@/types'

type Filter = 'todos' | Role

export function AdminUsuariosPage() {
  const users = useDemoStore((s) => s.users)
  const requests = useDemoStore((s) => s.requests)
  const professionals = useDemoStore((s) => s.professionals)
  const setUserActive = useDemoStore((s) => s.setUserActive)
  const [filter, setFilter] = useState<Filter>('todos')
  const [query, setQuery] = useState('')

  const requestCount = (u: User) => {
    if (u.role === 'cliente') return requests.filter((r) => r.clientId === u.id).length
    const pro = professionals.find((p) => p.userId === u.id)
    return pro ? requests.filter((r) => r.professionalId === pro.id).length : 0
  }

  const q = normalize(query)
  const list = users.filter(
    (u) => (filter === 'todos' || u.role === filter) && (!q || normalize(`${u.name} ${u.email} ${u.city}`).includes(q)),
  )

  const toggle = (u: User) => {
    setUserActive(u.id, !u.active)
    toast(u.active ? `${u.name} fue suspendido` : `${u.name} fue reactivado`, 'info')
  }

  const statusBadge = (u: User) => (u.active ? <Badge tone="done">Activo</Badge> : <Badge tone="rejected">Suspendido</Badge>)
  const action = (u: User) =>
    u.role !== 'admin' && (
      <Button variant="outline" size="sm" onClick={() => toggle(u)}>
        {u.active ? 'Suspender' : 'Reactivar'}
        <span className="sr-only"> a {u.name}</span>
      </Button>
    )

  return (
    <>
      <PageHeader title="Gestión de usuarios" description={`${users.length} usuarios registrados.`} />
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <FilterTabs
          label="Filtrar por rol"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'todos', label: 'Todos', count: users.length },
            { value: 'cliente', label: 'Clientes', count: users.filter((u) => u.role === 'cliente').length },
            { value: 'profesional', label: 'Profesionales', count: users.filter((u) => u.role === 'profesional').length },
            { value: 'admin', label: 'Admin', count: users.filter((u) => u.role === 'admin').length },
          ]}
        />
        <SearchField label="Buscar usuarios" value={query} onChange={setQuery} placeholder="Nombre, email o ciudad" className="md:w-72" />
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Users} title="Sin resultados" description="Probá con otra búsqueda." />
      ) : (
        <Card padded={false}>
          <ul className="divide-y divide-border md:hidden">
            {list.map((u) => (
              <li key={u.id} className="flex items-center gap-3 p-4">
                <Avatar name={u.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {ROLE_LABELS[u.role]} · {u.city}
                  </p>
                  <div className="mt-2">{statusBadge(u)}</div>
                </div>
                {action(u)}
              </li>
            ))}
          </ul>
          <table className="hidden w-full text-left text-sm md:table">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="px-6 py-3 font-medium">Usuario</th>
                <th scope="col" className="px-3 py-3 font-medium">Rol</th>
                <th scope="col" className="px-3 py-3 font-medium">Ciudad</th>
                <th scope="col" className="px-3 py-3 font-medium">Registro</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">Solicitudes</th>
                <th scope="col" className="px-3 py-3 font-medium">Estado</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">{ROLE_LABELS[u.role]}</td>
                  <td className="px-3 py-3">{u.city}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{u.role === 'admin' ? '—' : requestCount(u)}</td>
                  <td className="px-3 py-3">{statusBadge(u)}</td>
                  <td className="px-6 py-3 text-right">{action(u)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  )
}
