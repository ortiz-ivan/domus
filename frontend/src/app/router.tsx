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
import { RouteErrorPage } from '@/pages/RouteErrorPage'

// Páginas públicas: se ven sin iniciar sesión, también en el deploy "solo landing"
const publicRoutes: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
  // Carga diferida: la portada no descarga la landing para profesionales
  { path: '/para-profesionales', handle: { title: 'Para profesionales' }, lazy: { Component: async () => (await import('@/pages/landing/pros/ProLandingPage')).ProLandingPage } },
  { path: '/servicios/:categoryId', handle: { title: 'Profesionales' }, element: <PublicCategoryPage /> },
  { path: '/profesionales/:professionalId', handle: { title: 'Perfil del profesional' }, element: <PublicProfesionalPage /> },
]

// En modo "solo landing" appRoutes es un módulo vacío (alias en vite.config.ts): la app no se compila
const routes: RouteObject[] = LANDING_ONLY
  ? [
      ...publicRoutes,
      // Todos los CTA del landing apuntan a /ingresar: acá se muestra "Próximamente"
      { path: '/ingresar', handle: { title: 'Próximamente' }, element: <ComingSoonPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  : [...publicRoutes, ...appRoutes, { path: '*', handle: { title: 'Página no encontrada' }, element: <NotFoundPage /> }]

// Ruta raíz: scroll entre páginas, el indicador de carga mientras llega el código de una sección
// y la pantalla de error (también recarga sola si un deploy dejó sin archivos a la pestaña abierta)
export const router = createBrowserRouter([
  { element: <RootLayout />, HydrateFallback: PageLoader, ErrorBoundary: RouteErrorPage, children: routes },
])
