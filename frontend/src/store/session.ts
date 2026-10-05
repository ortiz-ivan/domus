import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IS_EMBEDDED } from '@/app/config'

interface SessionState {
  userId: string | null
  login: (userId: string) => void
  logout: () => void
}

/**
 * Sesión simulada. Vive en sessionStorage para que cada pestaña pueda
 * estar en un rol distinto durante la presentación.
 * Los celulares de la vista dividida comparten la pestaña (y su sessionStorage):
 * cada uno guarda la sesión con su propio nombre (el `name` del iframe).
 */
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      userId: null,
      login: (userId) => set({ userId }),
      logout: () => set({ userId: null }),
    }),
    { name: IS_EMBEDDED && window.name ? `domus-session:${window.name}` : 'domus-session', storage: createJSONStorage(() => sessionStorage) },
  ),
)
