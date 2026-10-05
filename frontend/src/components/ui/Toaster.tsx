import { Bell, CheckCircle2, Info, X, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useBackHere } from '@/app/useBackHere'
import { NOTICE_DURATION_MS, useToastStore, type Toast } from '@/store/toast'

const ICONS: Record<Toast['tone'], LucideIcon> = { success: CheckCircle2, info: Info, notice: Bell }

function ToastAction({ toast, onDismiss, className }: { toast: Toast; onDismiss: () => void; className: string }) {
  const backHere = useBackHere()
  if (!toast.action) return null
  return (
    <Link to={toast.action.to} state={backHere} onClick={onDismiss} className={className}>
      {toast.action.label}
    </Link>
  )
}

/**
 * Aviso de lo que hizo la otra parte, con el estilo de una notificación del celular.
 * Se cierra solo; mientras el puntero (o el foco) está encima, se pausa.
 */
function NoticeToast({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false)
  const remaining = useRef(NOTICE_DURATION_MS)

  useEffect(() => {
    if (paused) return
    const startedAt = Date.now()
    const timer = setTimeout(onDismiss, remaining.current)
    return () => {
      clearTimeout(timer)
      remaining.current -= Date.now() - startedAt
    }
  }, [paused, onDismiss])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto relative w-full max-w-md animate-notice-in overflow-hidden rounded-2xl border border-accent/50 bg-card text-foreground shadow-2xl ring-4 ring-accent/25"
    >
      <div className="flex items-start gap-3 p-4">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
          <Bell className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-accent-text uppercase">Domus · ahora</p>
          <p className="mt-0.5 text-base leading-snug font-semibold [overflow-wrap:anywhere]">{toast.message}</p>
          <ToastAction
            toast={toast}
            onDismiss={onDismiss}
            className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary hover:bg-primary-hover"
          />
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="-mt-1 -mr-2 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Cerrar aviso"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      {/* Tiempo que le queda al aviso (es solo visual: lo cierra el temporizador) */}
      <span
        className="absolute inset-x-0 bottom-0 h-1 origin-left animate-progress bg-accent motion-reduce:hidden"
        style={{ animationDuration: `${NOTICE_DURATION_MS}ms`, animationDirection: 'reverse', animationPlayState: paused ? 'paused' : 'running' }}
        aria-hidden="true"
      />
    </div>
  )
}

/** Región aria-live: anuncia los avisos sin mover el foco */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)
  const notices = toasts.filter((t) => t.tone === 'notice')
  const own = toasts.filter((t) => t.tone !== 'notice')

  return (
    <>
      {/* Lo que hizo la otra parte: arriba, como las notificaciones del celular */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-3 top-3 z-50 flex flex-col items-center gap-2 lg:top-6 lg:right-6 lg:left-auto lg:items-end">
        {notices.map((t) => (
          <NoticeToast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>

      {/* Confirmaciones de lo que hizo el usuario: abajo, discretas */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-36 z-50 flex flex-col items-center gap-2 lg:bottom-6 lg:left-auto lg:items-end"
      >
        {own.map((t) => {
          const Icon = ICONS[t.tone]
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex w-full max-w-sm animate-fade-in items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm text-on-primary shadow-lg"
            >
              <Icon className="size-5 shrink-0 text-accent" aria-hidden="true" />
              <p className="flex-1">{t.message}</p>
              <ToastAction
                toast={t}
                onDismiss={() => dismiss(t.id)}
                className="inline-flex min-h-9 shrink-0 items-center rounded-lg bg-accent px-3 font-semibold text-on-accent hover:brightness-95"
              />
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
    </>
  )
}
