import { useEffect, useState } from 'react'
import { useMediaQuery } from '@/lib/useMediaQuery'

/**
 * Guion de una pantalla animada: devuelve la etapa actual (0, 1, 2…). `delays[i]` es cuánto
 * dura la etapa i antes de pasar a la siguiente; la última queda fija. Solo avanza mientras
 * `playing`, y con "reducir movimiento" muestra directamente el final.
 * `delays` tiene que ser estable (una constante del módulo).
 */
export function useScript(delays: readonly number[], playing: boolean): number {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (reducedMotion || !playing || stage >= delays.length) return
    const timer = setTimeout(() => setStage((s) => s + 1), delays[stage])
    return () => clearTimeout(timer)
  }, [stage, playing, reducedMotion, delays])

  return reducedMotion ? delays.length : stage
}

/** Texto que se escribe letra por letra mientras `active` (completo con "reducir movimiento") */
export function useTyping(text: string, active: boolean, msPerChar = 55): string {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [length, setLength] = useState(0)

  useEffect(() => {
    if (reducedMotion || !active || length >= text.length) return
    const timer = setTimeout(() => setLength((l) => l + 1), msPerChar)
    return () => clearTimeout(timer)
  }, [active, length, msPerChar, reducedMotion, text.length])

  return reducedMotion ? text : text.slice(0, length)
}
