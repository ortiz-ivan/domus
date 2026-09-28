import type { ComponentType } from 'react'
import type { RouteObject } from 'react-router'

/*
 * Rutas de la app (ingreso + los tres roles). No se incluyen en el build "solo landing".
 * Carga diferida: el código de cada rol se descarga recién al entrar a su sección, así la
 * portada no carga las 22 pantallas. Cada rol es un solo archivo (su index.ts agrupa las pantallas).
 */

/** Toma un componente de un módulo que se importa al navegar a la ruta. `name` se valida contra los exports. */
const from = <M,>(load: () => Promise<M>, name: keyof M) => ({
  Component: async () => (await load())[name] as ComponentType,
})

const clientePages = () => import('@/pages/cliente')
const profesionalPages = () => import('@/pages/profesional')
const adminPages = () => import('@/pages/admin')
const layouts = () => import('@/components/layout/RoleLayout')

export const appRoutes: RouteObject[] = [
  { path: '/ingresar', lazy: from(() => import('@/pages/RoleSelectPage'), 'RoleSelectPage') },
  {
    path: '/cliente',
    lazy: from(layouts, 'ClienteLayout'),
    children: [
      { index: true, lazy: from(clientePages, 'ClienteInicioPage') },
      { path: 'categorias', lazy: from(clientePages, 'CategoriasPage') },
      { path: 'categorias/:categoryId', lazy: from(clientePages, 'ProfesionalesPage') },
      { path: 'profesionales/:professionalId', lazy: from(clientePages, 'DetalleProfesionalPage') },
      { path: 'solicitudes', lazy: from(clientePages, 'MisSolicitudesPage') },
      { path: 'solicitudes/nueva', lazy: from(clientePages, 'NuevaSolicitudPage') },
      { path: 'solicitudes/:requestId', lazy: from(clientePages, 'SeguimientoPage') },
      { path: 'solicitudes/:requestId/confirmar', lazy: from(clientePages, 'ConfirmacionPage') },
      { path: 'solicitudes/:requestId/calificar', lazy: from(clientePages, 'CalificacionPage') },
      { path: 'solicitudes/:requestId/pago', lazy: from(clientePages, 'PagoPage') },
    ],
  },
  {
    path: '/profesional',
    lazy: from(layouts, 'ProfesionalLayout'),
    children: [
      { index: true, lazy: from(profesionalPages, 'ProfesionalInicioPage') },
      { path: 'solicitudes', lazy: from(profesionalPages, 'SolicitudesNuevasPage') },
      { path: 'solicitudes/:requestId', lazy: from(profesionalPages, 'DetalleTrabajoPage') },
      { path: 'trabajos', lazy: from(profesionalPages, 'TrabajosPage') },
      { path: 'trabajos/:requestId', lazy: from(profesionalPages, 'TrabajoEnProcesoPage') },
      { path: 'ganancias', lazy: from(profesionalPages, 'GananciasPage') },
      { path: 'perfil', lazy: from(profesionalPages, 'PerfilPage') },
    ],
  },
  {
    path: '/admin',
    lazy: from(layouts, 'AdminLayout'),
    children: [
      { index: true, lazy: from(adminPages, 'AdminDashboardPage') },
      { path: 'usuarios', lazy: from(adminPages, 'AdminUsuariosPage') },
      { path: 'profesionales', lazy: from(adminPages, 'AdminProfesionalesPage') },
      { path: 'solicitudes', lazy: from(adminPages, 'AdminSolicitudesPage') },
      { path: 'finanzas', lazy: from(adminPages, 'AdminFinanzasPage') },
      { path: 'configuracion', lazy: from(adminPages, 'AdminConfiguracionPage') },
    ],
  },
]
