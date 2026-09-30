import { ArrowLeft } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { readBack } from '@/app/useBackHere'

const pathOf = (to: string) => to.split(/[?#]/)[0]

/**
 * Volver a la pantalla anterior. Si se llegó desde un link con useBackHere(), vuelve ahí con el
 * historial (el navegador recupera el scroll); si no (link directo, pestaña nueva), va a `to`,
 * la pantalla padre fija. Si el origen es la misma pantalla que `to`, se queda el `label` fijo,
 * que es más específico ("Volver a plomería" en vez de "Profesionales").
 */
export function BackLink({ to, label }: { to: string; label: string }) {
  const location = useLocation()
  const saved = readBack(location.state)
  // Un aviso que lleva a la pantalla en la que ya estabas no es un origen: sería volver a la misma
  const back = saved && pathOf(saved.to) !== location.pathname ? saved : null
  const navigate = useNavigate()

  const href = back?.to ?? to
  const text = back && pathOf(back.to) !== pathOf(to) ? back.label : label

  const goBack = (event: MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/Cmd/Shift o rueda: que el navegador abra el link como siempre
    if (!back || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(-1)
  }

  return (
    <Link
      to={href}
      onClick={goBack}
      className="-ml-2 mb-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {text}
    </Link>
  )
}
