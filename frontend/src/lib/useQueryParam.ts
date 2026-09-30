import { useLocation, useSearchParams } from 'react-router'

/**
 * Un filtro guardado en la URL (?q=…): sobrevive a ir a un detalle y volver, y se puede compartir.
 * Reemplaza la entrada del historial (no suma una por tecla), sin mover el scroll y conservando
 * el `state` de la navegación (el origen del "Volver", ver useBackHere).
 */
export function useQueryParam(name: string): [string, (value: string) => void] {
  const [params, setParams] = useSearchParams()
  const { state } = useLocation()
  const value = params.get(name) ?? ''

  const setValue = (next: string) => {
    setParams(
      (current) => {
        const updated = new URLSearchParams(current)
        if (next) updated.set(name, next)
        else updated.delete(name)
        return updated
      },
      { replace: true, preventScrollReset: true, state },
    )
  }
  return [value, setValue]
}
