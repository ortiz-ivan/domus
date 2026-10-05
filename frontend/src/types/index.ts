export type Role = 'cliente' | 'profesional' | 'admin'

export interface User {
  id: string
  role: Role
  name: string
  email: string
  phone: string
  city: string
  /** Dirección guardada del cliente: precarga el formulario de solicitud */
  address?: string
  createdAt: string
  active: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  /** Nombre del ícono de lucide-react (ver lib/icons.ts) */
  icon: string
  /** Foto en /public/images */
  image: string
  /** Trabajos más pedidos, para el landing y la búsqueda */
  services: string[]
}

/** Membresía del profesional: define su visibilidad en la plataforma (ver lib/plans.ts) */
export type PlanId = 'basico' | 'destacado' | 'premium'

export interface Professional {
  id: string
  /** Usuario asociado (rol profesional) */
  userId: string
  name: string
  /** Foto de perfil como data URL (cuadrada y comprimida); sin foto se muestran las iniciales */
  photo?: string
  categoryIds: string[]
  bio: string
  yearsExperience: number
  /** Precio referencial por visita, en guaraníes */
  basePrice: number
  city: string
  verified: boolean
  jobsCompleted: number
  /** Reseñas históricas previas a la demo (se suman a las reseñas reales) */
  pastRating: { average: number; count: number }
  /** Tiempo típico en responder una solicitud, en minutos (dato simulado, como pastRating) */
  responseMinutes: number
  plan: PlanId
}

/** Rango de precio en guaraníes */
export interface PriceRange {
  min: number
  max: number
}

export type RequestStatus =
  | 'pendiente' // creada por el cliente, esperando respuesta
  | 'rechazada' // el profesional no la tomó
  | 'aceptada' // el profesional la aceptó, aún no empezó
  | 'en_camino' // el profesional va hacia el domicilio (opcional: puede iniciar directo si ya está ahí)
  | 'en_proceso' // el profesional está trabajando
  | 'terminada' // el profesional marcó el trabajo como terminado
  | 'confirmada' // el cliente confirmó que se realizó bien
  | 'pagada' // pago simulado completado
  | 'cancelada' // el cliente la canceló

export type TimeSlot = 'manana' | 'tarde' | 'noche'

export interface StatusChange {
  status: RequestStatus
  at: string
  note?: string
}

/** Punto en el mapa: [latitud, longitud] */
export type LatLng = [number, number]

/** Viaje simulado del profesional al domicilio. La ruta no se guarda: sale de quién va y a dónde (lib/places.ts). */
export interface Trip {
  startedAt: string
  /** Cuánto dura el viaje en la demo (acelerado: unos segundos por cada minuto estimado) */
  durationMs: number
  /** Minutos que se le muestran al cliente, como si fuera un viaje real */
  etaMinutes: number
  distanceKm: number
  /** El profesional avisó que llegó (antes de que termine el tiempo, o al terminar) */
  arrivedAt?: string
}

export interface ServiceRequest {
  id: string
  code: string
  clientId: string
  professionalId: string
  categoryId: string
  title: string
  description: string
  address: string
  city: string
  /** Fecha solicitada (YYYY-MM-DD) */
  date: string
  timeSlot: TimeSlot
  /** "Lo necesito ya": es para ahora, y al aceptar el profesional sale de inmediato hacia el domicilio */
  urgent?: boolean
  status: RequestStatus
  history: StatusChange[]
  /** Monto final acordado, en guaraníes */
  price: number
  /** Presupuesto estimado que vio el cliente al pedir (no hay si eligió "Otro problema") */
  estimate?: PriceRange
  /** Código que el cliente le da al profesional al llegar; sin él no se puede iniciar el trabajo */
  startCode: string
  trip?: Trip
  createdAt: string
}

export interface Review {
  id: string
  requestId: string
  professionalId: string
  clientId: string
  rating: number
  comment: string
  /** Fotos del trabajo: rutas de /public o data URLs comprimidas en el navegador */
  photos?: string[]
  createdAt: string
}

export type PaymentMethod = 'tarjeta' | 'transferencia' | 'billetera'

export interface Payment {
  id: string
  requestId: string
  amount: number
  /** Comisión de la plataforma */
  fee: number
  method: PaymentMethod
  createdAt: string
}

export interface PlatformSettings {
  /** Comisión de la plataforma (0 a 1) */
  commissionRate: number
  platformName: string
  supportEmail: string
}
