import { BadgeCheck, Briefcase, Clock, MapPin, Star, Zap } from 'lucide-react'
import { useState } from 'react'
import { CAN_REQUEST } from '@/app/config'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button, LinkButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { RatingStars } from '@/components/ui/RatingStars'
import { cn } from '@/lib/cn'
import { estimateFor, formatRange } from '@/lib/estimates'
import { formatDate, formatGs } from '@/lib/format'
import { formatResponseTime, isFastResponder } from '@/lib/responseTime'
import { useDemoStore } from '@/store/demo'
import { ratingOf, useDirectory } from '@/store/selectors'
import type { Professional } from '@/types'

const PAGE = 4

/** En la vista previa (VITE_DEMO_SCOPE=cliente) todavía no se pueden solicitar servicios */
const PREVIEW_NOTE = 'Muy pronto vas a poder solicitar servicios desde Domus.'

function RequestButton({ to, className }: { to: string; className?: string }) {
  if (CAN_REQUEST) {
    return (
      <LinkButton to={to} size="lg" className={className}>
        Solicitar servicio
      </LinkButton>
    )
  }
  return (
    <Button size="lg" className={className} disabled aria-describedby="solicitud-proximamente">
      Solicitar servicio
    </Button>
  )
}

interface ProfessionalProfileProps {
  professional: Professional
  /** A dónde lleva "Solicitar servicio": la solicitud (cliente logueado) o el ingreso (perfil público) */
  requestPath: string
  /** Separación de la columna fija con el borde superior (el perfil público tiene header fijo) */
  stickyClassName?: string
  /** Trabajo elegido antes de llegar al perfil: se resalta en los precios estimados */
  service?: string | null
}

/** Foto ampliada de una reseña */
interface OpenPhoto {
  src: string
  author: string
}

/** Perfil del profesional: lo usan la app del cliente y el perfil público de la landing */
export function ProfessionalProfile({ professional, requestPath, stickyClassName = 'lg:top-8', service }: ProfessionalProfileProps) {
  const allReviews = useDemoStore((s) => s.reviews)
  const dir = useDirectory()
  const [visible, setVisible] = useState(PAGE)
  const [openPhoto, setOpenPhoto] = useState<OpenPhoto | null>(null)
  const fast = isFastResponder(professional.responseMinutes)

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
              { icon: Star, label: 'Experiencia', value: `${professional.yearsExperience} años` },
              { icon: MapPin, label: 'Zona', value: professional.city },
              { icon: fast ? Zap : Clock, label: 'Responde en', value: formatResponseTime(professional.responseMinutes) },
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
            <RequestButton to={requestPath} />
          </div>
          {!CAN_REQUEST && <p className="mt-3 text-sm text-muted-foreground lg:hidden">{PREVIEW_NOTE}</p>}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Sobre {professional.name.split(' ')[0]}</h2>
          <p className="mt-2 text-muted-foreground">{professional.bio}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Precios estimados</h2>
          <p className="mt-1 text-sm text-muted-foreground">Según trabajos similares. El monto final se acuerda con {professional.name.split(' ')[0]} al ver el trabajo.</p>
          <dl className="mt-4 divide-y divide-border">
            {professional.categoryIds
              .flatMap((id) => dir.category(id)?.services ?? [])
              .map((name) => {
                const estimate = estimateFor(professional.basePrice, name)
                if (!estimate) return null
                const selected = name === service
                return (
                  <div
                    key={name}
                    className={cn('flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3', selected && '-mx-3 rounded-lg bg-accent-soft px-3')}
                  >
                    <dt className={cn(selected && 'font-semibold')}>
                      {name}
                      {selected && <span className="sr-only"> (el trabajo que elegiste)</span>}
                    </dt>
                    <dd className="font-semibold tabular-nums">{formatRange(estimate)}</dd>
                  </div>
                )
              })}
          </dl>
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
                  const author = `${first}${last ? ` ${last[0]}.` : ''}`
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
                      {review.photos && review.photos.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Fotos de ${author}`}>
                          {review.photos.map((src, i) => (
                            <li key={src.slice(-40) + i}>
                              <button
                                type="button"
                                onClick={() => setOpenPhoto({ src, author })}
                                className="block overflow-hidden rounded-lg border border-border transition-opacity duration-150 hover:opacity-90"
                              >
                                <img src={src} alt={`Foto ${i + 1} del trabajo, ampliar`} loading="lazy" className="size-20 object-cover" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
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

      <Dialog open={openPhoto !== null} onClose={() => setOpenPhoto(null)} title={`Foto de ${openPhoto?.author ?? ''}`}>
        {openPhoto && <img src={openPhoto.src} alt={`Trabajo de ${professional.name.split(' ')[0]}, foto de ${openPhoto.author}`} className="w-full rounded-lg" />}
      </Dialog>

      {/* Solo escritorio: queda fija al hacer scroll */}
      <Card className={cn('hidden lg:sticky lg:block', stickyClassName)}>
        <p className="text-sm text-muted-foreground">Precio referencial por visita</p>
        <p className="font-heading text-3xl font-bold tabular-nums">{formatGs(professional.basePrice)}</p>
        <p className="mt-2 text-sm text-muted-foreground">El monto final se acuerda según el trabajo.</p>
        <RequestButton to={requestPath} className="mt-5 w-full" />
        <p id={CAN_REQUEST ? undefined : 'solicitud-proximamente'} className="mt-3 text-center text-xs text-muted-foreground">
          {CAN_REQUEST ? 'Sin costo hasta que el trabajo esté hecho.' : PREVIEW_NOTE}
        </p>
      </Card>
    </div>
  )
}
