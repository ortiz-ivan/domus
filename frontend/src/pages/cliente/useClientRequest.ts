import { useParams } from 'react-router'
import { useDemoStore } from '@/store/demo'
import { useSessionStore } from '@/store/session'

/** Solicitud de la URL, solo si pertenece al cliente logueado */
export function useClientRequest() {
  const { requestId } = useParams()
  const userId = useSessionStore((s) => s.userId)
  return useDemoStore((s) => s.requests.find((r) => r.id === requestId && r.clientId === userId) ?? null)
}
