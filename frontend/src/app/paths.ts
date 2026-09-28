import type { Role } from '@/types'

/** Link a /ingresar, opcionalmente con el rol sugerido y a dónde ir después */
export function loginPath({ next, rol }: { next?: string; rol?: Role } = {}): string {
  const params = new URLSearchParams()
  if (rol) params.set('rol', rol)
  if (next) params.set('next', next)
  const query = params.toString()
  return query ? `/ingresar?${query}` : '/ingresar'
}
