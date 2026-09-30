import { RefreshCw, TriangleAlert } from 'lucide-react'
import { useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import { Button, LinkButton } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { isChunkLoadError } from '@/lib/chunkError'
import { NotFoundPage } from '@/pages/NotFoundPage'

const RELOAD_KEY = 'domus-chunk-reload'
/** Si ya se recargó hace menos de esto, no se vuelve a intentar: se muestra la pantalla */
const RELOAD_WINDOW_MS = 10_000

/** Recarga una sola vez: evita un bucle si el archivo de verdad no existe */
function reloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY))
    if (last && Date.now() - last < RELOAD_WINDOW_MS) return false
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  } catch {
    return false
  }
  window.location.reload()
  return true
}

/**
 * Pantalla de error de todas las rutas. El caso típico: hubo un deploy con la demo abierta
 * y la sección que se quiere abrir apunta a archivos que ya no existen. Ahí se recarga sola
 * para traer la versión nueva; cualquier otro error muestra un aviso con salida.
 */
export function RouteErrorPage() {
  const error = useRouteError()
  const chunkError = isChunkLoadError(error)

  useEffect(() => {
    if (import.meta.env.DEV) console.error(error)
    if (chunkError) reloadOnce()
  }, [error, chunkError])

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <EmptyState
        icon={TriangleAlert}
        title={chunkError ? 'Hay una versión nueva de Domus' : 'Algo salió mal'}
        description={
          chunkError
            ? 'Recargá la página para seguir con la versión actualizada.'
            : 'Ocurrió un error inesperado. Probá recargar la página o volver al inicio.'
        }
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="size-5" aria-hidden="true" />
              Recargar
            </Button>
            <LinkButton to="/" variant="outline" reloadDocument>
              Volver al inicio
            </LinkButton>
          </div>
        }
      />
    </main>
  )
}
