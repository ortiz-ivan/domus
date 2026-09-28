import { describe, expect, it } from 'vitest'
import { createSeed } from '@/data/seed'
import { matchCategory, normalize } from '@/lib/search'

const { categories } = createSeed()
const match = (q: string) => matchCategory(q, categories)?.id ?? null

describe('buscador del landing', () => {
  it.each([
    ['pierde agua el inodoro', 'plomeria'],
    ['Se rompió el caño de la cocina', 'plomeria'],
    ['no enfría el aire', 'aire'],
    ['instalar ventilador de techo', 'electricidad'],
    ['saltó la llave térmica', 'electricidad'],
    ['quiero pintar el living', 'pintura'],
    ['me quedé afuera, puerta trabada', 'cerrajeria'],
    ['cortar el pasto del patio', 'jardineria'],
    ['limpieza después de la mudanza', 'limpieza'],
    ['arreglar la puerta del placard', 'carpinteria'],
  ])('"%s" → %s', (query, expected) => {
    expect(match(query)).toBe(expected)
  })

  it('sin coincidencias devuelve null', () => {
    expect(match('')).toBeNull()
    expect(match('necesito un abogado')).toBeNull()
  })

  it('ignora mayúsculas y tildes', () => {
    expect(normalize('  Cañería ELÉCTRICA ')).toBe('caneria electrica')
  })
})
