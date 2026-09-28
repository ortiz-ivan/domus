import { describe, expect, it } from 'vitest'
import { createSeed } from '@/data/seed'
import { platformStats, roundedDown } from '@/lib/platformStats'
import { ratingOf } from '@/store/selectors'

describe('cifras de la plataforma', () => {
  const data = createSeed()
  const stats = platformStats(data)

  it('coinciden con los datos de la demo', () => {
    expect(stats.professionals).toBe(data.professionals.length)
    expect(stats.verified).toBe(data.professionals.filter((p) => p.verified).length)
    expect(stats.jobs).toBe(data.professionals.reduce((s, p) => s + p.jobsCompleted, 0))
    expect(stats.reviews).toBe(data.professionals.reduce((s, p) => s + ratingOf(data.reviews, p).count, 0))
  })

  it('el promedio queda entre la peor y la mejor calificación', () => {
    const averages = data.professionals.map((p) => ratingOf(data.reviews, p).average)
    expect(stats.averageRating).toBeGreaterThanOrEqual(Math.min(...averages))
    expect(stats.averageRating).toBeLessThanOrEqual(Math.max(...averages))
  })

  it('sin reseñas el promedio es 0', () => {
    expect(platformStats({ professionals: [], reviews: [] }).averageRating).toBe(0)
  })

  it('redondea hacia abajo, nunca exagera', () => {
    expect(roundedDown(78)).toBe('78')
    expect(roundedDown(6399)).toBe('+6.300')
    expect(roundedDown(100)).toBe('+100')
  })
})
