import type { RouteObject } from 'react-router'
import { from, layouts } from './lazy'

const pages = () => import('@/pages/admin')

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    lazy: from(layouts, 'AdminLayout'),
    children: [
      { index: true, lazy: from(pages, 'AdminDashboardPage') },
      { path: 'usuarios', lazy: from(pages, 'AdminUsuariosPage') },
      { path: 'profesionales', lazy: from(pages, 'AdminProfesionalesPage') },
      { path: 'solicitudes', lazy: from(pages, 'AdminSolicitudesPage') },
      { path: 'finanzas', lazy: from(pages, 'AdminFinanzasPage') },
      { path: 'configuracion', lazy: from(pages, 'AdminConfiguracionPage') },
    ],
  },
]
