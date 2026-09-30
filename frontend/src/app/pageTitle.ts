import { useMatches } from 'react-router'

/** Datos de cada ruta (`handle` de React Router): el título de su pestaña */
export interface RouteHandle {
  title?: string
}

const BRAND = 'Domus'

/**
 * Título de la pestaña: primero lo que cambia, porque el navegador corta el final.
 * "(2) Solicitudes nuevas · Profesional · Domus" distingue cada rol cuando están todos abiertos.
 */
export function documentTitle({ page, section, pending = 0 }: { page?: string; section?: string; pending?: number } = {}): string {
  const parts = [page, section, BRAND].filter(Boolean).join(' · ')
  return pending > 0 ? `(${pending}) ${parts}` : parts
}

/** Título de la ruta más específica que declara uno */
export function pageTitleFrom(matches: readonly { handle: unknown }[]): string | undefined {
  for (let i = matches.length - 1; i >= 0; i--) {
    const title = (matches[i].handle as RouteHandle | undefined)?.title
    if (title) return title
  }
  return undefined
}

export function usePageTitle(): string | undefined {
  return pageTitleFrom(useMatches())
}

/** Las secciones de cada rol ponen su propio título (con pendientes): ver AppShell */
export function isRoleSection(pathname: string): boolean {
  return /^\/(cliente|profesional|admin)(\/|$)/.test(pathname)
}
