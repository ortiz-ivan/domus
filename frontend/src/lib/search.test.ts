import { describe, expect, it } from 'vitest'
import { createSeed } from '@/data/seed'
import { matchCategory, normalize, rankCategories } from '@/lib/search'

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
    ['necesito un albañil para el contrapiso', 'albanileria'],
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

describe('filtro de categorías', () => {
  const rank = (q: string) => rankCategories(q, categories).map((c) => c.id)

  it('sin texto muestra todas, en su orden', () => {
    expect(rank('  ')).toEqual(categories.map((c) => c.id))
  })

  it('entiende palabras a medio escribir', () => {
    expect(rank('plom')[0]).toBe('plomeria')
    expect(rank('electr')[0]).toBe('electricidad')
    expect(rank('jardi')[0]).toBe('jardineria')
  })

  it('entiende descripciones del problema, como el buscador', () => {
    expect(rank('gotea la canilla')[0]).toBe('plomeria')
    expect(rank('se trabó la cerradura')[0]).toBe('cerrajeria')
  })

  it('las palabras de relleno no hacen coincidir todo', () => {
    expect(rank('necesito una')).toEqual([])
    expect(rank('abogado')).toEqual([])
  })
})
