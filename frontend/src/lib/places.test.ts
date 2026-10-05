import { describe, expect, it } from 'vitest'
import { blockRoute, etaMinutes, formatKm, pointAlong, roadKm, routeKm, routeUntil, straightKm } from '@/lib/geo'
import { clientHome, locateAddress, minutesLeft, planTrip, professionalBase, routeTo, tripProgress } from '@/lib/places'
import { createSeed } from '@/data/seed'
import { demoProfessionals } from '@/store/selectors'
import type { LatLng } from '@/types'

const MARIA: LatLng = [-25.28643, -57.62309]

describe('distancias y tiempos simulados', () => {
  it('mide en línea recta y estima por calles', () => {
    // Un grado de latitud son unos 111 km
    expect(straightKm([-25, -57], [-24, -57])).toBeCloseTo(111.2, 0)
    expect(roadKm([-25, -57], [-24, -57])).toBeCloseTo(111.2 * 1.35, 0)
  })

  it('recorre una ruta por fracción de su largo', () => {
    const route: LatLng[] = [[0, 0], [0, 1], [1, 1]]
    expect(pointAlong(route, 0)).toEqual([0, 0])
    expect(pointAlong(route, 0.25)[1]).toBeCloseTo(0.5, 2)
    expect(pointAlong(route, 1)).toEqual([1, 1])
    // Lo recorrido termina donde está el que viaja
    expect(routeUntil(route, 0.75)).toHaveLength(3)
    expect(routeUntil(route, 0.75)[2][0]).toBeCloseTo(0.5, 2)
  })

  it('la ruta por cuadras une los dos puntos con tramos rectos', () => {
    const route = blockRoute([0, 0], [1, 1])
    expect(route[0]).toEqual([0, 0])
    expect(route.at(-1)).toEqual([1, 1])
    for (let i = 1; i < route.length; i++) expect(route[i][0] === route[i - 1][0] || route[i][1] === route[i - 1][1]).toBe(true)
  })

  it('estima los minutos según la hora (más lento en hora pico) y nunca menos de 3', () => {
    expect(etaMinutes(6, new Date('2030-01-10T11:00:00'))).toBe(15) // 24 km/h
    expect(etaMinutes(6, new Date('2030-01-10T18:00:00'))).toBe(23) // 16 km/h
    expect(etaMinutes(0.2)).toBe(3)
  })

  it('formatea la distancia', () => {
    expect(formatKm(0.42)).toBe('400 m')
    expect(formatKm(4.25)).toMatch(/^4,[23] km$/)
    expect(formatKm(12.3)).toBe('12 km')
  })
})

describe('lugares de la demo', () => {
  it('ubica la dirección de María (con o sin "casi Brasil") y deja fijas las desconocidas', () => {
    expect(locateAddress('Av. España 1234', 'Asunción')).toEqual(MARIA)
    expect(locateAddress('Av. España 1234, casi Brasil', 'Asunción')).toEqual(MARIA)
    expect(clientHome({ address: 'Av. España 1234, casi Brasil', city: 'Asunción' })).toEqual(MARIA)
    expect(clientHome({ city: 'Asunción' })).toBeNull()
    const otra = locateAddress('Calle Palma 540', 'Asunción')
    expect(locateAddress('Calle Palma 540', 'Asunción')).toEqual(otra)
    // Cerca del centro de su ciudad
    expect(straightKm(otra, [-25.2823, -57.635])).toBeLessThanOrEqual(2.6)
  })

  it('Carlos va a lo de María por la ruta real guardada; el resto, por cuadras', () => {
    const carlos = { id: 'p-1', city: 'Asunción' }
    const real = routeTo(carlos, MARIA)
    expect(real.length).toBeGreaterThan(10)
    expect(real[0]).toEqual(professionalBase(carlos))
    expect(routeKm(real)).toBeCloseTo(6.7, 0)

    const otro = routeTo({ id: 'p-2', city: 'Luque' }, MARIA)
    expect(otro).toHaveLength(5)
  })

  it('cada profesional con el que se puede ingresar (uno por categoría) tiene su ruta real hasta lo de María', () => {
    const { categories, professionals } = createSeed()
    const pros = demoProfessionals(categories, professionals)
    expect(pros).toHaveLength(categories.length)
    for (const { professional } of pros) {
      const route = routeTo(professional, MARIA)
      expect(route.length, professional.name).toBeGreaterThan(5)
      expect(route[0]).toEqual(professionalBase(professional))
      expect(route.at(-1)).toEqual(MARIA)
    }
  })

  it('planifica el viaje acelerado y calcula el avance y los minutos que faltan', () => {
    const start = new Date('2030-01-10T11:00:00')
    const trip = planTrip(routeTo({ id: 'p-1', city: 'Asunción' }, MARIA), start)
    expect(trip.distanceKm).toBeCloseTo(6.7, 0)
    expect(trip.etaMinutes).toBe(17)
    // La demo no hace esperar: entre 20 y 45 segundos
    expect(trip.durationMs).toBeGreaterThanOrEqual(20000)
    expect(trip.durationMs).toBeLessThanOrEqual(45000)

    const t0 = start.getTime()
    expect(tripProgress(trip, t0)).toBe(0)
    expect(tripProgress(trip, t0 + trip.durationMs / 2)).toBeCloseTo(0.5)
    expect(tripProgress(trip, t0 + trip.durationMs * 2)).toBe(1)
    expect(minutesLeft(trip, 0)).toBe(17)
    expect(minutesLeft(trip, 0.5)).toBe(9)
    expect(minutesLeft(trip, 1)).toBe(0)
    // Si avisó que llegó, el viaje terminó aunque quede tiempo
    expect(tripProgress({ ...trip, arrivedAt: start.toISOString() }, t0)).toBe(1)
  })
})
