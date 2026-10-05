import { enabledRoles, parseDemoScope } from '@/app/scope'
import type { Role } from '@/types'

/** Alcance de esta build (ver app/scope.ts). netlify.toml lo fija; en desarrollo local es "full". */
export const DEMO_SCOPE = parseDemoScope(import.meta.env.VITE_DEMO_SCOPE, import.meta.env.VITE_LANDING_ONLY)

/** Solo la landing: los CTA de ingreso llevan a "Próximamente" */
export const LANDING_ONLY = DEMO_SCOPE === 'landing'

/** Crear solicitudes de servicio (en la vista previa solo de clientes está deshabilitado) */
export const CAN_REQUEST = DEMO_SCOPE === 'full' || DEMO_SCOPE === 'profesional'

/** Herramientas de la exposición (controles del presentador): solo con todos los roles */
export const PRESENTER_TOOLS = DEMO_SCOPE === 'full'

/** La app corre dentro de un celular de la vista dividida (/presentacion) */
export const IS_EMBEDDED = typeof window !== 'undefined' && window.self !== window.top

export const isRoleEnabled = (role: Role) => enabledRoles(DEMO_SCOPE).includes(role)
