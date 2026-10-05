import { ClipboardList } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { RequestTimeline } from '@/components/RequestTimeline'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { controlClasses } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchField } from '@/components/ui/SearchField'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { ShowMore } from '@/components/ui/ShowMore'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate, formatGs, scheduleLabel } from '@/lib/format'
import { normalize } from '@/lib/search'
import { STATUS_META } from '@/lib/status'
import { usePaged } from '@/lib/usePaged'
import { useDemoStore } from '@/store/demo'
import { useDirectory } from '@/store/selectors'
import type { RequestStatus, ServiceRequest } from '@/types'

const STATUS_OPTIONS = [
  { value: '' as const, label: 'Todos los estados' },
  ...(Object.keys(STATUS_META) as RequestStatus[]).map((value) => ({ value, label: STATUS_META[value].label })),
]

export function AdminSolicitudesPage() {
  const requests = useDemoStore((s) => s.requests)
  const categories = useDemoStore((s) => s.categories)
  const dir = useDirectory()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<RequestStatus | ''>('')
  const [categoryId, setCategoryId] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const q = normalize(query)
  const list = [...requests]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((r) => {
      if (status && r.status !== status) return false
      if (categoryId && r.categoryId !== categoryId) return false
      if (!q) return true
      return normalize(`${r.code} ${r.title} ${dir.user(r.clientId)?.name} ${dir.professional(r.professionalId)?.name}`).includes(q)
    })
  const page = usePaged(list, `${status}|${categoryId}|${q}`)
  const open = requests.find((r) => r.id === openId)
  const categoryOptions = [{ value: '', label: 'Todas las categorías' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]

  const rowButton = (r: ServiceRequest, children: ReactNode) => (
    <button type="button" onClick={() => setOpenId(r.id)} className="text-left font-medium text-primary hover:underline">
      {children}
    </button>
  )

  return (
    <>
      <PageHeader title="Gestión de solicitudes" description={`${requests.length} solicitudes registradas.`} />

      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_12rem_12rem]">
        <SearchField label="Buscar solicitudes" value={query} onChange={setQuery} placeholder="Código, trabajo, cliente o profesional" />
        <div>
          <label htmlFor="f-estado" className="sr-only">Estado</label>
          <SelectMenu id="f-estado" label="Estado" value={status} options={STATUS_OPTIONS} onChange={setStatus} triggerClassName={controlClasses} />
        </div>
        <div>
          <label htmlFor="f-categoria" className="sr-only">Categoría</label>
          <SelectMenu
            id="f-categoria"
            label="Categoría"
            value={categoryId}
            options={categoryOptions}
            onChange={setCategoryId}
            triggerClassName={controlClasses}
          />
        </div>
      </div>

      <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
        {list.length} {list.length === 1 ? 'resultado' : 'resultados'}
      </p>

      {list.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Sin resultados" description="Probá con otros filtros." />
      ) : (
        <Card padded={false}>
          <ul className="divide-y divide-border lg:hidden">
            {page.items.map((r) => (
              <li key={r.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  {rowButton(r, r.title)}
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {r.code} · {formatDate(r.createdAt)} · {formatGs(r.price)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {dir.user(r.clientId)?.name} → {dir.professional(r.professionalId)?.name}
                </p>
              </li>
            ))}
          </ul>
          <table className="hidden w-full text-left text-sm lg:table">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="px-6 py-3 font-medium">Solicitud</th>
                <th scope="col" className="px-3 py-3 font-medium">Cliente</th>
                <th scope="col" className="px-3 py-3 font-medium">Profesional</th>
                <th scope="col" className="px-3 py-3 font-medium">Fecha</th>
                <th scope="col" className="px-3 py-3 text-right font-medium">Monto</th>
                <th scope="col" className="px-6 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {page.items.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3">
                    {rowButton(r, r.title)}
                    <p className="text-muted-foreground">
                      {r.code} · {dir.category(r.categoryId)?.name}
                    </p>
                  </td>
                  <td className="px-3 py-3">{dir.user(r.clientId)?.name}</td>
                  <td className="px-3 py-3">{dir.professional(r.professionalId)?.name}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                  <td className="px-3 py-3 text-right whitespace-nowrap tabular-nums">{formatGs(r.price)}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ShowMore {...page} onShowMore={page.showMore} noun="solicitudes" />
        </Card>
      )}

      <Dialog open={Boolean(open)} onClose={() => setOpenId(null)} title={open?.title ?? ''} description={open ? `${open.code} · ${dir.category(open.categoryId)?.name}` : ''}>
        {open && (
          <div className="space-y-5">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Cliente</dt>
                <dd className="font-medium">{dir.user(open.clientId)?.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Profesional</dt>
                <dd className="font-medium">{dir.professional(open.professionalId)?.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Fecha del servicio</dt>
                <dd className="font-medium">
                  {scheduleLabel(open)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Monto</dt>
                <dd className="font-medium tabular-nums">{formatGs(open.price)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">Dirección</dt>
                <dd className="font-medium">
                  {open.address}, {open.city}
                </dd>
              </div>
            </dl>
            <div className="border-t border-border pt-5">
              <h3 className="mb-4 font-semibold">Historial</h3>
              <RequestTimeline request={open} />
            </div>
          </div>
        )}
      </Dialog>
    </>
  )
}
