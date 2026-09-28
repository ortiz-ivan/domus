import { useParams } from 'react-router'
import { useDemoStore } from '@/store/demo'
import { useCurrentProfessional } from '@/store/selectors'

/** Todas las solicitudes dirigidas al profesional logueado */
export function useProRequests() {
  const professional = useCurrentProfessional()
  const requests = useDemoStore((s) => s.requests)
  return requests.filter((r) => r.professionalId === professional?.id)
}

/** Solicitud de la URL, solo si está dirigida al profesional logueado */
export function useProRequest() {
  const { requestId } = useParams()
  const professional = useCurrentProfessional()
  return useDemoStore((s) => s.requests.find((r) => r.id === requestId && r.professionalId === professional?.id) ?? null)
}
