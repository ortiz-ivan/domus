import type { RouteObject } from 'react-router'
import { from, layouts } from './lazy'

const pages = () => import('@/pages/profesional')

export const profesionalRoutes: RouteObject[] = [
  {
    path: '/profesional',
    lazy: from(layouts, 'ProfesionalLayout'),
    children: [
      { index: true, handle: { title: 'Inicio' }, lazy: from(pages, 'ProfesionalInicioPage') },
      { path: 'solicitudes', handle: { title: 'Solicitudes nuevas' }, lazy: from(pages, 'SolicitudesNuevasPage') },
      { path: 'solicitudes/:requestId', handle: { title: 'Detalle de la solicitud' }, lazy: from(pages, 'DetalleTrabajoPage') },
      { path: 'trabajos', handle: { title: 'Mis trabajos' }, lazy: from(pages, 'TrabajosPage') },
      { path: 'trabajos/:requestId', handle: { title: 'Trabajo' }, lazy: from(pages, 'TrabajoEnProcesoPage') },
      { path: 'ganancias', handle: { title: 'Ganancias' }, lazy: from(pages, 'GananciasPage') },
      { path: 'perfil', handle: { title: 'Perfil' }, lazy: from(pages, 'PerfilPage') },
      { path: 'membresia', handle: { title: 'Membresía' }, lazy: from(pages, 'MembresiaPage') },
    ],
  },
]
