import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface InboxState {
  /** Hasta cuándo vio los avisos cada usuario (ISO); lo posterior cuenta como no leído */
  seenAt: Record<string, string>
  markSeen: (userId: string) => void
}

/**
 * Avisos leídos, por usuario. En localStorage: sobrevive a cerrar la pestaña, y como cada
 * rol de la demo es otro usuario, no se pisan entre pestañas.
 */
export const useInboxStore = create<InboxState>()(
  persist(
    (set) => ({
      seenAt: {},
      markSeen: (userId) => set((s) => ({ seenAt: { ...s.seenAt, [userId]: new Date().toISOString() } })),
    }),
    { name: 'domus-inbox' },
  ),
)
