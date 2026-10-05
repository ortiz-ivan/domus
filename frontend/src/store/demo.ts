import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createSeed, type DemoData } from '@/data/seed'
import { canTransition } from '@/lib/status'
import { newStartCode } from '@/lib/startCode'
import type {
  PaymentMethod,
  PlanId,
  PlatformSettings,
  Professional,
  RequestStatus,
  Role,
  ServiceRequest,
} from '@/types'

export type NewRequestInput = Pick<
  ServiceRequest,
  'clientId' | 'professionalId' | 'categoryId' | 'title' | 'description' | 'address' | 'city' | 'date' | 'timeSlot' | 'price' | 'estimate'
>

interface DemoActions {
  createRequest: (input: NewRequestInput) => string
  /** Cambia el estado si el rol tiene permiso (ver lib/status.ts). Devuelve si se aplicó. */
  transition: (requestId: string, to: RequestStatus, role: Role, note?: string) => boolean
  /** El profesional inicia el trabajo con el código que le da el cliente. Devuelve si el código era correcto. */
  startJob: (requestId: string, code: string) => boolean
  addReview: (requestId: string, rating: number, comment: string, photos?: string[]) => void
  payRequest: (requestId: string, method: PaymentMethod) => boolean
  updateProfessional: (id: string, changes: Partial<Omit<Professional, 'id' | 'userId'>>) => void
  setProfessionalVerified: (id: string, verified: boolean) => void
  /** Membresía simulada: no se cobra, solo cambia la visibilidad */
  setProfessionalPlan: (id: string, plan: PlanId) => void
  setUserActive: (userId: string, active: boolean) => void
  updateSettings: (changes: Partial<PlatformSettings>) => void
  resetDemo: () => void
}

export type DemoState = DemoData & DemoActions

const STORAGE_KEY = 'domus-demo'

const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`
const now = () => new Date().toISOString()

/**
 * localStorage que no rompe la app si se llena (las fotos de las reseñas ocupan lugar):
 * el cambio queda en memoria y se avisa por consola.
 */
const safeLocalStorage = {
  getItem: (name: string) => localStorage.getItem(name),
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value)
    } catch (error) {
      console.warn('No se pudo guardar la demo en localStorage', error)
    }
  },
  removeItem: (name: string) => localStorage.removeItem(name),
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      ...createSeed(),

      createRequest: (input) => {
        const id = newId('r')
        const nextCode = Math.max(0, ...get().requests.map((r) => Number(r.code.slice(4)))) + 1
        const createdAt = now()
        const request: ServiceRequest = {
          ...input,
          id,
          code: `DOM-${nextCode}`,
          status: 'pendiente',
          startCode: newStartCode(),
          history: [{ status: 'pendiente', at: createdAt }],
          createdAt,
        }
        set((s) => ({ requests: [request, ...s.requests] }))
        return id
      },

      transition: (requestId, to, role, note) => {
        const request = get().requests.find((r) => r.id === requestId)
        if (!request || !canTransition(request.status, to, role)) return false
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === requestId ? { ...r, status: to, history: [...r.history, { status: to, at: now(), note }] } : r,
          ),
        }))
        return true
      },

      startJob: (requestId, code) => {
        const request = get().requests.find((r) => r.id === requestId)
        if (!request || code.trim() !== request.startCode) return false
        return get().transition(requestId, 'en_proceso', 'profesional')
      },

      addReview: (requestId, rating, comment, photos) => {
        const request = get().requests.find((r) => r.id === requestId)
        if (!request || get().reviews.some((rv) => rv.requestId === requestId)) return
        set((s) => ({
          reviews: [
            {
              id: newId('rv'),
              requestId,
              professionalId: request.professionalId,
              clientId: request.clientId,
              rating,
              comment,
              ...(photos?.length ? { photos } : {}),
              createdAt: now(),
            },
            ...s.reviews,
          ],
        }))
      },

      payRequest: (requestId, method) => {
        const request = get().requests.find((r) => r.id === requestId)
        if (!request || !get().transition(requestId, 'pagada', 'cliente')) return false
        const { commissionRate } = get().settings
        set((s) => ({
          payments: [
            {
              id: newId('pay'),
              requestId,
              amount: request.price,
              fee: Math.round(request.price * commissionRate),
              method,
              createdAt: now(),
            },
            ...s.payments,
          ],
          professionals: s.professionals.map((p) =>
            p.id === request.professionalId ? { ...p, jobsCompleted: p.jobsCompleted + 1 } : p,
          ),
        }))
        return true
      },

      updateProfessional: (id, changes) =>
        set((s) => ({ professionals: s.professionals.map((p) => (p.id === id ? { ...p, ...changes } : p)) })),

      setProfessionalVerified: (id, verified) =>
        set((s) => ({ professionals: s.professionals.map((p) => (p.id === id ? { ...p, verified } : p)) })),

      setProfessionalPlan: (id, plan) =>
        set((s) => ({ professionals: s.professionals.map((p) => (p.id === id ? { ...p, plan } : p)) })),

      setUserActive: (userId, active) =>
        set((s) => ({ users: s.users.map((u) => (u.id === userId ? { ...u, active } : u)) })),

      updateSettings: (changes) => set((s) => ({ settings: { ...s.settings, ...changes } })),

      resetDemo: () => set(createSeed()),
    }),
    {
      name: STORAGE_KEY,
      // Subir la versión cuando cambia la forma de los datos: descarta lo guardado y recarga el seed
      version: 9,
      storage: createJSONStorage(() => safeLocalStorage),
      migrate: () => createSeed() as DemoState,
    },
  ),
)

// Sincroniza entre pestañas: si el cliente crea una solicitud en una pestaña,
// el profesional la ve aparecer en la otra.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) void useDemoStore.persist.rehydrate()
  })
}
