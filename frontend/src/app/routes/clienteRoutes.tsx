import type { RouteObject } from 'react-router'
import { from, layouts } from './lazy'

const pages = () => import('@/pages/cliente')

export const clienteRoutes: RouteObject[] = [
  {
    path: '/cliente',
    lazy: from(layouts, 'ClienteLayout'),
    children: [
      { index: true, handle: { title: 'Inicio' }, lazy: from(pages, 'ClienteInicioPage') },
      { path: 'categorias', handle: { title: 'Categorías' }, lazy: from(pages, 'CategoriasPage') },
      { path: 'categorias/:categoryId', handle: { title: 'Profesionales' }, lazy: from(pages, 'ProfesionalesPage') },
      { path: 'profesionales/:professionalId', handle: { title: 'Perfil del profesional' }, lazy: from(pages, 'DetalleProfesionalPage') },
      { path: 'solicitudes', handle: { title: 'Mis solicitudes' }, lazy: from(pages, 'MisSolicitudesPage') },
      { path: 'solicitudes/nueva', handle: { title: 'Nueva solicitud' }, lazy: from(pages, 'NuevaSolicitudPage') },
      { path: 'solicitudes/:requestId', handle: { title: 'Seguimiento' }, lazy: from(pages, 'SeguimientoPage') },
      { path: 'solicitudes/:requestId/confirmar', handle: { title: 'Confirmar trabajo' }, lazy: from(pages, 'ConfirmacionPage') },
      { path: 'solicitudes/:requestId/calificar', handle: { title: 'Calificar' }, lazy: from(pages, 'CalificacionPage') },
      { path: 'solicitudes/:requestId/pago', handle: { title: 'Pago' }, lazy: from(pages, 'PagoPage') },
    ],
  },
]
