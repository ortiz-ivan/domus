import { createBrowserRouter } from 'react-router'
import { RequireRole } from '@/app/RequireRole'
import { AppShell } from '@/components/layout/AppShell'
import { AdminConfiguracionPage } from '@/pages/admin/AdminConfiguracionPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminFinanzasPage } from '@/pages/admin/AdminFinanzasPage'
import { AdminProfesionalesPage } from '@/pages/admin/AdminProfesionalesPage'
import { AdminSolicitudesPage } from '@/pages/admin/AdminSolicitudesPage'
import { AdminUsuariosPage } from '@/pages/admin/AdminUsuariosPage'
import { CalificacionPage } from '@/pages/cliente/CalificacionPage'
import { CategoriasPage } from '@/pages/cliente/CategoriasPage'
import { ClienteInicioPage } from '@/pages/cliente/ClienteInicioPage'
import { ConfirmacionPage } from '@/pages/cliente/ConfirmacionPage'
import { DetalleProfesionalPage } from '@/pages/cliente/DetalleProfesionalPage'
import { MisSolicitudesPage } from '@/pages/cliente/MisSolicitudesPage'
import { NuevaSolicitudPage } from '@/pages/cliente/NuevaSolicitudPage'
import { PagoPage } from '@/pages/cliente/PagoPage'
import { ProfesionalesPage } from '@/pages/cliente/ProfesionalesPage'
import { SeguimientoPage } from '@/pages/cliente/SeguimientoPage'
import { LandingPage } from '@/pages/landing/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { DetalleTrabajoPage } from '@/pages/profesional/DetalleTrabajoPage'
import { GananciasPage } from '@/pages/profesional/GananciasPage'
import { PerfilPage } from '@/pages/profesional/PerfilPage'
import { ProfesionalInicioPage } from '@/pages/profesional/ProfesionalInicioPage'
import { SolicitudesNuevasPage } from '@/pages/profesional/SolicitudesNuevasPage'
import { TrabajoEnProcesoPage } from '@/pages/profesional/TrabajoEnProcesoPage'
import { TrabajosPage } from '@/pages/profesional/TrabajosPage'
import { RoleSelectPage } from '@/pages/RoleSelectPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/ingresar', element: <RoleSelectPage /> },
  {
    path: '/cliente',
    element: (
      <RequireRole role="cliente">
        <AppShell role="cliente" />
      </RequireRole>
    ),
    children: [
      { index: true, element: <ClienteInicioPage /> },
      { path: 'categorias', element: <CategoriasPage /> },
      { path: 'categorias/:categoryId', element: <ProfesionalesPage /> },
      { path: 'profesionales/:professionalId', element: <DetalleProfesionalPage /> },
      { path: 'solicitudes', element: <MisSolicitudesPage /> },
      { path: 'solicitudes/nueva', element: <NuevaSolicitudPage /> },
      { path: 'solicitudes/:requestId', element: <SeguimientoPage /> },
      { path: 'solicitudes/:requestId/confirmar', element: <ConfirmacionPage /> },
      { path: 'solicitudes/:requestId/calificar', element: <CalificacionPage /> },
      { path: 'solicitudes/:requestId/pago', element: <PagoPage /> },
    ],
  },
  {
    path: '/profesional',
    element: (
      <RequireRole role="profesional">
        <AppShell role="profesional" />
      </RequireRole>
    ),
    children: [
      { index: true, element: <ProfesionalInicioPage /> },
      { path: 'solicitudes', element: <SolicitudesNuevasPage /> },
      { path: 'solicitudes/:requestId', element: <DetalleTrabajoPage /> },
      { path: 'trabajos', element: <TrabajosPage /> },
      { path: 'trabajos/:requestId', element: <TrabajoEnProcesoPage /> },
      { path: 'ganancias', element: <GananciasPage /> },
      { path: 'perfil', element: <PerfilPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RequireRole role="admin">
        <AppShell role="admin" />
      </RequireRole>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'usuarios', element: <AdminUsuariosPage /> },
      { path: 'profesionales', element: <AdminProfesionalesPage /> },
      { path: 'solicitudes', element: <AdminSolicitudesPage /> },
      { path: 'finanzas', element: <AdminFinanzasPage /> },
      { path: 'configuracion', element: <AdminConfiguracionPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
