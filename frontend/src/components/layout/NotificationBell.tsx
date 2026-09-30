import { Bell, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useBackHere } from '@/app/useBackHere'
import { cn } from '@/lib/cn'
import { formatDateTime } from '@/lib/format'
import { notificationFeed } from '@/lib/notifications'
import { useDemoStore } from '@/store/demo'
import { useInboxStore } from '@/store/inbox'
import type { Role } from '@/types'

/**
 * Campana con el historial de avisos (lo que hizo la otra parte). Los toasts se van solos;
 * acá queda todo, también lo que pasó con la pestaña cerrada. Abrirla marca todo como leído.
 */
export function NotificationBell({ role, userId, className }: { role: Role; userId: string; className?: string }) {
  const requests = useDemoStore((s) => s.requests)
  const users = useDemoStore((s) => s.users)
  const professionals = useDemoStore((s) => s.professionals)
  const payments = useDemoStore((s) => s.payments)
  const feed = useMemo(
    () => notificationFeed({ requests, users, professionals, payments }, { role, userId }),
    [requests, users, professionals, payments, role, userId],
  )

  const seenAt = useInboxStore((s) => s.seenAt[userId])
  const markSeen = useInboxStore((s) => s.markSeen)
  // La primera vez, lo que ya estaba en la demo cuenta como visto: solo suma lo que llegue desde ahora
  useEffect(() => {
    if (!seenAt) markSeen(userId)
  }, [seenAt, markSeen, userId])

  const unread = seenAt ? feed.filter((item) => item.at > seenAt).length : 0
  // Lo no leído al abrir sigue resaltado mientras el panel está abierto, aunque ya se marcó como visto
  const [highlightAfter, setHighlightAfter] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const backHere = useBackHere()

  const open = () => {
    setHighlightAfter(seenAt ?? null)
    markSeen(userId)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={cn('relative inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground', className)}
        aria-label={unread > 0 ? `Avisos, ${unread} sin leer` : 'Avisos'}
      >
        <Bell className="size-5" aria-hidden="true" />
        {unread > 0 && (
          <span
            className="absolute top-1.5 right-1 min-w-5 rounded-full bg-accent px-1 text-center text-[11px] leading-5 font-semibold text-on-accent tabular-nums"
            aria-hidden="true"
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Avisos"
        className="m-0 ml-auto h-dvh max-h-none w-96 max-w-[90vw] bg-card p-0 text-foreground backdrop:bg-primary/40"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-lg font-semibold">Avisos</h2>
            <button
              type="button"
              onClick={close}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg hover:bg-muted"
              aria-label="Cerrar avisos"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          {feed.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground">Todavía no hay avisos. Cuando la otra parte haga algo con tus pedidos, lo vas a ver acá.</p>
          ) : (
            <ul className="flex-1 divide-y divide-border overflow-y-auto">
              {feed.map((item) => {
                const isNew = highlightAfter !== null && item.at > highlightAfter
                const body = (
                  <>
                    <span className={cn('mt-2 size-2 shrink-0 rounded-full', isNew ? 'bg-accent' : 'bg-transparent')} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className={cn('block text-sm', isNew && 'font-semibold')}>
                        {isNew && <span className="sr-only">Nuevo: </span>}
                        {item.message}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{formatDateTime(item.at)}</span>
                    </span>
                    {item.action && <span className="shrink-0 self-center text-sm font-semibold text-accent-text">{item.action.label}</span>}
                  </>
                )
                return (
                  <li key={item.id}>
                    {item.action ? (
                      <Link to={item.action.to} state={backHere} onClick={close} className="flex gap-3 px-4 py-3 hover:bg-muted">
                        {body}
                      </Link>
                    ) : (
                      <div className="flex gap-3 px-4 py-3">{body}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </dialog>
    </>
  )
}
