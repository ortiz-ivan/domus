import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SessionState {
  userId: string | null
  login: (userId: string) => void
  logout: () => void
}

/**
 * Sesión simulada. Vive en sessionStorage para que cada pestaña pueda
 * estar en un rol distinto durante la presentación.
 */
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      userId: null,
      login: (userId) => set({ userId }),
      logout: () => set({ userId: null }),
    }),
    { name: 'domus-session', storage: createJSONStorage(() => sessionStorage) },
  ),
)
