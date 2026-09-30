import { describe, expect, it } from 'vitest'
import { documentTitle, isRoleSection, pageTitleFrom } from './pageTitle'

describe('documentTitle', () => {
  it('pone primero la pantalla y deja la marca al final', () => {
    expect(documentTitle()).toBe('Domus')
    expect(documentTitle({ page: 'Para profesionales' })).toBe('Para profesionales · Domus')
    expect(documentTitle({ page: 'Mis solicitudes', section: 'Cliente' })).toBe('Mis solicitudes · Cliente · Domus')
  })

  it('antepone los pendientes solo si hay', () => {
    expect(documentTitle({ page: 'Solicitudes nuevas', section: 'Profesional', pending: 2 })).toBe('(2) Solicitudes nuevas · Profesional · Domus')
    expect(documentTitle({ page: 'Inicio', section: 'Cliente', pending: 0 })).toBe('Inicio · Cliente · Domus')
  })
})

describe('pageTitleFrom', () => {
  it('usa el título de la ruta más específica', () => {
    const matches = [{ handle: undefined }, { handle: { title: 'Mis solicitudes' } }, { handle: { title: 'Seguimiento' } }]
    expect(pageTitleFrom(matches)).toBe('Seguimiento')
  })

  it('sube hasta encontrar una ruta con título', () => {
    expect(pageTitleFrom([{ handle: { title: 'Ingresar' } }, { handle: {} }])).toBe('Ingresar')
    expect(pageTitleFrom([{ handle: undefined }])).toBeUndefined()
  })
})

describe('isRoleSection', () => {
  it('reconoce las secciones de cada rol y nada más', () => {
    expect(isRoleSection('/cliente')).toBe(true)
    expect(isRoleSection('/profesional/solicitudes/r-1')).toBe(true)
    expect(isRoleSection('/admin/finanzas')).toBe(true)
    expect(isRoleSection('/')).toBe(false)
    expect(isRoleSection('/clientes')).toBe(false)
    expect(isRoleSection('/profesionales/p-1')).toBe(false)
  })
})
