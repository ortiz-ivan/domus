import {
  ClipboardList,
  Hammer,
  HardHat,
  House,
  Inbox,
  Landmark,
  LayoutDashboard,
  LayoutGrid,
  Settings,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { NavBadge } from '@/app/useNavBadges'
import type { Role } from '@/types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Solo activo en la ruta exacta (para los "Inicio") */
  end?: boolean
  /** Otras rutas (prefijos) que pertenecen a esta sección */
  alsoActive?: string[]
  /** Rutas bajo este prefijo que pertenecen a otra sección */
  exclude?: string[]
  /** Contador de pendientes; lo completa AppShell con useNavBadges */
  badge?: NavBadge
}

export const ROLE_HOME: Record<Role, string> = {
  cliente: '/cliente',
  profesional: '/profesional',
  admin: '/admin',
}

export const ROLE_LABELS: Record<Role, string> = {
  cliente: 'Cliente',
  profesional: 'Profesional',
  admin: 'Administrador',
}

export const NAVIGATION: Record<Role, NavItem[]> = {
  cliente: [
    { to: '/cliente', label: 'Inicio', icon: House, end: true },
    // Elegir profesional y pedir el servicio son parte de "Categorías"
    { to: '/cliente/categorias', label: 'Categorías', icon: LayoutGrid, alsoActive: ['/cliente/profesionales', '/cliente/solicitudes/nueva'] },
    { to: '/cliente/solicitudes', label: 'Mis solicitudes', icon: ClipboardList, exclude: ['/cliente/solicitudes/nueva'] },
  ],
  profesional: [
    { to: '/profesional', label: 'Inicio', icon: House, end: true },
    { to: '/profesional/solicitudes', label: 'Solicitudes', icon: Inbox },
    { to: '/profesional/trabajos', label: 'Trabajos', icon: Hammer },
    { to: '/profesional/ganancias', label: 'Ganancias', icon: Wallet },
    { to: '/profesional/perfil', label: 'Perfil', icon: UserRound },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
    { to: '/admin/profesionales', label: 'Profesionales', icon: HardHat },
    { to: '/admin/solicitudes', label: 'Solicitudes', icon: ClipboardList },
    { to: '/admin/finanzas', label: 'Finanzas', icon: Landmark },
    { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
  ],
}

const within = (pathname: string, prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`)

/** Si el ítem del menú corresponde a la pantalla actual */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.exclude?.some((p) => within(pathname, p))) return false
  if (item.end) return pathname === item.to
  return within(pathname, item.to) || Boolean(item.alsoActive?.some((p) => within(pathname, p)))
}

/** Máximo de ítems en la barra inferior móvil; con más se usa menú lateral */
export const BOTTOM_NAV_MAX = 5
