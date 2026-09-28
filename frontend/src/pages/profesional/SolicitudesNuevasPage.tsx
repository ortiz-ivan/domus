import { Inbox } from 'lucide-react'
import { useNavigate } from 'react-router'
import { RequestCard } from '@/components/RequestCard'
import { Button, LinkButton } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { useDemoStore } from '@/store/demo'
import { useDirectory } from '@/store/selectors'
import { toast } from '@/store/toast'
import { useProRequests } from './useProRequests'

export function SolicitudesNuevasPage() {
  const pending = useProRequests()
    .filter((r) => r.status === 'pendiente')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const transition = useDemoStore((s) => s.transition)
  const dir = useDirectory()
  const navigate = useNavigate()

  const accept = (id: string) => {
    if (transition(id, 'aceptada', 'profesional')) {
      toast('Aceptaste el trabajo. El cliente ya fue notificado.')
      navigate(`/profesional/trabajos/${id}`)
    }
  }

  return (
    <>
      <PageHeader title="Solicitudes nuevas" description="Revisá cada pedido y decidí si lo tomás." />
      {pending.length === 0 ? (
        <EmptyState icon={Inbox} title="No hay solicitudes nuevas" description="Cuando un cliente te pida un servicio, aparece acá al instante." />
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {pending.map((r) => (
            <li key={r.id}>
              <RequestCard
                request={r}
                category={dir.category(r.categoryId)}
                counterpart={dir.user(r.clientId)?.name}
                to={`/profesional/solicitudes/${r.id}`}
              >
                <Button size="sm" onClick={() => accept(r.id)}>
                  Aceptar
                </Button>
                <LinkButton to={`/profesional/solicitudes/${r.id}`} variant="outline" size="sm">
                  Ver detalle
                </LinkButton>
              </RequestCard>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
