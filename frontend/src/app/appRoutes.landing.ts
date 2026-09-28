import type { RouteObject } from 'react-router'

/**
 * Reemplazo de appRoutes en el build "solo landing" (alias en vite.config.ts):
 * sin esto, los import() de cada rol generarían sus archivos igual y se subirían al deploy.
 */
export const appRoutes: RouteObject[] = []
