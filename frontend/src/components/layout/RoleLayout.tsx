import { RequireRole } from '@/app/RequireRole'
import { AppShell } from '@/components/layout/AppShell'

// Layout de cada sección: verifica el rol y dibuja el menú. Se carga con la sección (ver app/appRoutes.tsx).

export function ClienteLayout() {
  return (
    <RequireRole role="cliente">
      <AppShell role="cliente" />
    </RequireRole>
  )
}

export function ProfesionalLayout() {
  return (
    <RequireRole role="profesional">
      <AppShell role="profesional" />
    </RequireRole>
  )
}

export function AdminLayout() {
  return (
    <RequireRole role="admin">
      <AppShell role="admin" />
    </RequireRole>
  )
}
