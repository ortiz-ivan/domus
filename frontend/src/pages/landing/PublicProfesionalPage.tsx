import { useParams } from 'react-router'
import { loginPath } from '@/app/paths'
import { useServiceParam, withService } from '@/app/serviceParam'
import { ProCard } from '@/components/ProCard'
import { ProfessionalProfile } from '@/components/ProfessionalProfile'
import { BackLink } from '@/components/ui/BackLink'
import { MissingResource } from '@/pages/NotFoundPage'
import { compareRecommended } from '@/lib/plans'
import { useDemoStore } from '@/store/demo'
import { ratingOf, useDirectory } from '@/store/selectors'
import { LandingFooter } from './LandingFooter'
import { LandingHeader } from './LandingHeader'

/**
 * Perfil público de un profesional, sin iniciar sesión (se ve también en el deploy "solo landing").
 * "Solicitar servicio" pide ingresar como cliente y después sigue con la solicitud.
 */
export function PublicProfesionalPage() {
  const { professionalId } = useParams()
  const professional = useDemoStore((s) => s.professionals.find((p) => p.id === professionalId))
  const professionals = useDemoStore((s) => s.professionals)
  const reviews = useDemoStore((s) => s.reviews)
  const dir = useDirectory()
  const [service] = useServiceParam()

  const category = professional && dir.category(professional.categoryIds[0])
  const others = professional
    ? professionals
        .filter((p) => p.id !== professional.id && p.categoryIds.includes(professional.categoryIds[0]))
        .map((p) => ({ professional: p, rating: ratingOf(reviews, p) }))
        .sort(compareRecommended)
        .slice(0, 3)
    : []

  return (
    <>
      <LandingHeader onLanding={false} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {professional ? (
          <>
            <BackLink to={withService(`/servicios/${professional.categoryIds[0]}`, service)} label={`Volver a ${category?.name.toLowerCase() ?? 'los servicios'}`} />
            <ProfessionalProfile
              professional={professional}
              requestPath={loginPath({ rol: 'cliente', next: withService(`/cliente/solicitudes/nueva?profesional=${professional.id}`, service) })}
              stickyClassName="lg:top-24"
              service={service}
            />

            {others.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold">Otros profesionales de {category?.name.toLowerCase()}</h2>
                <ul className="mt-4 grid gap-3 md:grid-cols-3">
                  {others.map(({ professional: p, rating }) => (
                    <li key={p.id}>
                      <ProCard professional={p} rating={rating} variant="compact" to={withService(`/profesionales/${p.id}`, service)} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        ) : (
          <div className="py-12">
            <MissingResource what="ese profesional" backTo="/#servicios" backLabel="Ver servicios" />
          </div>
        )}
      </main>
      <LandingFooter />
    </>
  )
}
