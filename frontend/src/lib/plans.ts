import type { RatingSummary } from '@/store/selectors'
import type { PlanId, Professional } from '@/types'

export interface Plan {
  id: PlanId
  name: string
  /** Precio mensual de ejemplo, en guaraníes (0 = gratis) */
  priceMonthly: number
  tagline: string
  benefits: string[]
  /** Etiqueta en las tarjetas del profesional (el plan básico no lleva) */
  badge?: string
}

/** Planes de membresía. Los precios son de ejemplo para la demo: no se cobra nada. */
export const PLANS: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    priceMonthly: 0,
    tagline: 'Para empezar a recibir trabajos.',
    benefits: ['Perfil en tu categoría', 'Solicitudes ilimitadas', 'Cobro seguro dentro de la app', 'Reseñas de tus clientes'],
  },
  {
    id: 'destacado',
    name: 'Destacado',
    priceMonthly: 99000,
    tagline: 'Más visibilidad en tu categoría.',
    benefits: ['Todo lo del plan Básico', 'Insignia "Destacado" en tu perfil', 'Aparecés antes que los perfiles básicos'],
    badge: 'Destacado',
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 199000,
    tagline: 'Máxima exposición en Domus.',
    benefits: ['Todo lo del plan Destacado', 'Insignia "Premium"', 'Primero en tu categoría', 'Aparecés en los destacados de la portada'],
    badge: 'Premium',
  },
]

export const planOf = (id: PlanId): Plan => PLANS.find((p) => p.id === id)!

/** Mayor número = más visibilidad */
export const planRank = (id: PlanId): number => PLANS.findIndex((p) => p.id === id)

interface Ranked {
  professional: Professional
  rating: RatingSummary
}

/** Orden "Recomendados": primero por plan (Premium, Destacado, Básico), después por calificación */
export function compareRecommended(a: Ranked, b: Ranked): number {
  return (
    planRank(b.professional.plan) - planRank(a.professional.plan) ||
    b.rating.average - a.rating.average ||
    b.rating.count - a.rating.count
  )
}
