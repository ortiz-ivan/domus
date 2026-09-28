import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { appRoutes } from '@/app/appRoutes'
import { RootLayout } from '@/app/RootLayout'
import { LANDING_ONLY } from '@/app/config'
import { PageLoader } from '@/components/PageLoader'
import { ComingSoonPage } from '@/pages/ComingSoonPage'
import { LandingPage } from '@/pages/landing/LandingPage'
import { PublicCategoryPage } from '@/pages/landing/PublicCategoryPage'
import { PublicProfesionalPage } from '@/pages/landing/PublicProfesionalPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Páginas públicas: se ven sin iniciar sesión, también en el deploy "solo landing"
const publicRoutes: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
  { path: '/servicios/:categoryId', element: <PublicCategoryPage /> },
  { path: '/profesionales/:professionalId', element: <PublicProfesionalPage /> },
]

// En modo "solo landing" appRoutes es un módulo vacío (alias en vite.config.ts): la app no se compila
const routes: RouteObject[] = LANDING_ONLY
  ? [
      ...publicRoutes,
      // Todos los CTA del landing apuntan a /ingresar: acá se muestra "Próximamente"
      { path: '/ingresar', element: <ComingSoonPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  : [...publicRoutes, ...appRoutes, { path: '*', element: <NotFoundPage /> }]

// Ruta raíz: scroll entre páginas y el indicador de carga mientras llega el código de una sección
export const router = createBrowserRouter([{ element: <RootLayout />, HydrateFallback: PageLoader, children: routes }])
