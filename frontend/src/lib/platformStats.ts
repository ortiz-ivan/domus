import { useMemo } from 'react'
import type { DemoData } from '@/data/seed'
import { ratingOf } from '@/store/selectors'
import { useDemoStore } from '@/store/demo'

export interface PlatformStats {
  professionals: number
  verified: number
  /** Promedio ponderado por cantidad de reseñas, con un decimal */
  averageRating: number
  reviews: number
  jobs: number
}

/** Cifras de la plataforma calculadas desde los datos, para que la portada no diga algo que la demo contradice */
export function platformStats({ professionals, reviews }: Pick<DemoData, 'professionals' | 'reviews'>): PlatformStats {
  const ratings = professionals.map((p) => ratingOf(reviews, p))
  const reviewCount = ratings.reduce((sum, r) => sum + r.count, 0)
  const weighted = ratings.reduce((sum, r) => sum + r.average * r.count, 0)
  return {
    professionals: professionals.length,
    verified: professionals.filter((p) => p.verified).length,
    averageRating: reviewCount ? Math.round((weighted / reviewCount) * 10) / 10 : 0,
    reviews: reviewCount,
    jobs: professionals.reduce((sum, p) => sum + p.jobsCompleted, 0),
  }
}

export function usePlatformStats(): PlatformStats {
  const professionals = useDemoStore((s) => s.professionals)
  const reviews = useDemoStore((s) => s.reviews)
  return useMemo(() => platformStats({ professionals, reviews }), [professionals, reviews])
}

/** "+6.300": redondeado hacia abajo a la centena, para una cifra de marketing que no exagera */
export function roundedDown(value: number): string {
  if (value < 100) return String(value)
  return `+${(Math.floor(value / 100) * 100).toLocaleString('es-PY')}`
}
