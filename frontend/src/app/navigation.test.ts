import { describe, expect, it } from 'vitest'
import { isNavItemActive, NAVIGATION } from '@/app/navigation'
import type { Role } from '@/types'

/** Etiqueta del ítem activo del menú para una ruta */
const activeLabel = (role: Role, pathname: string) =>
  NAVIGATION[role].filter((item) => isNavItemActive(item, pathname)).map((item) => item.label)

describe('ítem activo del menú', () => {
  it.each([
    ['/cliente', 'Inicio'],
    ['/cliente/categorias', 'Categorías'],
    ['/cliente/categorias/plomeria', 'Categorías'],
    ['/cliente/profesionales/p-1', 'Categorías'],
    ['/cliente/solicitudes/nueva', 'Categorías'],
    ['/cliente/solicitudes', 'Mis solicitudes'],
    ['/cliente/solicitudes/r-2', 'Mis solicitudes'],
    ['/cliente/solicitudes/r-2/pago', 'Mis solicitudes'],
  ])('cliente en %s → %s', (pathname, label) => {
    expect(activeLabel('cliente', pathname)).toEqual([label])
  })

  it.each([
    ['/profesional', 'Inicio'],
    ['/profesional/solicitudes/r-4', 'Solicitudes'],
    ['/profesional/trabajos/r-5', 'Trabajos'],
    ['/profesional/perfil', 'Perfil'],
  ])('profesional en %s → %s', (pathname, label) => {
    expect(activeLabel('profesional', pathname)).toEqual([label])
  })

  it('un prefijo parecido no activa el ítem', () => {
    expect(activeLabel('cliente', '/cliente/categoriasx')).toEqual([])
  })
})
