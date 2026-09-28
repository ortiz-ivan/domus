import type { RouteObject } from 'react-router'

/**
 * Reemplazo de appRoutes cuando VITE_DEMO_SCOPE=landing (alias en vite.config.ts):
 * sin esto, los import() de cada rol generarían sus archivos igual y se subirían al deploy.
 */
export const appRoutes: RouteObject[] = []
