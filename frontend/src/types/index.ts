export type Role = 'cliente' | 'profesional' | 'admin'

export interface User {
  id: string
  role: Role
  name: string
  email: string
  phone: string
  city: string
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

export interface Professional {
  id: string
  /** Usuario asociado (rol profesional) */
  userId: string
  name: string
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
}

export type RequestStatus =
  | 'pendiente' // creada por el cliente, esperando respuesta
  | 'rechazada' // el profesional no la tomó
  | 'aceptada' // el profesional la aceptó, aún no empezó
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
  status: RequestStatus
  history: StatusChange[]
  /** Monto final acordado, en guaraníes */
  price: number
  createdAt: string
}

export interface Review {
  id: string
  requestId: string
  professionalId: string
  clientId: string
  rating: number
  comment: string
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
