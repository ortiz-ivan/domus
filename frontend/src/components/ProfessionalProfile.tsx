import { BadgeCheck, Briefcase, Clock, MapPin, Star } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button, LinkButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { RatingStars } from '@/components/ui/RatingStars'
import { cn } from '@/lib/cn'
import { formatDate, formatGs } from '@/lib/format'
import { useDemoStore } from '@/store/demo'
import { ratingOf, useDirectory } from '@/store/selectors'
import type { Professional } from '@/types'

const PAGE = 4

interface ProfessionalProfileProps {
  professional: Professional
  /** A dónde lleva "Solicitar servicio": la solicitud (cliente logueado) o el ingreso (perfil público) */
  requestPath: string
  /** Separación de la columna fija con el borde superior (el perfil público tiene header fijo) */
  stickyClassName?: string
}

/** Perfil del profesional: lo usan la app del cliente y el perfil público de la landing */
export function ProfessionalProfile({ professional, requestPath, stickyClassName = 'lg:top-8' }: ProfessionalProfileProps) {
  const allReviews = useDemoStore((s) => s.reviews)
  const dir = useDirectory()
  const [visible, setVisible] = useState(PAGE)

  const rating = ratingOf(allReviews, professional)
  const reviews = allReviews
    .filter((r) => r.professionalId === professional.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={professional.name} size="lg" className="size-20 text-2xl" />
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {professional.name}
                {professional.verified && (
                  <BadgeCheck className="ml-2 inline size-6 -translate-y-0.5 text-status-accepted" aria-label="Verificado" role="img" />
                )}
              </h1>
              <RatingStars value={rating.average} count={rating.count} className="mt-1 text-base" />
              <div className="mt-3 flex flex-wrap gap-2">
                {professional.categoryIds.map((id) => (
                  <Badge key={id} tone="accent">
                    {dir.category(id)?.name}
                  </Badge>
                ))}
                {professional.verified ? (
                  <Badge tone="accepted">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Identidad verificada
                  </Badge>
                ) : (
                  <Badge>Verificación pendiente</Badge>
                )}
              </div>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
            {[
              { icon: Briefcase, label: 'Trabajos', value: professional.jobsCompleted },
              { icon: Clock, label: 'Experiencia', value: `${professional.yearsExperience} años` },
              { icon: MapPin, label: 'Zona', value: professional.city },
              { icon: Star, label: 'Reseñas', value: rating.count },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}>
                <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-0.5 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          {/* CTA en móvil; en escritorio está en la columna lateral */}
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-6 lg:hidden">
            <p className="text-sm text-muted-foreground">
              Desde
              <span className="block font-heading text-xl font-bold text-foreground tabular-nums">{formatGs(professional.basePrice)}</span>
            </p>
            <LinkButton to={requestPath} size="lg">
              Solicitar servicio
            </LinkButton>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Sobre {professional.name.split(' ')[0]}</h2>
          <p className="mt-2 text-muted-foreground">{professional.bio}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Reseñas de clientes</h2>
          {reviews.length === 0 ? (
            <p className="mt-2 text-muted-foreground">Todavía no hay reseñas escritas en Domus.</p>
          ) : (
            <>
              <ul className="mt-4 divide-y divide-border">
                {reviews.slice(0, visible).map((review) => {
                  const client = dir.user(review.clientId)
                  const [first, last] = (client?.name ?? 'Cliente').split(' ')
                  return (
                    <li key={review.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">
                          {first} {last ? `${last[0]}.` : ''}
                        </p>
                        <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
                      </div>
                      <p className="mt-1 flex gap-0.5" role="img" aria-label={`${review.rating} de 5 estrellas`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={i < review.rating ? 'size-4 fill-accent text-accent' : 'size-4 text-border'} aria-hidden="true" />
                        ))}
                      </p>
                      {review.comment && <p className="mt-2 text-muted-foreground">{review.comment}</p>}
                    </li>
                  )
                })}
              </ul>
              {visible < reviews.length && (
                <Button variant="outline" className="mt-4 w-full" onClick={() => setVisible((v) => v + PAGE)}>
                  Ver más reseñas
                </Button>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Solo escritorio: queda fija al hacer scroll */}
      <Card className={cn('hidden lg:sticky lg:block', stickyClassName)}>
        <p className="text-sm text-muted-foreground">Precio referencial por visita</p>
        <p className="font-heading text-3xl font-bold tabular-nums">{formatGs(professional.basePrice)}</p>
        <p className="mt-2 text-sm text-muted-foreground">El monto final se acuerda según el trabajo.</p>
        <LinkButton to={requestPath} size="lg" className="mt-5 w-full">
          Solicitar servicio
        </LinkButton>
        <p className="mt-3 text-center text-xs text-muted-foreground">Sin costo hasta que el trabajo esté hecho.</p>
      </Card>
    </div>
  )
}
