import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { documentTitle, isRoleSection, usePageTitle } from '@/app/pageTitle'

/**
 * Raíz de todas las rutas. ScrollRestoration: al navegar se vuelve arriba, al ir atrás se
 * recupera la posición (volver del perfil a la landing) y un link con #ancla baja a esa sección.
 */
export function RootLayout() {
  const page = usePageTitle()
  const { pathname } = useLocation()
  const inRoleSection = isRoleSection(pathname)

  // Título de las páginas públicas (en las secciones de cada rol lo pone AppShell, con los pendientes)
  useEffect(() => {
    if (!inRoleSection) document.title = documentTitle({ page })
  }, [page, inRoleSection])

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
