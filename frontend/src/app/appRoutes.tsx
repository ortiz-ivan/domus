import type { RouteObject } from 'react-router'
import { PRESENTER_TOOLS } from '@/app/config'
import { adminRoutes } from '@/app/routes/adminRoutes'
import { clienteRoutes } from '@/app/routes/clienteRoutes'
import { from } from '@/app/routes/lazy'
import { profesionalRoutes } from '@/app/routes/profesionalRoutes'

/*
 * Rutas de la app: ingreso + los roles publicados en esta build (ver app/scope.ts).
 * Carga diferida: el código de cada rol se descarga recién al entrar a su sección.
 * Los roles no publicados llegan vacíos por alias (vite.config.ts) y su código no se compila.
 */
export const appRoutes: RouteObject[] = [
  { path: '/ingresar', handle: { title: 'Ingresar' }, lazy: from(() => import('@/pages/RoleSelectPage'), 'RoleSelectPage') },
  ...clienteRoutes,
  ...profesionalRoutes,
  ...adminRoutes,
  // Vista dividida para la TV: cliente y profesional lado a lado
  ...(PRESENTER_TOOLS
    ? [{ path: '/presentacion', handle: { title: 'Presentación' }, lazy: from(() => import('@/pages/PresentacionPage'), 'PresentacionPage') }]
    : []),
]
