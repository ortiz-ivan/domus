import { useSearchParams } from 'react-router'

/** Nombre del parámetro que lleva el trabajo elegido: categoría → perfil → solicitud */
export const SERVICE_PARAM = 'trabajo'

/** Agrega ?trabajo=… (o &trabajo=…) a una ruta, si hay trabajo elegido */
export function withService(path: string, service: string | null | undefined): string {
  if (!service) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}${SERVICE_PARAM}=${encodeURIComponent(service)}`
}

/** El trabajo elegido en la URL actual, y cómo cambiarlo sin sumar entradas al historial */
export function useServiceParam(): [string | null, (service: string | null) => void] {
  const [params, setParams] = useSearchParams()
  const setService = (service: string | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (service) next.set(SERVICE_PARAM, service)
        else next.delete(SERVICE_PARAM)
        return next
      },
      { replace: true },
    )
  return [params.get(SERVICE_PARAM), setService]
}
