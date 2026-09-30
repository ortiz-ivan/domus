import { useEffect, useRef, useState, type FocusEvent } from 'react'
import { useMediaQuery } from '@/lib/useMediaQuery'

/**
 * Rotación automática accesible para secciones con opciones (landing).
 * - Solo en escritorio y si el sistema no pide reducir el movimiento.
 * - Se pausa con el mouse encima o el foco adentro, y cuando la sección no está en pantalla.
 * - `stop()` la detiene (la persona eligió a mano); `toggle()` es el botón Pausar / Reanudar.
 * El avance lo dispara <RotationProgress> al terminar su animación: pausar la animación pausa el tiempo.
 */
export function useAutoRotate<T extends HTMLElement = HTMLElement>() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [autoplay, setAutoplay] = useState(true)
  const [interacting, setInteracting] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const canRotate = isDesktop && !reducedMotion

  return {
    /** Va en la sección: se observa si está en pantalla */
    ref,
    /** Mostrar el botón Pausar / Reanudar */
    canRotate,
    autoplay,
    /** Renderizar la barra de avance */
    rotating: canRotate && autoplay,
    /** La barra se congela (mouse, foco o fuera de pantalla) */
    paused: interacting || !onScreen,
    /** La sección está a la vista (para arrancar animaciones recién cuando se la mira) */
    onScreen,
    stop: () => setAutoplay(false),
    toggle: () => setAutoplay((a) => !a),
    /** Van en el contenedor de las opciones */
    interactionHandlers: {
      onMouseEnter: () => setInteracting(true),
      onMouseLeave: () => setInteracting(false),
      onFocus: () => setInteracting(true),
      onBlur: (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false)
      },
    },
  }
}
