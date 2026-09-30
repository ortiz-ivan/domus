import { useLocation } from 'react-router'
import { usePageTitle } from '@/app/pageTitle'

/** De dónde vino la persona: lo guarda el link de entrada en el `state` de la navegación */
export interface BackTarget {
  to: string
  label: string
}

export function readBack(state: unknown): BackTarget | null {
  const back = (state as { back?: Partial<BackTarget> } | null)?.back
  return typeof back?.to === 'string' && typeof back.label === 'string' ? { to: back.to, label: back.label } : null
}

/**
 * `state` para los links que entran a una pantalla con "Volver": la pantalla actual queda como origen.
 * Va en los links que llegan desde varios lugares (tarjetas, avisos), no en los pasos de un flujo.
 */
export function useBackHere(): { back: BackTarget } {
  const { pathname, search } = useLocation()
  const title = usePageTitle()
  return { back: { to: `${pathname}${search}`, label: title ?? 'Inicio' } }
}
