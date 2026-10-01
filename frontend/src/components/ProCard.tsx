import { BadgeCheck, Briefcase, Clock, MapPin, Sparkles, Star, Zap } from 'lucide-react'
import { Link } from 'react-router'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useBackHere } from '@/app/useBackHere'
import { RatingStars } from '@/components/ui/RatingStars'
import { cn } from '@/lib/cn'
import { estimateFor, formatRange } from '@/lib/estimates'
import { formatGs } from '@/lib/format'
import { planOf } from '@/lib/plans'
import { formatResponseTime, isFastResponder } from '@/lib/responseTime'
import type { RatingSummary } from '@/store/selectors'
import type { Professional } from '@/types'

interface ProCardProps {
  professional: Professional
  rating: RatingSummary
  /** Nombre de la categoría principal a mostrar */
  categoryName?: string
  to: string
  /** compact: una fila, para listas dentro de otros paneles */
  variant?: 'card' | 'compact'
  /** Trabajo elegido: la tarjeta muestra su presupuesto estimado en lugar del precio de visita */
  service?: string | null
}

/** Insignia de la membresía: Premium en dorado lleno, Destacado en dorado suave */
function PlanBadge({ professional }: { professional: Professional }) {
  const badge = planOf(professional.plan).badge
  if (!badge) return null
  return (
    <Badge tone="accent" className={professional.plan === 'premium' ? 'bg-accent text-on-accent' : undefined}>
      <Sparkles className="size-3.5" aria-hidden="true" />
      {badge}
    </Badge>
  )
}

function VerifiedIcon() {
  return (
    <BadgeCheck
      className="ml-1 inline size-4 -translate-y-px align-middle text-status-accepted"
      aria-label="Verificado"
      role="img"
    />
  )
}

/** "Responde en 15 min": el rayo y el color marcan a los que responden rápido */
function ResponseTime({ minutes, className }: { minutes: number; className?: string }) {
  const fast = isFastResponder(minutes)
  const Icon = fast ? Zap : Clock
  return (
    <p className={cn('flex items-center gap-1.5 text-sm', fast ? 'font-medium text-status-done' : 'text-muted-foreground', className)}>
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      Responde en {formatResponseTime(minutes)}
    </p>
  )
}

/** Tarjeta de profesional: toda la tarjeta es un único link (un solo destino, más fácil de tocar) */
export function ProCard({ professional, rating, categoryName, to, variant = 'card', service }: ProCardProps) {
  const estimate = service ? estimateFor(professional.basePrice, service) : null
  const backHere = useBackHere()

  if (variant === 'compact') {
    return (
      <Link
        to={to}
        state={backHere}
        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors duration-150 hover:border-accent"
      >
        <Avatar name={professional.name} src={professional.photo} />
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm leading-snug font-semibold">
            {professional.name}
            {professional.verified && <VerifiedIcon />}
          </p>
          {professional.plan !== 'basico' && (
            <p className="mt-0.5">
              <PlanBadge professional={professional} />
            </p>
          )}
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            <RatingStars value={rating.average} count={rating.count} />
            <span>· {professional.jobsCompleted} trabajos</span>
          </p>
        </div>
        <p className="shrink-0 text-right text-xs text-muted-foreground">
          Desde
          <span className="block font-heading text-sm font-bold text-foreground tabular-nums">{formatGs(professional.basePrice)}</span>
        </p>
      </Link>
    )
  }

  return (
    <Link
      to={to}
      state={backHere}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors duration-150 hover:border-accent"
    >
      <div className="flex items-start gap-3">
        <Avatar name={professional.name} src={professional.photo} size="lg" className="size-12 text-base" />
        <div className="min-w-0 flex-1">
          <p className="font-heading leading-snug font-semibold [overflow-wrap:anywhere]">
            {professional.name}
            {professional.verified && <VerifiedIcon />}
          </p>
          {categoryName && <p className="text-sm text-muted-foreground">{categoryName}</p>}
          <RatingStars value={rating.average} count={rating.count} className="mt-1" />
          <ResponseTime minutes={professional.responseMinutes} className="mt-1" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <PlanBadge professional={professional} />
        {/* Se gana con la calificación: estilo neutro para no confundirla con las insignias pagas (doradas) */}
        {rating.average >= 4.8 && rating.count > 0 && (
          <Badge className="border border-border bg-card text-foreground">
            <Star className="size-3.5 fill-accent text-accent" aria-hidden="true" />
            Top Domus
          </Badge>
        )}
        <Badge>
          <Briefcase className="size-3.5" aria-hidden="true" />
          {professional.jobsCompleted} trabajos
        </Badge>
        <Badge>
          <MapPin className="size-3.5" aria-hidden="true" />
          {professional.city}
        </Badge>
      </div>

      <p className="mt-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{professional.bio}</p>

      <div className="mt-4 flex items-end justify-between gap-2 border-t border-border pt-4">
        {estimate ? (
          <p className="text-sm text-muted-foreground">
            Estimado para este trabajo
            <span className="block font-heading font-bold text-foreground tabular-nums">{formatRange(estimate)}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Desde <span className="block font-heading text-lg font-bold text-foreground tabular-nums">{formatGs(professional.basePrice)}</span>
          </p>
        )}
        <span className="text-sm font-semibold text-primary underline-offset-4 group-hover:underline">Ver perfil</span>
      </div>
    </Link>
  )
}
