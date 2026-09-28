import { beforeEach, describe, expect, it } from 'vitest'
import { compareRecommended, planOf, PLANS } from '@/lib/plans'
import { useDemoStore } from '@/store/demo'
import { ratingOf } from '@/store/selectors'

const store = () => useDemoStore.getState()
/** Plomeros en orden "Recomendados", como los ve el cliente */
const plumbers = () =>
  store()
    .professionals.filter((p) => p.categoryIds.includes('plomeria'))
    .map((p) => ({ professional: p, rating: ratingOf(store().reviews, p) }))
    .sort(compareRecommended)
    .map((x) => x.professional.name)

beforeEach(() => {
  localStorage.clear()
  store().resetDemo()
})

describe('membresías', () => {
  it('los planes van de menor a mayor visibilidad, y solo los pagos llevan insignia', () => {
    expect(PLANS.map((p) => p.id)).toEqual(['basico', 'destacado', 'premium'])
    expect(planOf('basico').priceMonthly).toBe(0)
    expect(planOf('basico').badge).toBeUndefined()
    expect(planOf('destacado').badge).toBe('Destacado')
    expect(planOf('premium').priceMonthly).toBeGreaterThan(planOf('destacado').priceMonthly)
  })

  const position = (name: string) => plumbers().indexOf(name)

  it('escenario de la demo: Carlos arranca en Básico, detrás de Ramón (Destacado)', () => {
    expect(store().professionals.find((p) => p.id === 'p-1')?.plan).toBe('basico')
    expect(position('Ramón Giménez')).toBeLessThan(position('Carlos Benítez'))
  })

  it('al pasar a Premium, Carlos queda primero en Plomería', () => {
    store().setProfessionalPlan('p-1', 'premium')
    expect(plumbers()[0]).toBe('Carlos Benítez')
    store().setProfessionalPlan('p-1', 'basico')
    expect(position('Ramón Giménez')).toBeLessThan(position('Carlos Benítez'))
  })

  it('a igual plan decide la calificación', () => {
    store().setProfessionalPlan('p-2', 'basico') // Ramón 4.6, Carlos 4.8
    expect(position('Carlos Benítez')).toBeLessThan(position('Ramón Giménez'))
  })

  it('reiniciar la demo vuelve a los planes iniciales', () => {
    store().setProfessionalPlan('p-1', 'premium')
    store().resetDemo()
    expect(store().professionals.find((p) => p.id === 'p-1')?.plan).toBe('basico')
  })
})
