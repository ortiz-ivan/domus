import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'

interface RotationProgressProps {
  durationMs: number
  paused: boolean
  /** Al llenarse la barra: pasar a la opción siguiente */
  onDone: () => void
  className?: string
}

/**
 * Barra que se llena mientras dura una opción de la rotación automática.
 * Montarla con `key` de la opción activa para que arranque de cero en cada cambio.
 */
export function RotationProgress({ durationMs, paused, onDone, className }: RotationProgressProps) {
  return (
    <span
      className={cn('absolute inset-x-0 bottom-0 h-0.5 origin-left animate-progress bg-accent', className)}
      style={{ animationDuration: `${durationMs}ms`, animationPlayState: paused ? 'paused' : 'running' }}
      onAnimationEnd={onDone}
      aria-hidden="true"
    />
  )
}

/** Botón para pausar o reanudar la rotación (requisito de accesibilidad para contenido que se mueve solo) */
export function RotationToggle({ autoplay, onToggle, className }: { autoplay: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
        className,
      )}
    >
      {autoplay ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
      {autoplay ? 'Pausar recorrido' : 'Reanudar recorrido'}
    </button>
  )
}
