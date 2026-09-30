import { formatGs } from '@/lib/format'
import type { PriceRange } from '@/types'

/**
 * Cuánto suele costar cada trabajo, como múltiplo del precio de visita del profesional.
 * Así el estimado sigue al profesional: uno más caro por visita estima más alto.
 * Valores de ejemplo para la demo.
 */
const SERVICE_FACTORS: Record<string, [number, number]> = {
  // Plomería
  'Pérdidas de agua': [1, 2],
  'Destapar cañerías': [0.8, 1.5],
  'Cambio de grifería': [1, 1.8],
  'Instalar termocalefón': [1.5, 2.5],
  // Electricidad
  'Instalar ventilador de techo': [1, 1.6],
  'Tomas y llaves': [0.6, 1.2],
  'Tablero eléctrico': [2, 4],
  'Iluminación LED': [1, 2],
  // Aire acondicionado
  'Instalación de split': [2, 3.5],
  'Limpieza y mantenimiento': [0.8, 1.3],
  'Carga de gas': [1, 1.8],
  Reparación: [1, 2.5],
  // Pintura
  'Pintura de interiores': [2, 5],
  'Pintura de fachadas': [3, 7],
  'Tratamiento de humedad': [1.5, 3],
  Impermeabilización: [2, 5],
  // Carpintería
  'Muebles a medida': [3, 8],
  'Reparación de puertas': [0.8, 1.5],
  Placares: [3, 7],
  'Armado de muebles': [0.6, 1.2],
  // Cerrajería
  'Apertura de puertas': [0.8, 1.3],
  'Cambio de cerradura': [1.2, 2.2],
  'Cerraduras de seguridad': [2, 4],
  'Copias de llaves': [0.3, 0.6],
  // Limpieza
  'Limpieza profunda': [1, 2],
  'Limpieza post obra': [1.5, 3],
  'Tapizados y alfombras': [0.8, 1.6],
  'Limpieza de vidrios': [0.6, 1.2],
  // Jardinería
  'Corte de césped': [0.6, 1.2],
  'Poda de árboles': [1.2, 3],
  'Mantenimiento de jardín': [0.8, 1.5],
  Paisajismo: [3, 8],
}

const STEP = 10_000
const roundGs = (amount: number) => Math.max(STEP, Math.round(amount / STEP) * STEP)

/** Presupuesto estimado de un trabajo con un profesional, o null si el trabajo no tiene referencia */
export function estimateFor(basePrice: number, service: string): PriceRange | null {
  const factors = SERVICE_FACTORS[service]
  if (!factors) return null
  const min = roundGs(basePrice * factors[0])
  return { min, max: Math.max(min + STEP, roundGs(basePrice * factors[1])) }
}

/** "Gs. 120.000 – Gs. 230.000" */
export function formatRange({ min, max }: PriceRange): string {
  return `${formatGs(min)} – ${formatGs(max)}`
}
