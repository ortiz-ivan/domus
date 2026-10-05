import { blockRoute, etaMinutes, roadKm, routeKm, straightKm } from '@/lib/geo'
import { normalize } from '@/lib/search'
import type { LatLng, Professional, Trip, User } from '@/types'

/*
 * Ubicaciones de la demo. No hay geocodificación real: las direcciones conocidas tienen sus
 * coordenadas a mano y el resto cae en un punto fijo (sale de un hash) cerca del centro de su ciudad.
 */

const CITY_CENTERS: Record<string, LatLng> = {
  Asunción: [-25.2823, -57.635],
  Luque: [-25.2667, -57.4872],
  'San Lorenzo': [-25.34, -57.5089],
  Lambaré: [-25.3468, -57.606],
  'Fernando de la Mora': [-25.32, -57.54],
}

/** Casa de María (Av. España casi Brasil), ubicada con OpenStreetMap */
const MARIA_HOME: LatLng = [-25.28643, -57.62309]

const KNOWN_ADDRESSES: { prefix: string; city: string; location: LatLng }[] = [{ prefix: 'av. espana 1234', city: 'Asunción', location: MARIA_HOME }]

/**
 * Rutas reales por calles hasta lo de María, una por cada profesional con el que se puede ingresar
 * (uno por categoría), calculadas una vez con OSRM (OpenStreetMap) y simplificadas. En la demo no se
 * consulta ningún servicio de rutas: el profesional recorre este camino guardado, que empieza en su base.
 */
const ROUTES_TO_MARIA: Record<string, LatLng[]> = {
  // Carlos, plomería (Villa Aurelia)
  'p-1': [
    [-25.30479, -57.57654], [-25.30521, -57.57675], [-25.30477, -57.578], [-25.30463, -57.57873], [-25.302, -57.57812],
    [-25.30048, -57.5815], [-25.29489, -57.57801], [-25.29003, -57.58906], [-25.28986, -57.58969], [-25.28998, -57.59204],
    [-25.29063, -57.59364], [-25.2908, -57.59439], [-25.29359, -57.60956], [-25.2938, -57.61109], [-25.2936, -57.61184],
    [-25.29298, -57.61299], [-25.28698, -57.62343], [-25.28643, -57.62309],
  ],
  // Fernando, electricidad
  'p-3': [
    [-25.29513, -57.65157], [-25.29539, -57.65126], [-25.28728, -57.6456], [-25.29526, -57.63168], [-25.29647, -57.63177],
    [-25.29668, -57.63165], [-25.29711, -57.63091], [-25.29174, -57.62686], [-25.28643, -57.62309],
  ],
  // Hugo, aire acondicionado
  'p-5': [
    [-25.33113, -57.55639], [-25.33071, -57.5561], [-25.33018, -57.557], [-25.32624, -57.55409], [-25.32491, -57.55524],
    [-25.32351, -57.55393], [-25.32018, -57.56034], [-25.31754, -57.57029], [-25.3156, -57.57644], [-25.30657, -57.60225],
    [-25.29975, -57.59976], [-25.29886, -57.60282], [-25.29802, -57.60476], [-25.29714, -57.60441], [-25.29241, -57.60323],
    [-25.29381, -57.61083], [-25.29372, -57.61152], [-25.29247, -57.61389], [-25.28698, -57.62343], [-25.28643, -57.62309],
  ],
  // Miguel, pintura
  'p-6': [
    [-25.35765, -57.62414], [-25.35797, -57.6223], [-25.35604, -57.62194], [-25.35378, -57.62121], [-25.35388, -57.62036],
    [-25.35342, -57.62019], [-25.35026, -57.61957], [-25.34858, -57.61963], [-25.34766, -57.62011], [-25.34757, -57.62076],
    [-25.34314, -57.62048], [-25.34244, -57.62503], [-25.34223, -57.62511], [-25.34037, -57.62396], [-25.33968, -57.62393],
    [-25.31283, -57.63081], [-25.3084, -57.63171], [-25.30386, -57.63205], [-25.30161, -57.63243], [-25.29837, -57.63184],
    [-25.29174, -57.62686], [-25.28643, -57.62309],
  ],
  // Andrés, carpintería
  'p-8': [
    [-25.28207, -57.4999], [-25.28217, -57.49992], [-25.28245, -57.49876], [-25.28902, -57.50062], [-25.28819, -57.50418],
    [-25.28859, -57.50428], [-25.2882, -57.51509], [-25.2877, -57.51538], [-25.28628, -57.51695], [-25.28312, -57.52175],
    [-25.28227, -57.52362], [-25.28041, -57.52667], [-25.27989, -57.52898], [-25.27987, -57.52949], [-25.281, -57.53678],
    [-25.28079, -57.53749], [-25.28011, -57.53807], [-25.27389, -57.54101], [-25.27357, -57.54149], [-25.27442, -57.54294],
    [-25.27494, -57.54413], [-25.27728, -57.55246], [-25.27845, -57.55583], [-25.27949, -57.55745], [-25.28072, -57.56007],
    [-25.28253, -57.56222], [-25.28302, -57.56299], [-25.28333, -57.56401], [-25.28366, -57.56635], [-25.28384, -57.56693],
    [-25.28442, -57.56818], [-25.28577, -57.57028], [-25.28646, -57.57185], [-25.29503, -57.57699], [-25.29505, -57.57723],
    [-25.29502, -57.57771], [-25.29003, -57.58906], [-25.28986, -57.58969], [-25.28998, -57.59204], [-25.29063, -57.59364],
    [-25.29088, -57.59479], [-25.29366, -57.60994], [-25.29381, -57.61091], [-25.29377, -57.61131], [-25.2936, -57.61184],
    [-25.29298, -57.61299], [-25.28698, -57.62343], [-25.28643, -57.62309],
  ],
  // Víctor, cerrajería
  'p-9': [
    [-25.34946, -57.51688], [-25.34745, -57.51265], [-25.3424, -57.51562], [-25.34159, -57.51629], [-25.33314, -57.53864],
    [-25.33237, -57.54008], [-25.32904, -57.54438], [-25.32715, -57.54728], [-25.32415, -57.55269], [-25.32018, -57.56034],
    [-25.31754, -57.57029], [-25.3156, -57.57644], [-25.30657, -57.60225], [-25.29975, -57.59976], [-25.29886, -57.60282],
    [-25.29802, -57.60476], [-25.29714, -57.60441], [-25.29241, -57.60323], [-25.29381, -57.61083], [-25.29372, -57.61152],
    [-25.29247, -57.61389], [-25.28698, -57.62343], [-25.28643, -57.62309],
  ],
  // Liliana, limpieza
  'p-10': [
    [-25.30381, -57.62516], [-25.30359, -57.625], [-25.30307, -57.62584], [-25.3032, -57.62611], [-25.30247, -57.62672],
    [-25.30169, -57.6283], [-25.30059, -57.62753], [-25.29817, -57.63171], [-25.29174, -57.62686], [-25.28643, -57.62309],
  ],
  // Óscar, jardinería
  'p-11': [
    [-25.35478, -57.60257], [-25.35482, -57.60284], [-25.35444, -57.60481], [-25.3527, -57.60473], [-25.35042, -57.60545],
    [-25.35023, -57.60569], [-25.34288, -57.60769], [-25.34393, -57.61526], [-25.34246, -57.62493], [-25.34223, -57.62511],
    [-25.34037, -57.62396], [-25.33968, -57.62393], [-25.31283, -57.63081], [-25.3084, -57.63171], [-25.30386, -57.63205],
    [-25.30161, -57.63243], [-25.29837, -57.63184], [-25.29174, -57.62686], [-25.28643, -57.62309],
  ],
}

