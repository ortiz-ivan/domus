import { CheckCircle2, Info, X } from 'lucide-react'
import { useToastStore } from '@/store/toast'

/** Región aria-live: anuncia los avisos sin mover el foco */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-24 z-50 flex flex-col items-center gap-2 sm:bottom-6 lg:left-auto lg:items-end"
    >
      {toasts.map((t) => {
        const Icon = t.tone === 'success' ? CheckCircle2 : Info
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm animate-fade-in items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm text-on-primary shadow-lg"
          >
            <Icon className="size-5 shrink-0 text-accent" aria-hidden="true" />
            <p className="flex-1">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="-mr-2 inline-flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-white/10"
              aria-label="Cerrar aviso"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
