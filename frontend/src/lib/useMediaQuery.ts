import { useSyncExternalStore } from 'react'

/** true mientras la media query coincide; se actualiza si cambia (tamaño de ventana, preferencias del sistema) */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
