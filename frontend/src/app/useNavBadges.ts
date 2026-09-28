import { useDemoStore } from '@/store/demo'
import { useCurrentProfessional } from '@/store/selectors'
import { useSessionStore } from '@/store/session'
import type { Role } from '@/types'

export interface NavBadge {
  count: number
  /** Completa la frase para lectores de pantalla: "3 nuevas" */
  label: string
}

/** Contadores del menú: lo que espera una acción de quien está mirando */
export function useNavBadges(role: Role): Record<string, NavBadge> {
  const userId = useSessionStore((s) => s.userId)
  const professional = useCurrentProfessional()
  const requests = useDemoStore((s) => s.requests)

  if (role === 'profesional') {
    const count = requests.filter((r) => r.professionalId === professional?.id && r.status === 'pendiente').length
    return { '/profesional/solicitudes': { count, label: count === 1 ? 'nueva' : 'nuevas' } }
  }
  if (role === 'cliente') {
    const count = requests.filter((r) => r.clientId === userId && (r.status === 'terminada' || r.status === 'confirmada')).length
    return { '/cliente/solicitudes': { count, label: 'para confirmar o pagar' } }
  }
  return {}
}
