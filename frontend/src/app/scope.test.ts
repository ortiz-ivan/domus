import { describe, expect, it } from 'vitest'
import { enabledRoles, parseDemoScope } from '@/app/scope'

describe('alcance de la demo', () => {
  it('lee VITE_DEMO_SCOPE y por defecto publica todo', () => {
    expect(parseDemoScope('cliente')).toBe('cliente')
    expect(parseDemoScope('landing')).toBe('landing')
    expect(parseDemoScope(undefined)).toBe('full')
    expect(parseDemoScope('cualquier-cosa')).toBe('full')
  })

  it('respeta la variable anterior VITE_LANDING_ONLY', () => {
    expect(parseDemoScope(undefined, 'true')).toBe('landing')
    expect(parseDemoScope('cliente', 'true')).toBe('cliente') // la nueva manda
  })

  it('roles habilitados en cada alcance', () => {
    expect(enabledRoles('full')).toEqual(['cliente', 'profesional', 'admin'])
    expect(enabledRoles('cliente')).toEqual(['cliente'])
    expect(enabledRoles('landing')).toEqual([])
  })
})
