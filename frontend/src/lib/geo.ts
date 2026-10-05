import type { LatLng } from '@/types'

/*
 * Distancias y tiempos de viaje simulados, sin servicios externos de mapas:
 * línea recta entre dos puntos, corregida por lo que alargan las calles, y una velocidad urbana promedio.
 */

const EARTH_RADIUS_KM = 6371
/** Cuánto más largo es ir por calles que en línea recta (valor típico en ciudades) */
export const ROAD_FACTOR = 1.35

const rad = (deg: number) => (deg * Math.PI) / 180

/** Distancia en línea recta (fórmula del haversine) */
export function straightKm([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): number {
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))
}

/** Distancia estimada por calles, para cuando no hay una ruta dibujada */
export const roadKm = (a: LatLng, b: LatLng) => straightKm(a, b) * ROAD_FACTOR

/** Largo de una ruta (suma de sus tramos) */
export function routeKm(route: LatLng[]): number {
  let km = 0
  for (let i = 1; i < route.length; i++) km += straightKm(route[i - 1], route[i])
  return km
}

/** Parte ya recorrida de la ruta al avanzar una fracción (0 a 1) de su largo: termina donde está el que viaja */
export function routeUntil(route: LatLng[], fraction: number): LatLng[] {
  if (route.length === 0) throw new Error('Ruta vacía')
  const target = Math.min(Math.max(fraction, 0), 1) * routeKm(route)
  let walked = 0
  for (let i = 1; i < route.length; i++) {
    const leg = straightKm(route[i - 1], route[i])
    if (walked + leg >= target && leg > 0) {
      const t = (target - walked) / leg
      const [lat1, lng1] = route[i - 1]
      const [lat2, lng2] = route[i]
      return [...route.slice(0, i), [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t]]
    }
    walked += leg
  }
  return route
}

/** Punto de la ruta al recorrer una fracción (0 a 1) de su largo */
export const pointAlong = (route: LatLng[], fraction: number): LatLng => routeUntil(route, fraction).at(-1) as LatLng

/** Ruta de reemplazo con forma de recorrido por cuadras (tramos rectos), cuando no hay una real guardada */
export function blockRoute([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): LatLng[] {
  const dLat = lat2 - lat1
  const dLng = lng2 - lng1
  return [
    [lat1, lng1],
    [lat1, lng1 + dLng * 0.4],
    [lat1 + dLat * 0.6, lng1 + dLng * 0.4],
    [lat1 + dLat * 0.6, lng2],
    [lat2, lng2],
  ]
}

/** Velocidad urbana promedio (km/h): más lenta en las horas pico */
export function urbanSpeedKmh(at: Date): number {
  const h = at.getHours()
  return (h >= 7 && h < 9) || (h >= 17 && h < 19) ? 16 : 24
}

/** Minutos de viaje estimados, como los mostraría una app de transporte (mínimo 3) */
export function etaMinutes(km: number, at = new Date()): number {
  return Math.max(3, Math.round((km / urbanSpeedKmh(at)) * 60))
}

/** "850 m", "4,2 km" */
export function formatKm(km: number): string {
  if (km < 1) return `${Math.max(100, Math.round((km * 1000) / 50) * 50)} m`
  return `${km.toLocaleString('es-PY', { maximumFractionDigits: km < 10 ? 1 : 0 })} km`
}
