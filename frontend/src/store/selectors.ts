import { useMemo } from 'react'
import { useDemoStore } from '@/store/demo'
import { useSessionStore } from '@/store/session'
import type { Professional, Review } from '@/types'

export function useCurrentUser() {
  const userId = useSessionStore((s) => s.userId)
  return useDemoStore((s) => s.users.find((u) => u.id === userId) ?? null)
}

/** Perfil profesional del usuario logueado (solo para el rol profesional) */
export function useCurrentProfessional(): Professional | null {
  const userId = useSessionStore((s) => s.userId)
  return useDemoStore((s) => s.professionals.find((p) => p.userId === userId) ?? null)
}

export interface RatingSummary {
  average: number
  count: number
}

/** Promedio combinando las reseñas históricas del profesional con las creadas en la demo */
export function ratingOf(reviews: Review[], professional: Professional): RatingSummary {
  const own = reviews.filter((r) => r.professionalId === professional.id)
  const count = professional.pastRating.count + own.length
  if (count === 0) return { average: 0, count: 0 }
  const total = professional.pastRating.average * professional.pastRating.count + own.reduce((sum, r) => sum + r.rating, 0)
  return { average: Math.round((total / count) * 10) / 10, count }
}

/** Búsqueda por id de categorías, profesionales y usuarios (para mostrar nombres en listas) */
export function useDirectory() {
  const categories = useDemoStore((s) => s.categories)
  const professionals = useDemoStore((s) => s.professionals)
  const users = useDemoStore((s) => s.users)
  return useMemo(
    () => ({
      category: (id: string) => categories.find((c) => c.id === id),
      professional: (id: string) => professionals.find((p) => p.id === id),
      user: (id: string) => users.find((u) => u.id === id),
    }),
    [categories, professionals, users],
  )
}
