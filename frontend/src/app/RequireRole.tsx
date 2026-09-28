import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { ROLE_HOME } from '@/app/navigation'
import { useCurrentUser } from '@/store/selectors'
import type { Role } from '@/types'

/** Sin sesión → /ingresar. Con otro rol → su propio inicio. */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const user = useCurrentUser()
  if (!user) return <Navigate to="/ingresar" replace />
  if (user.role !== role) return <Navigate to={ROLE_HOME[user.role]} replace />
  return children
}
