import type { RouteObject } from 'react-router'
import { from, layouts } from './lazy'

const pages = () => import('@/pages/profesional')

export const profesionalRoutes: RouteObject[] = [
  {
    path: '/profesional',
    lazy: from(layouts, 'ProfesionalLayout'),
    children: [
      { index: true, lazy: from(pages, 'ProfesionalInicioPage') },
      { path: 'solicitudes', lazy: from(pages, 'SolicitudesNuevasPage') },
      { path: 'solicitudes/:requestId', lazy: from(pages, 'DetalleTrabajoPage') },
      { path: 'trabajos', lazy: from(pages, 'TrabajosPage') },
      { path: 'trabajos/:requestId', lazy: from(pages, 'TrabajoEnProcesoPage') },
      { path: 'ganancias', lazy: from(pages, 'GananciasPage') },
      { path: 'perfil', lazy: from(pages, 'PerfilPage') },
      { path: 'membresia', lazy: from(pages, 'MembresiaPage') },
    ],
  },
]
