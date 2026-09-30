import type { RouteObject } from 'react-router'
import { from, layouts } from './lazy'

const pages = () => import('@/pages/admin')

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    lazy: from(layouts, 'AdminLayout'),
    children: [
      { index: true, handle: { title: 'Dashboard' }, lazy: from(pages, 'AdminDashboardPage') },
      { path: 'usuarios', handle: { title: 'Usuarios' }, lazy: from(pages, 'AdminUsuariosPage') },
      { path: 'profesionales', handle: { title: 'Profesionales' }, lazy: from(pages, 'AdminProfesionalesPage') },
      { path: 'solicitudes', handle: { title: 'Solicitudes' }, lazy: from(pages, 'AdminSolicitudesPage') },
      { path: 'finanzas', handle: { title: 'Finanzas' }, lazy: from(pages, 'AdminFinanzasPage') },
      { path: 'configuracion', handle: { title: 'Configuración' }, lazy: from(pages, 'AdminConfiguracionPage') },
    ],
  },
]
