import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { CategoryIcon } from '@/components/CategoryIcon'
import { ProCard } from '@/components/ProCard'
import { RequestCard } from '@/components/RequestCard'
import { SearchForm } from '@/components/SearchForm'
import { ACTIVE_STATUSES } from '@/lib/status'
import { useDemoStore } from '@/store/demo'
import { ratingOf, useCurrentUser, useDirectory } from '@/store/selectors'
import { clientNextAction } from './nextAction'

function SectionHeader({ title, to, linkLabel }: { title: string; to?: string; linkLabel?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {to && (
        <Link to={to} className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary hover:underline">
          {linkLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export function ClienteInicioPage() {
  const user = useCurrentUser()
  const categories = useDemoStore((s) => s.categories)
  const professionals = useDemoStore((s) => s.professionals)
  const requests = useDemoStore((s) => s.requests)
  const reviews = useDemoStore((s) => s.reviews)
  const dir = useDirectory()

  const active = requests.filter((r) => r.clientId === user?.id && ACTIVE_STATUSES.includes(r.status))
  const topPros = professionals
    .filter((p) => p.verified)
    .map((p) => ({ professional: p, rating: ratingOf(reviews, p) }))
    .sort((a, b) => b.rating.average - a.rating.average)
    .slice(0, 3)

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-primary p-6 text-on-primary sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Hola, {user?.name.split(' ')[0]}</h1>
        <p className="mt-1 text-white/85">¿Qué necesitás arreglar hoy?</p>
        <SearchForm variant="compact" destination="app" className="mt-5 max-w-xl" />
      </section>

      {active.length > 0 && (
        <section>
          <SectionHeader title="Tus solicitudes activas" to="/cliente/solicitudes" linkLabel="Ver todas" />
          <ul className="grid gap-3 lg:grid-cols-2">
            {active.slice(0, 4).map((r) => {
              const action = clientNextAction(r, reviews.some((rv) => rv.requestId === r.id))
              return (
                <li key={r.id}>
                  <RequestCard
                    request={r}
                    category={dir.category(r.categoryId)}
                    counterpart={dir.professional(r.professionalId)?.name}
                    to={action?.to ?? `/cliente/solicitudes/${r.id}`}
                    highlight={action?.label}
                  />
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section>
        <SectionHeader title="Categorías" to="/cliente/categorias" linkLabel="Ver todas" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                to={`/cliente/categorias/${c.id}`}
                className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-3 text-center text-sm font-medium transition-colors duration-150 hover:border-accent"
              >
                <CategoryIcon name={c.icon} className="size-7 text-accent-text" strokeWidth={1.75} />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeader title="Profesionales mejor calificados" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topPros.map(({ professional, rating }) => (
            <li key={professional.id}>
              <ProCard
                professional={professional}
                rating={rating}
                categoryName={dir.category(professional.categoryIds[0])?.name}
                to={`/cliente/profesionales/${professional.id}`}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
