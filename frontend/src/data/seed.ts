import type {
  Category,
  Payment,
  PlatformSettings,
  Professional,
  Review,
  ServiceRequest,
  StatusChange,
  User,
} from '@/types'

/** Usuarios con los que se entra a cada rol durante la demo */
export const DEMO_USER_IDS = {
  cliente: 'u-cli-1',
  profesional: 'u-pro-1',
  admin: 'u-adm-1',
} as const

export interface DemoData {
  users: User[]
  categories: Category[]
  professionals: Professional[]
  requests: ServiceRequest[]
  reviews: Review[]
  payments: Payment[]
  settings: PlatformSettings
}

const DAY = 24 * 60 * 60 * 1000

/** Fecha ISO relativa a hoy, para que la demo siempre se vea actual */
function daysAgo(days: number, hour = 10): string {
  const d = new Date(Date.now() - days * DAY)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

function dateOnly(daysFromToday: number): string {
  return new Date(Date.now() + daysFromToday * DAY).toISOString().slice(0, 10)
}

const categories: Category[] = [
  {
    id: 'plomeria', name: 'Plomería', description: 'Pérdidas, cañerías, sanitarios y griferías.', icon: 'droplets',
    image: '/images/plomeria.webp', services: ['Pérdidas de agua', 'Destapar cañerías', 'Cambio de grifería', 'Instalar termocalefón'],
  },
  {
    id: 'electricidad', name: 'Electricidad', description: 'Instalaciones, tomas, tableros y luminarias.', icon: 'zap',
    image: '/images/electricidad.webp', services: ['Instalar ventilador de techo', 'Tomas y llaves', 'Tablero eléctrico', 'Iluminación LED'],
  },
  {
    id: 'aire', name: 'Aire acondicionado', description: 'Instalación, carga de gas y mantenimiento.', icon: 'snowflake',
    image: '/images/aire.webp', services: ['Instalación de split', 'Limpieza y mantenimiento', 'Carga de gas', 'Reparación'],
  },
  {
    id: 'pintura', name: 'Pintura', description: 'Interiores, exteriores y tratamiento de humedad.', icon: 'paint-roller',
    image: '/images/pintura.webp', services: ['Pintura de interiores', 'Pintura de fachadas', 'Tratamiento de humedad', 'Impermeabilización'],
  },
  {
    id: 'carpinteria', name: 'Carpintería', description: 'Muebles, puertas, placares y reparaciones.', icon: 'hammer',
    image: '/images/carpinteria.webp', services: ['Muebles a medida', 'Reparación de puertas', 'Placares', 'Armado de muebles'],
  },
  {
    id: 'cerrajeria', name: 'Cerrajería', description: 'Aperturas, cambio de cerraduras y copias.', icon: 'key-round',
    image: '/images/cerrajeria.webp', services: ['Apertura de puertas', 'Cambio de cerradura', 'Cerraduras de seguridad', 'Copias de llaves'],
  },
  {
    id: 'limpieza', name: 'Limpieza', description: 'Limpieza profunda, post obra y tapizados.', icon: 'sparkles',
    image: '/images/limpieza.webp', services: ['Limpieza profunda', 'Limpieza post obra', 'Tapizados y alfombras', 'Limpieza de vidrios'],
  },
  {
    id: 'jardineria', name: 'Jardinería', description: 'Corte de césped, poda y mantenimiento.', icon: 'trees',
    image: '/images/jardineria.webp', services: ['Corte de césped', 'Poda de árboles', 'Mantenimiento de jardín', 'Paisajismo'],
  },
]

/** Ciudades que cubre la demo */
export const CITIES = ['Asunción', 'Luque', 'San Lorenzo', 'Lambaré', 'Fernando de la Mora'] as const

const clients: User[] = [
  { id: 'u-cli-1', role: 'cliente', name: 'María González', email: 'maria.gonzalez@demo.com', phone: '0981 123 456', city: 'Asunción', createdAt: daysAgo(120), active: true },
  { id: 'u-cli-2', role: 'cliente', name: 'Jorge Villalba', email: 'jorge.villalba@demo.com', phone: '0982 234 567', city: 'Luque', createdAt: daysAgo(95), active: true },
  { id: 'u-cli-3', role: 'cliente', name: 'Lucía Fernández', email: 'lucia.fernandez@demo.com', phone: '0983 345 678', city: 'San Lorenzo', createdAt: daysAgo(60), active: true },
  { id: 'u-cli-4', role: 'cliente', name: 'Diego Ayala', email: 'diego.ayala@demo.com', phone: '0984 456 789', city: 'Lambaré', createdAt: daysAgo(30), active: false },
  { id: 'u-cli-5', role: 'cliente', name: 'Sofía Rojas', email: 'sofia.rojas@demo.com', phone: '0985 567 890', city: 'Fernando de la Mora', createdAt: daysAgo(12), active: true },
  { id: 'u-cli-6', role: 'cliente', name: 'Martín Espínola', email: 'martin.espinola@demo.com', phone: '0986 678 901', city: 'Asunción', createdAt: daysAgo(170), active: true },
  { id: 'u-cli-7', role: 'cliente', name: 'Carmen Aquino', email: 'carmen.aquino@demo.com', phone: '0981 789 012', city: 'Luque', createdAt: daysAgo(160), active: true },
  { id: 'u-cli-8', role: 'cliente', name: 'Pablo Zárate', email: 'pablo.zarate@demo.com', phone: '0982 890 123', city: 'San Lorenzo', createdAt: daysAgo(150), active: true },
  { id: 'u-cli-9', role: 'cliente', name: 'Gabriela Insfrán', email: 'gabriela.insfran@demo.com', phone: '0983 901 234', city: 'Lambaré', createdAt: daysAgo(140), active: true },
  { id: 'u-cli-10', role: 'cliente', name: 'Rodrigo Cáceres', email: 'rodrigo.caceres@demo.com', phone: '0984 012 345', city: 'Asunción', createdAt: daysAgo(135), active: true },
]

const admins: User[] = [
  { id: 'u-adm-1', role: 'admin', name: 'Ana Martínez', email: 'admin@domus.com.py', phone: '021 600 700', city: 'Asunción', createdAt: daysAgo(200), active: true },
]

interface ProSeed extends Omit<Professional, 'userId'> {
  email: string
  phone: string
  joinedDaysAgo: number
}

const proSeeds: ProSeed[] = [
  { id: 'p-1', name: 'Carlos Benítez', categoryIds: ['plomeria'], bio: 'Plomero matriculado. Detección de pérdidas sin romper y reparaciones de urgencia.', yearsExperience: 12, basePrice: 150000, city: 'Asunción', verified: true, jobsCompleted: 184, pastRating: { average: 4.8, count: 152 }, email: 'carlos.benitez@demo.com', phone: '0971 111 222', joinedDaysAgo: 180 },
  { id: 'p-2', name: 'Ramón Giménez', categoryIds: ['plomeria', 'aire'], bio: 'Plomería general y mantenimiento de equipos split.', yearsExperience: 7, basePrice: 120000, city: 'Luque', verified: true, jobsCompleted: 96, pastRating: { average: 4.6, count: 71 }, email: 'ramon.gimenez@demo.com', phone: '0971 222 333', joinedDaysAgo: 150 },
  { id: 'p-3', name: 'Fernando Duarte', categoryIds: ['electricidad'], bio: 'Electricista industrial y domiciliario. Tableros y puesta a tierra.', yearsExperience: 15, basePrice: 180000, city: 'Asunción', verified: true, jobsCompleted: 231, pastRating: { average: 4.9, count: 198 }, email: 'fernando.duarte@demo.com', phone: '0972 333 444', joinedDaysAgo: 175 },
  { id: 'p-4', name: 'Patricia Acosta', categoryIds: ['electricidad'], bio: 'Instalaciones eléctricas nuevas, iluminación LED y domótica básica.', yearsExperience: 6, basePrice: 140000, city: 'San Lorenzo', verified: true, jobsCompleted: 78, pastRating: { average: 4.7, count: 54 }, email: 'patricia.acosta@demo.com', phone: '0972 444 555', joinedDaysAgo: 110 },
  { id: 'p-5', name: 'Hugo Cabrera', categoryIds: ['aire'], bio: 'Técnico en refrigeración. Instalación, limpieza y carga de gas.', yearsExperience: 10, basePrice: 200000, city: 'Fernando de la Mora', verified: true, jobsCompleted: 142, pastRating: { average: 4.8, count: 117 }, email: 'hugo.cabrera@demo.com', phone: '0973 555 666', joinedDaysAgo: 160 },
  { id: 'p-6', name: 'Miguel Ortiz', categoryIds: ['pintura'], bio: 'Pintura de interiores y exteriores, impermeabilización de techos.', yearsExperience: 9, basePrice: 250000, city: 'Lambaré', verified: true, jobsCompleted: 67, pastRating: { average: 4.5, count: 49 }, email: 'miguel.ortiz@demo.com', phone: '0973 666 777', joinedDaysAgo: 130 },
  { id: 'p-7', name: 'Rosa Vera', categoryIds: ['pintura', 'limpieza'], bio: 'Terminaciones prolijas y limpieza post obra.', yearsExperience: 4, basePrice: 180000, city: 'Asunción', verified: false, jobsCompleted: 23, pastRating: { average: 4.4, count: 12 }, email: 'rosa.vera@demo.com', phone: '0974 777 888', joinedDaysAgo: 40 },
  { id: 'p-8', name: 'Andrés Samaniego', categoryIds: ['carpinteria'], bio: 'Muebles a medida, placares y reparación de puertas.', yearsExperience: 18, basePrice: 220000, city: 'Luque', verified: true, jobsCompleted: 205, pastRating: { average: 4.9, count: 176 }, email: 'andres.samaniego@demo.com', phone: '0974 888 999', joinedDaysAgo: 190 },
  { id: 'p-9', name: 'Víctor Núñez', categoryIds: ['cerrajeria'], bio: 'Cerrajería de urgencia 24 h. Cambio de combinación y cerraduras de seguridad.', yearsExperience: 11, basePrice: 100000, city: 'San Lorenzo', verified: true, jobsCompleted: 312, pastRating: { average: 4.8, count: 264 }, email: 'victor.nunez@demo.com', phone: '0975 999 000', joinedDaysAgo: 170 },
  { id: 'p-10', name: 'Liliana Báez', categoryIds: ['limpieza'], bio: 'Limpieza profunda de hogares, tapizados y alfombras.', yearsExperience: 5, basePrice: 160000, city: 'Asunción', verified: true, jobsCompleted: 88, pastRating: { average: 4.7, count: 63 }, email: 'liliana.baez@demo.com', phone: '0975 000 111', joinedDaysAgo: 90 },
  { id: 'p-11', name: 'Óscar Riquelme', categoryIds: ['jardineria'], bio: 'Mantenimiento de jardines, poda de árboles y paisajismo.', yearsExperience: 8, basePrice: 130000, city: 'Lambaré', verified: true, jobsCompleted: 119, pastRating: { average: 4.6, count: 95 }, email: 'oscar.riquelme@demo.com', phone: '0976 111 000', joinedDaysAgo: 140 },
  { id: 'p-12', name: 'Gustavo Paredes', categoryIds: ['electricidad', 'carpinteria'], bio: 'Mantenimiento general del hogar: electricidad y arreglos de carpintería.', yearsExperience: 3, basePrice: 110000, city: 'Fernando de la Mora', verified: false, jobsCompleted: 15, pastRating: { average: 4.3, count: 8 }, email: 'gustavo.paredes@demo.com', phone: '0976 222 111', joinedDaysAgo: 25 },
]

const professionals: Professional[] = proSeeds.map(
  ({ email: _email, phone: _phone, joinedDaysAgo: _joined, ...pro }, i) => ({ ...pro, userId: `u-pro-${i + 1}` }),
)

const proUsers: User[] = proSeeds.map((pro, i) => ({
  id: `u-pro-${i + 1}`,
  role: 'profesional',
  name: pro.name,
  email: pro.email,
  phone: pro.phone,
  city: pro.city,
  createdAt: daysAgo(pro.joinedDaysAgo),
  active: true,
}))

function history(...steps: [StatusChange['status'], number][]): StatusChange[] {
  return steps.map(([status, days], i) => ({ status, at: daysAgo(days, 9 + i) }))
}

const requests: ServiceRequest[] = [
  // Del cliente demo: una por cada momento del flujo, para mostrar todos los estados
  {
    id: 'r-1', code: 'DOM-1001', clientId: 'u-cli-1', professionalId: 'p-1', categoryId: 'plomeria',
    title: 'Pérdida de agua bajo la pileta', description: 'Gotea constantemente la cañería debajo de la pileta de la cocina.',
    address: 'Av. España 1234', city: 'Asunción', date: dateOnly(1), timeSlot: 'manana',
    status: 'pendiente', history: history(['pendiente', 0]), price: 150000, createdAt: daysAgo(0, 8),
  },
  {
    id: 'r-2', code: 'DOM-0998', clientId: 'u-cli-1', professionalId: 'p-3', categoryId: 'electricidad',
    title: 'Instalar ventilador de techo', description: 'Tengo el ventilador comprado, falta instalarlo en el dormitorio.',
    address: 'Av. España 1234', city: 'Asunción', date: dateOnly(0), timeSlot: 'tarde',
    status: 'en_proceso', history: history(['pendiente', 3], ['aceptada', 2], ['en_proceso', 0]), price: 180000, createdAt: daysAgo(3),
  },
  {
    id: 'r-3', code: 'DOM-0985', clientId: 'u-cli-1', professionalId: 'p-9', categoryId: 'cerrajeria',
    title: 'Cambio de cerradura puerta principal', description: 'Quiero cambiar la cerradura por una de seguridad.',
    address: 'Av. España 1234', city: 'Asunción', date: dateOnly(-10), timeSlot: 'manana',
    status: 'pagada', history: history(['pendiente', 12], ['aceptada', 12], ['en_proceso', 10], ['terminada', 10], ['confirmada', 10], ['pagada', 10]), price: 250000, createdAt: daysAgo(12),
  },
  // Lista para confirmar: permite mostrar confirmación → calificación → pago sin hacer todo el flujo en vivo
  {
    id: 'r-13', code: 'DOM-0996', clientId: 'u-cli-1', professionalId: 'p-10', categoryId: 'limpieza',
    title: 'Limpieza profunda del departamento', description: 'Limpieza completa antes de recibir visitas: cocina, baños y vidrios.',
    address: 'Av. España 1234', city: 'Asunción', date: dateOnly(-1), timeSlot: 'manana',
    status: 'terminada', history: history(['pendiente', 3], ['aceptada', 3], ['en_proceso', 1], ['terminada', 1]), price: 220000, createdAt: daysAgo(3),
  },
  // Del profesional demo (Carlos, plomería) con otros clientes
  {
    id: 'r-4', code: 'DOM-1000', clientId: 'u-cli-3', professionalId: 'p-1', categoryId: 'plomeria',
    title: 'Inodoro pierde agua', description: 'El depósito del inodoro no corta y se escucha correr el agua.',
    address: 'Calle Mcal. Estigarribia 455', city: 'San Lorenzo', date: dateOnly(2), timeSlot: 'tarde',
    status: 'pendiente', history: history(['pendiente', 0]), price: 150000, createdAt: daysAgo(0, 7),
  },
  {
    id: 'r-5', code: 'DOM-0995', clientId: 'u-cli-2', professionalId: 'p-1', categoryId: 'plomeria',
    title: 'Cambio de grifería del baño', description: 'Reemplazar monocomando del lavatorio.',
    address: 'Ruta 2 km 12', city: 'Luque', date: dateOnly(1), timeSlot: 'manana',
    status: 'aceptada', history: history(['pendiente', 2], ['aceptada', 1]), price: 170000, createdAt: daysAgo(2),
  },
  {
    id: 'r-6', code: 'DOM-0970', clientId: 'u-cli-5', professionalId: 'p-1', categoryId: 'plomeria',
    title: 'Destapar desagüe de cocina', description: 'El agua no baja en la pileta de la cocina.',
    address: 'Tte. Rojas Silva 890', city: 'Fernando de la Mora', date: dateOnly(-20), timeSlot: 'noche',
    status: 'pagada', history: history(['pendiente', 22], ['aceptada', 22], ['en_proceso', 20], ['terminada', 20], ['confirmada', 20], ['pagada', 20]), price: 130000, createdAt: daysAgo(22),
  },
  {
    id: 'r-7', code: 'DOM-0950', clientId: 'u-cli-2', professionalId: 'p-1', categoryId: 'plomeria',
    title: 'Instalación de termocalefón', description: 'Termocalefón nuevo de 80 litros.',
    address: 'Ruta 2 km 12', city: 'Luque', date: dateOnly(-35), timeSlot: 'manana',
    status: 'pagada', history: history(['pendiente', 37], ['aceptada', 36], ['en_proceso', 35], ['terminada', 35], ['confirmada', 35], ['pagada', 35]), price: 280000, createdAt: daysAgo(37),
  },
  // Otras solicitudes de la plataforma (para el administrador)
  {
    id: 'r-8', code: 'DOM-0990', clientId: 'u-cli-3', professionalId: 'p-5', categoryId: 'aire',
    title: 'Mantenimiento de split 12000 BTU', description: 'Limpieza completa antes del verano.',
    address: 'Calle Mcal. Estigarribia 455', city: 'San Lorenzo', date: dateOnly(-5), timeSlot: 'tarde',
    status: 'pagada', history: history(['pendiente', 7], ['aceptada', 6], ['en_proceso', 5], ['terminada', 5], ['confirmada', 5], ['pagada', 5]), price: 200000, createdAt: daysAgo(7),
  },
  {
    id: 'r-9', code: 'DOM-0993', clientId: 'u-cli-5', professionalId: 'p-6', categoryId: 'pintura',
    title: 'Pintar living comedor', description: 'Aproximadamente 40 m² de pared.',
    address: 'Tte. Rojas Silva 890', city: 'Fernando de la Mora', date: dateOnly(-1), timeSlot: 'manana',
    status: 'terminada', history: history(['pendiente', 4], ['aceptada', 4], ['en_proceso', 2], ['terminada', 1]), price: 650000, createdAt: daysAgo(4),
  },
  {
    id: 'r-10', code: 'DOM-0980', clientId: 'u-cli-4', professionalId: 'p-8', categoryId: 'carpinteria',
    title: 'Arreglo de puerta de placard', description: 'La puerta corrediza se salió del riel.',
    address: 'Av. Cacique Lambaré 2100', city: 'Lambaré', date: dateOnly(-15), timeSlot: 'tarde',
    status: 'rechazada', history: history(['pendiente', 16], ['rechazada', 15]), price: 220000, createdAt: daysAgo(16),
  },
  {
    id: 'r-11', code: 'DOM-0975', clientId: 'u-cli-2', professionalId: 'p-10', categoryId: 'limpieza',
    title: 'Limpieza profunda post mudanza', description: 'Casa de 3 dormitorios.',
    address: 'Ruta 2 km 12', city: 'Luque', date: dateOnly(-18), timeSlot: 'manana',
    status: 'cancelada', history: history(['pendiente', 19], ['cancelada', 18]), price: 320000, createdAt: daysAgo(19),
  },
  {
    id: 'r-12', code: 'DOM-0960', clientId: 'u-cli-1', professionalId: 'p-11', categoryId: 'jardineria',
    title: 'Poda de árbol del patio', description: 'Mango grande que toca los cables.',
    address: 'Av. España 1234', city: 'Asunción', date: dateOnly(-28), timeSlot: 'manana',
    status: 'pagada', history: history(['pendiente', 30], ['aceptada', 29], ['en_proceso', 28], ['terminada', 28], ['confirmada', 28], ['pagada', 28]), price: 300000, createdAt: daysAgo(30),
  },
]

const reviews: Review[] = [
  { id: 'rv-1', requestId: 'r-3', professionalId: 'p-9', clientId: 'u-cli-1', rating: 5, comment: 'Muy puntual y prolijo. La cerradura quedó perfecta.', createdAt: daysAgo(10, 18) },
  { id: 'rv-2', requestId: 'r-6', professionalId: 'p-1', clientId: 'u-cli-5', rating: 5, comment: 'Resolvió el problema en media hora. Recomendado.', createdAt: daysAgo(20, 21) },
  { id: 'rv-3', requestId: 'r-7', professionalId: 'p-1', clientId: 'u-cli-2', rating: 4, comment: 'Buen trabajo, llegó un poco tarde pero avisó.', createdAt: daysAgo(35, 17) },
  { id: 'rv-4', requestId: 'r-8', professionalId: 'p-5', clientId: 'u-cli-3', rating: 5, comment: 'Excelente atención, explicó todo lo que hizo.', createdAt: daysAgo(5, 19) },
  { id: 'rv-5', requestId: 'r-12', professionalId: 'p-11', clientId: 'u-cli-1', rating: 4, comment: 'Dejó todo limpio después de la poda.', createdAt: daysAgo(28, 16) },
]

// ---------------------------------------------------------------------------
// Historial de los últimos 6 meses, para que tablas y gráficos tengan volumen.
// Pseudoaleatorio con semilla fija: siempre genera los mismos datos.

function seededRandom(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const REVIEW_COMMENTS: [number, string][] = [
  [5, 'Excelente trabajo, muy prolijo y puntual.'],
  [5, 'Llegó a horario y resolvió todo rápido. Lo recomiendo.'],
  [5, 'Muy buena atención, explicó cada paso.'],
  [4, 'Buen trabajo, el precio fue el acordado.'],
  [5, 'Impecable. Voy a volver a llamarlo.'],
  [4, 'Cumplió con lo pedido, se demoró un poco en llegar.'],
  [5, 'Súper responsable y dejó todo limpio.'],
  [3, 'El trabajo quedó bien, pero tuvo que volver al día siguiente.'],
]

const historicClients = clients.filter((c) => c.id !== DEMO_USER_IDS.cliente)
const ADDRESSES = ['Av. Mcal. López 3200', 'Calle Palma 540', 'Av. Artigas 1850', 'Tte. Fariña 1120', 'Av. Brasilia 777', 'Calle Cerro Corá 950']

function buildHistory(): { requests: ServiceRequest[]; reviews: Review[] } {
  const random = seededRandom(2026)
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)]
  const out: ServiceRequest[] = []
  const outReviews: Review[] = []

  for (let i = 0; i < 60; i++) {
    // El profesional demo recibe más trabajos para que sus ganancias tengan historia
    const pro = random() < 0.25 ? professionals[0] : pick(professionals)
    const client = pick(historicClients)
    const categoryId = pick(pro.categoryIds)
    const category = categories.find((c) => c.id === categoryId)!
    const days = 8 + Math.floor(random() * 172)
    const price = Math.round((pro.basePrice * (1 + random() * 1.2)) / 10000) * 10000
    const roll = random()
    const history: StatusChange[] =
      roll < 0.08
        ? [{ status: 'pendiente', at: daysAgo(days + 1, 9) }, { status: 'cancelada', at: daysAgo(days, 11) }]
        : roll < 0.14
          ? [{ status: 'pendiente', at: daysAgo(days + 1, 9) }, { status: 'rechazada', at: daysAgo(days, 12) }]
          : (['pendiente', 'aceptada', 'en_proceso', 'terminada', 'confirmada', 'pagada'] as const).map((status, step) => ({
              status,
              at: daysAgo(step < 2 ? days + 1 : days, 9 + step * 2),
            }))
    const id = `h-${i + 1}`
    out.push({
      id,
      code: `DOM-0${800 + i * 2}`,
      clientId: client.id,
      professionalId: pro.id,
      categoryId,
      title: pick(category.services),
      description: 'Solicitud registrada antes de la demo.',
      address: pick(ADDRESSES),
      city: client.city,
      date: dateOnly(-days),
      timeSlot: pick(['manana', 'tarde', 'noche'] as const),
      status: history[history.length - 1].status,
      history,
      price,
      createdAt: history[0].at,
    })
    if (history.length === 6 && random() < 0.6) {
      const [rating, comment] = pick(REVIEW_COMMENTS)
      outReviews.push({ id: `rv-h-${i + 1}`, requestId: id, professionalId: pro.id, clientId: client.id, rating, comment, createdAt: daysAgo(days, 20) })
    }
  }
  return { requests: out, reviews: outReviews }
}

const historic = buildHistory()

export const DEFAULT_SETTINGS: PlatformSettings = {
  commissionRate: 0.1,
  platformName: 'Domus',
  supportEmail: 'soporte@domus.com.py',
}

function paymentsFor(reqs: ServiceRequest[], rate: number): Payment[] {
  return reqs
    .filter((r) => r.status === 'pagada')
    .map((r, i) => ({
      id: `pay-${i + 1}`,
      requestId: r.id,
      amount: r.price,
      fee: Math.round(r.price * rate),
      method: i % 2 === 0 ? 'tarjeta' : 'transferencia',
      createdAt: r.history[r.history.length - 1].at,
    }))
}

/** Estado inicial de la demo. Se llama al arrancar y al reiniciar la demo. */
export function createSeed(): DemoData {
  return {
    users: [...clients, ...proUsers, ...admins],
    categories,
    professionals,
    requests: [...requests, ...historic.requests],
    reviews: [...reviews, ...historic.reviews],
    payments: paymentsFor([...requests, ...historic.requests], DEFAULT_SETTINGS.commissionRate),
    settings: DEFAULT_SETTINGS,
  }
}
