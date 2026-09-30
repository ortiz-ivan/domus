import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

const STEPS = ['Confirmar', 'Calificar', 'Pagar'] as const

/**
 * Dónde está el cliente en el cierre del pedido (confirmar → calificar → pagar), arriba de cada pantalla.
 * `current` es el índice del paso actual; con 3, los tres están completos (comprobante).
 */
export function ClosingSteps({ current }: { current: 0 | 1 | 2 | 3 }) {
  const finished = current === STEPS.length
  return (
    <nav aria-label="Cierre del pedido" className="mb-6">
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        {finished ? 'Pedido cerrado' : `Paso ${current + 1} de ${STEPS.length}: ${STEPS[current].toLowerCase()}`}
      </p>
      <ol className="flex items-center gap-2">
        {STEPS.map((label, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={label} aria-current={active ? 'step' : undefined} className="flex flex-1 items-center gap-2 last:flex-none">
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
                  done ? 'border-status-done bg-status-done text-white' : active ? 'border-primary bg-primary text-on-primary' : 'border-border bg-card text-muted-foreground',
                )}
                aria-hidden="true"
              >
                {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              {/* En el celular solo se lee el paso actual: los tres nombres no entran en una línea */}
              <span className={cn('text-sm font-medium', !done && !active && 'text-muted-foreground', !active && 'max-sm:sr-only')}>
                {label}
                <span className="sr-only">{done ? ' (completado)' : active ? ' (paso actual)' : ' (pendiente)'}</span>
              </span>
              {i < STEPS.length - 1 && <span className={cn('h-0.5 min-w-4 flex-1 rounded-full', done ? 'bg-status-done' : 'bg-border')} aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
