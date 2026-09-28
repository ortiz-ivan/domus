import type { RouteObject } from 'react-router'
import { from, layouts } from './lazy'

const pages = () => import('@/pages/cliente')

export const clienteRoutes: RouteObject[] = [
  {
    path: '/cliente',
    lazy: from(layouts, 'ClienteLayout'),
    children: [
      { index: true, lazy: from(pages, 'ClienteInicioPage') },
      { path: 'categorias', lazy: from(pages, 'CategoriasPage') },
      { path: 'categorias/:categoryId', lazy: from(pages, 'ProfesionalesPage') },
      { path: 'profesionales/:professionalId', lazy: from(pages, 'DetalleProfesionalPage') },
      { path: 'solicitudes', lazy: from(pages, 'MisSolicitudesPage') },
      { path: 'solicitudes/nueva', lazy: from(pages, 'NuevaSolicitudPage') },
      { path: 'solicitudes/:requestId', lazy: from(pages, 'SeguimientoPage') },
      { path: 'solicitudes/:requestId/confirmar', lazy: from(pages, 'ConfirmacionPage') },
      { path: 'solicitudes/:requestId/calificar', lazy: from(pages, 'CalificacionPage') },
      { path: 'solicitudes/:requestId/pago', lazy: from(pages, 'PagoPage') },
    ],
  },
]
