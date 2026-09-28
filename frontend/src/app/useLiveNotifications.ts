import { useEffect } from 'react'
import { diffNotifications } from '@/lib/notifications'
import { useDemoStore } from '@/store/demo'
import { useSessionStore } from '@/store/session'
import { toast } from '@/store/toast'
import type { Role } from '@/types'

/**
 * Muestra un aviso cuando la otra parte hace algo: el cliente crea una solicitud,
 * el profesional la acepta, etc. Funciona entre pestañas porque el store se
 * rehidrata con el evento "storage" y eso dispara esta suscripción.
 */
export function useLiveNotifications(role: Role) {
  const userId = useSessionStore((s) => s.userId)

  useEffect(() => {
    if (!userId) return
    return useDemoStore.subscribe((state, prev) => {
      for (const notice of diffNotifications(prev, state, { role, userId })) {
        toast(notice.message, 'notice', notice.action)
      }
    })
  }, [role, userId])
}
