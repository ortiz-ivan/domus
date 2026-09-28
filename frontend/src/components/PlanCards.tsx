import { Check, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { formatGs } from '@/lib/format'
import { PLANS, type Plan } from '@/lib/plans'
import type { PlanId } from '@/types'

interface PlanCardsProps {
  /** Plan que se muestra resaltado ("Más elegido" en la landing, el plan elegido en la app) */
  highlighted?: PlanId
  /** Plan activo del profesional (solo en la app) */
  current?: PlanId
  /** Botón de cada tarjeta */
  action: (plan: Plan) => ReactNode
}

/** Tarjetas de los planes de membresía: las usan la landing para profesionales y la pantalla Membresía */
export function PlanCards({ highlighted = 'destacado', current, action }: PlanCardsProps) {
  return (
    <ul className="grid gap-4 md:grid-cols-3 md:items-stretch">
      {PLANS.map((plan) => {
        const isHighlighted = plan.id === highlighted
        const isCurrent = plan.id === current
        return (
          <li
            key={plan.id}
            className={cn(
              'relative flex flex-col rounded-2xl border bg-card p-6',
              isHighlighted ? 'border-primary shadow-lg ring-1 ring-primary md:-my-2 md:py-8' : 'border-border',
            )}
          >
            {(isCurrent || (isHighlighted && !current)) && (
              <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
                {isCurrent ? <Check className="size-3.5" aria-hidden="true" /> : <Sparkles className="size-3.5 text-accent" aria-hidden="true" />}
                {isCurrent ? 'Tu plan actual' : 'Más elegido'}
              </span>
            )}
            <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
            <p className="mt-5">
              <span className="font-heading text-3xl font-bold">{plan.priceMonthly === 0 ? 'Gratis' : formatGs(plan.priceMonthly)}</span>
              {plan.priceMonthly > 0 && <span className="text-sm text-muted-foreground"> / mes</span>}
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {plan.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-status-done" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-6">{action(plan)}</div>
          </li>
        )
      })}
    </ul>
  )
}
