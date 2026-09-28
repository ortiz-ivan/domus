import { Outlet, ScrollRestoration } from 'react-router'

/**
 * Raíz de todas las rutas. ScrollRestoration: al navegar se vuelve arriba, al ir atrás se
 * recupera la posición (volver del perfil a la landing) y un link con #ancla baja a esa sección.
 */
export function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
