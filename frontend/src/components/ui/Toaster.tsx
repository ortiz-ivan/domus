import { Bell, CheckCircle2, Info, X, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router'
import { useToastStore, type Toast } from '@/store/toast'

const ICONS: Record<Toast['tone'], LucideIcon> = { success: CheckCircle2, info: Info, notice: Bell }

/** Región aria-live: anuncia los avisos sin mover el foco */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-36 z-50 flex flex-col items-center gap-2 lg:bottom-6 lg:left-auto lg:items-end"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.tone]
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm animate-fade-in items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm text-on-primary shadow-lg"
          >
            <Icon className="size-5 shrink-0 text-accent" aria-hidden="true" />
            <p className="flex-1">{t.message}</p>
            {t.action && (
              <Link
                to={t.action.to}
                onClick={() => dismiss(t.id)}
                className="inline-flex min-h-9 shrink-0 items-center rounded-lg bg-accent px-3 font-semibold text-on-accent hover:brightness-95"
              >
                {t.action.label}
              </Link>
            )}
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
