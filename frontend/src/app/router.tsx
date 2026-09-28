import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { appRoutes } from '@/app/appRoutes'
import { LANDING_ONLY } from '@/app/config'
import { ComingSoonPage } from '@/pages/ComingSoonPage'
import { LandingPage } from '@/pages/landing/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// En modo "solo landing" appRoutes queda sin usar y Vite la descarta del bundle
const routes: RouteObject[] = LANDING_ONLY
  ? [
      { path: '/', element: <LandingPage /> },
      // Todos los CTA del landing apuntan a /ingresar: acá se muestra "Próximamente"
      { path: '/ingresar', element: <ComingSoonPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  : [{ path: '/', element: <LandingPage /> }, ...appRoutes, { path: '*', element: <NotFoundPage /> }]

export const router = createBrowserRouter(routes)
