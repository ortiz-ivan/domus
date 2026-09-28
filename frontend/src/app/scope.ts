// Import relativo: este archivo también lo compila vite.config.ts, que no conoce el alias @/
import type { Role } from '../types/index.ts'

/**
 * Hasta dónde llega la demo publicada (VITE_DEMO_SCOPE):
 * - full: todo, con solicitudes (desarrollo local, presentación)
 * - cliente: landing + app del cliente, sin solicitar servicios (vista previa en Netlify)
 * - landing: solo la landing
 * Lo leen la app (config.ts) y vite.config.ts, que deja afuera del build el código de los roles no publicados.
 */
export type DemoScope = 'full' | 'cliente' | 'landing'

/** Acepta también la variable anterior VITE_LANDING_ONLY=true */
export function parseDemoScope(scope: string | undefined, legacyLandingOnly?: string): DemoScope {
  if (scope === 'full' || scope === 'cliente' || scope === 'landing') return scope
  return legacyLandingOnly === 'true' ? 'landing' : 'full'
}

/** Roles a los que se puede ingresar en cada alcance */
export function enabledRoles(scope: DemoScope): Role[] {
  if (scope === 'full') return ['cliente', 'profesional', 'admin']
  if (scope === 'cliente') return ['cliente']
  return []
}
