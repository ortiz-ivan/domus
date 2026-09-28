import { describe, expect, it } from 'vitest'
import { loginPath } from '@/app/paths'
import { withService } from '@/app/serviceParam'

describe('withService', () => {
  it('sin trabajo deja la ruta igual', () => {
    expect(withService('/servicios/plomeria', null)).toBe('/servicios/plomeria')
    expect(withService('/servicios/plomeria', '')).toBe('/servicios/plomeria')
  })

  it('agrega el trabajo con ? o & según la ruta', () => {
    expect(withService('/servicios/plomeria', 'Pérdidas de agua')).toBe('/servicios/plomeria?trabajo=P%C3%A9rdidas%20de%20agua')
    expect(withService('/cliente/solicitudes/nueva?profesional=p-1', 'Destapar cañerías')).toBe(
      '/cliente/solicitudes/nueva?profesional=p-1&trabajo=Destapar%20ca%C3%B1er%C3%ADas',
    )
  })

  it('sobrevive al paso por /ingresar y vuelve intacto', () => {
    const next = withService('/cliente/solicitudes/nueva?profesional=p-1', 'Destapar cañerías')
    const url = new URL(loginPath({ rol: 'cliente', next }), 'http://localhost')
    const back = new URL(url.searchParams.get('next')!, 'http://localhost')
    expect(back.searchParams.get('profesional')).toBe('p-1')
    expect(back.searchParams.get('trabajo')).toBe('Destapar cañerías')
  })
})
