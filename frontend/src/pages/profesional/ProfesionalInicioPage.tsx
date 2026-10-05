import { ArrowRight, CalendarDays, Hammer, Inbox, MapPin, Star, Wallet } from 'lucide-react'
import { Link } from 'react-router'
import { RequestCard } from '@/components/RequestCard'
import { useBackHere } from '@/app/useBackHere'
import { LinkButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { formatGs, scheduleLabel } from '@/lib/format'
import { lastMonths } from '@/lib/periods'
import { useDemoStore } from '@/store/demo'
import { ratingOf, useCurrentProfessional, useDirectory } from '@/store/selectors'
import { useProRequests } from './useProRequests'

export function ProfesionalInicioPage() {
  const professional = useCurrentProfessional()
  const requests = useProRequests()
  const payments = useDemoStore((s) => s.payments)
  const reviews = useDemoStore((s) => s.reviews)
  const dir = useDirectory()
  const backHere = useBackHere()

  if (!professional) return null

  const pending = requests.filter((r) => r.status === 'pendiente')
  const working = requests.filter((r) => r.status === 'aceptada' || r.status === 'en_camino' || r.status === 'en_proceso')
  const next = [...working].sort((a, b) => a.date.localeCompare(b.date))[0]
  const [month] = lastMonths(1)
  const ownIds = new Set(requests.map((r) => r.id))
  const monthNet = payments
    .filter((p) => ownIds.has(p.requestId) && new Date(p.createdAt).getTime() >= month.start)
    .reduce((sum, p) => sum + p.amount - p.fee, 0)
  const rating = ratingOf(reviews, professional)
  const latestReviews = reviews
    .filter((r) => r.professionalId === professional.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Hola, {professional.name.split(' ')[0]}</h1>
        <p className="mt-1 text-muted-foreground">
          {pending.length > 0
            ? `Tenés ${pending.length} ${pending.length === 1 ? 'solicitud nueva esperando respuesta' : 'solicitudes nuevas esperando respuesta'}.`
            : 'No tenés solicitudes nuevas por ahora.'}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Solicitudes nuevas" value={pending.length} icon={Inbox} />
        <StatCard label="Trabajos activos" value={working.length} icon={Hammer} />
        <StatCard label="Ganancias del mes" value={formatGs(monthNet)} icon={Wallet} hint="Neto de comisión" />
        <StatCard label="Calificación" value={rating.average.toFixed(1)} icon={Star} hint={`${rating.count} reseñas`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold">Solicitudes nuevas</h2>
            <Link to="/profesional/solicitudes" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Ver todas
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          {pending.length === 0 ? (
            <Card className="text-muted-foreground">Cuando un cliente te pida un servicio, lo vas a ver acá.</Card>
          ) : (
            <ul className="space-y-3">
              {pending.slice(0, 3).map((r) => (
                <li key={r.id}>
                  <RequestCard
                    request={r}
                    category={dir.category(r.categoryId)}
                    counterpart={dir.user(r.clientId)?.name}
                    to={`/profesional/solicitudes/${r.id}`}
                    highlight="Respondé para no perder el trabajo"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="space-y-6">
          <Card>
            <h2 className="font-semibold">Próximo trabajo</h2>
            {next ? (
              <>
                <p className="mt-3 font-semibold">{next.title}</p>
                <p className="text-sm text-muted-foreground">{dir.user(next.clientId)?.name}</p>
                <p className="mt-3 flex items-center gap-2 text-sm">
                  <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
                  {scheduleLabel(next, true)}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
                  {next.address}, {next.city}
                </p>
                <LinkButton to={`/profesional/trabajos/${next.id}`} state={backHere} variant="outline" className="mt-4 w-full">
                  Ver trabajo
                </LinkButton>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No tenés trabajos agendados.</p>
            )}
          </Card>

          <Card>
            <h2 className="font-semibold">Últimas reseñas</h2>
            <ul className="mt-3 space-y-4">
              {latestReviews.map((r) => (
                <li key={r.id}>
                  <p className="flex items-center gap-1 text-sm font-semibold">
                    <Star className="size-4 fill-accent text-accent" aria-hidden="true" />
                    {r.rating}
                    <span className="font-normal text-muted-foreground">· {dir.user(r.clientId)?.name.split(' ')[0]}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{r.comment || 'Sin comentario.'}</p>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  )
}
