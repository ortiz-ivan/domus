import type { RouteObject } from 'react-router'

/**
 * Reemplazo de las rutas de un rol que no se publica (alias en vite.config.ts según VITE_DEMO_SCOPE).
 * Sin esto, los import() del rol generarían sus archivos igual y se subirían al deploy.
 */
export const clienteRoutes: RouteObject[] = []
export const profesionalRoutes: RouteObject[] = []
export const adminRoutes: RouteObject[] = []
