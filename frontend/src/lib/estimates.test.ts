import { describe, expect, it } from 'vitest'
import { createSeed } from '@/data/seed'
import { estimateFor, formatRange } from './estimates'

describe('estimateFor', () => {
  it('tiene referencia para cada trabajo de las categorías', () => {
    for (const category of createSeed().categories) {
      for (const service of category.services) expect(estimateFor(150_000, service), service).not.toBeNull()
    }
  })

  it('escala con el precio de visita y redondea a 10.000', () => {
    expect(estimateFor(150_000, 'Destapar cañerías')).toEqual({ min: 120_000, max: 230_000 })
    expect(estimateFor(100_000, 'Destapar cañerías')).toEqual({ min: 80_000, max: 150_000 })
  })

  it('el máximo siempre supera al mínimo, aun con precios bajos', () => {
    const range = estimateFor(20_000, 'Copias de llaves')!
    expect(range.min).toBe(10_000)
    expect(range.max).toBeGreaterThan(range.min)
  })

  it('no estima trabajos sin referencia ("Otro problema")', () => {
    expect(estimateFor(150_000, 'Arreglar persiana')).toBeNull()
  })
})

describe('formatRange', () => {
  it('muestra ambos extremos en guaraníes', () => {
    expect(formatRange({ min: 120_000, max: 230_000 }).replace(/\s/g, ' ')).toBe('Gs. 120.000 – Gs. 230.000')
  })
})
