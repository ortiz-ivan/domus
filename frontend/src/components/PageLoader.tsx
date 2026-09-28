import { Loader2 } from 'lucide-react'

/**
 * Mientras se descarga el código de una sección. Aparece recién a los 300 ms:
 * en una carga rápida no hay parpadeo.
 */
export function PageLoader() {
  return (
    <div role="status" className="flex min-h-dvh items-center justify-center opacity-0 animate-[fade-in_200ms_ease-out_300ms_forwards]">
      <Loader2 className="size-8 animate-spin text-accent-text" aria-hidden="true" />
      <span className="sr-only">Cargando…</span>
    </div>
  )
}