/** De dónde sale cada profesional: el comienzo de su ruta, o un punto fijo en su ciudad */
const PRO_BASES: Record<string, LatLng> = Object.fromEntries(Object.entries(ROUTES_TO_MARIA).map(([id, route]) => [id, route[0]]))

/** Dos fracciones estables (0 a 1) a partir de un texto */
function hashFractions(text: string): [number, number] {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  const a = (h >>> 0) / 4294967296
  const b = (Math.imul(h ^ (h >>> 13), 2246822507) >>> 0) / 4294967296
  return [a, b]
}

/** Punto fijo a no más de `radiusKm` del centro de la ciudad */
function nearCity(city: string, key: string, radiusKm: number): LatLng {
  const [lat, lng] = CITY_CENTERS[city] ?? CITY_CENTERS.Asunción
  const [a, b] = hashFractions(key)
  const angle = a * 2 * Math.PI
  const km = (0.3 + 0.7 * b) * radiusKm
  return [lat + (km / 111.32) * Math.sin(angle), lng + (km / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.cos(angle)]
}

/** Dónde queda una dirección */
export function locateAddress(address: string, city: string): LatLng {
  const known = KNOWN_ADDRESSES.find((k) => k.city === city && normalize(address).startsWith(k.prefix))
  return known?.location ?? nearCity(city, normalize(`${address} ${city}`), 2.5)
}

/** Desde dónde sale el profesional */
export function professionalBase(pro: Pick<Professional, 'id' | 'city'>): LatLng {
  return PRO_BASES[pro.id] ?? nearCity(pro.city, pro.id, 3)
}

/** Dónde vive el cliente, si tiene dirección guardada */
export function clientHome(user: Pick<User, 'address' | 'city'>): LatLng | null {
  return user.address ? locateAddress(user.address, user.city) : null
}

/** Distancia estimada por calles entre el profesional y un punto (para "a 4,2 km" en los listados) */
export const distanceToKm = (pro: Pick<Professional, 'id' | 'city'>, to: LatLng) => roadKm(professionalBase(pro), to)

/** Camino del profesional hasta el domicilio: la ruta real si está guardada, si no una por cuadras */
export function routeTo(pro: Pick<Professional, 'id' | 'city'>, destination: LatLng): LatLng[] {
  const known = ROUTES_TO_MARIA[pro.id]
  return known && straightKm(MARIA_HOME, destination) < 0.15 ? known : blockRoute(professionalBase(pro), destination)
}

/** En la demo el viaje va acelerado: unos segundos por cada minuto, sin hacer esperar de más al jurado */
const DEMO_MS_PER_MINUTE = 2500
const DEMO_MIN_MS = 20000
const DEMO_MAX_MS = 45000

/** Datos del viaje al salir hacia el domicilio */
export function planTrip(route: LatLng[], now = new Date()): Trip {
  const distanceKm = routeKm(route)
  const minutes = etaMinutes(distanceKm, now)
  return {
    startedAt: now.toISOString(),
    durationMs: Math.min(DEMO_MAX_MS, Math.max(DEMO_MIN_MS, minutes * DEMO_MS_PER_MINUTE)),
    etaMinutes: minutes,
    distanceKm: Math.round(distanceKm * 10) / 10,
  }
}

/** Cuánto del viaje se recorrió (0 a 1) en un momento dado */
export function tripProgress(trip: Trip, now = Date.now()): number {
  if (trip.arrivedAt) return 1
  return Math.min(1, Math.max(0, (now - new Date(trip.startedAt).getTime()) / trip.durationMs))
}

/** Minutos que faltan, redondeados hacia arriba como en las apps de transporte */
export const minutesLeft = (trip: Trip, progress: number) => Math.ceil(trip.etaMinutes * (1 - progress))
