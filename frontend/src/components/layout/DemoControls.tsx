import { Check, Columns2, ExternalLink, Presentation, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ROLE_HOME, ROLE_LABELS } from '@/app/navigation'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { DEMO_USER_IDS } from '@/data/seed'
import { cn } from '@/lib/cn'
import { useDemoStore } from '@/store/demo'
import { useSessionStore } from '@/store/session'
import { toast } from '@/store/toast'
import type { Role } from '@/types'

const ROLES: Role[] = ['cliente', 'profesional', 'admin']

/**
 * Botón flotante para quien presenta: cambiar de rol, abrir otro rol en una
 * pestaña nueva ya logueado y reiniciar la demo, sin pasar por los menús.
 */
export function DemoControls({ role, hasBottomNav }: { role: Role; hasBottomNav: boolean }) {
  const [open, setOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const login = useSessionStore((s) => s.login)
  const resetDemo = useDemoStore((s) => s.resetDemo)
  const navigate = useNavigate()

  const close = () => {
    setOpen(false)
    setConfirmReset(false)
  }

  const switchTo = (target: Role) => {
    login(DEMO_USER_IDS[target])
    navigate(ROLE_HOME[target])
    close()
  }

  const openTab = (target: Role) => {
    window.open(`/ingresar?como=${target}`, '_blank', 'noopener')
    close()
  }

  const reset = () => {
    resetDemo()
    navigate(ROLE_HOME[role])
    close()
    toast('Demo reiniciada: los datos volvieron al estado inicial', 'info')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Controles del presentador"
        title="Controles del presentador"
        className={cn(
          'fixed left-4 z-40 inline-flex size-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-lg transition-colors duration-150 hover:text-primary',
          hasBottomNav ? 'bottom-20' : 'bottom-4',
          'lg:bottom-6 lg:left-[17rem]',
        )}
      >
        <Presentation className="size-5" aria-hidden="true" />
      </button>

      <Dialog open={open} onClose={close} title="Controles del presentador" description="Atajos para la exposición. Solo afectan a este navegador.">
        <div className="space-y-6">
          <section>
            <h3 className="mb-2 text-sm font-semibold">Cambiar de rol en esta pestaña</h3>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <Button
                  key={r}
                  variant={r === role ? 'soft' : 'outline'}
                  size="sm"
                  onClick={() => switchTo(r)}
                  disabled={r === role}
                  aria-current={r === role ? 'true' : undefined}
                  className="disabled:opacity-100"
                >
                  {r === role && <Check className="size-4" aria-hidden="true" />}
                  {ROLE_LABELS[r]}
                </Button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-1 text-sm font-semibold">Abrir otro rol en una pestaña nueva</h3>
            <p className="mb-2 text-sm text-muted-foreground">Ideal para mostrar cómo llega la solicitud del cliente al profesional.</p>
            <div className="flex flex-col gap-2">
              {ROLES.filter((r) => r !== role).map((r) => (
                <Button key={r} variant="outline" onClick={() => openTab(r)} className="justify-between">
                  {ROLE_LABELS[r]}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-1 text-sm font-semibold">Vista dividida para la TV</h3>
            <p className="mb-2 text-sm text-muted-foreground">Cliente y profesional en dos celulares lado a lado, en esta pestaña.</p>
            <Button variant="outline" onClick={() => navigate('/presentacion')} className="w-full justify-between">
              Abrir vista dividida
              <Columns2 className="size-4" aria-hidden="true" />
            </Button>
          </section>

          <section className="border-t border-border pt-5">
            <h3 className="mb-1 text-sm font-semibold">Reiniciar datos</h3>
            <p className="mb-3 text-sm text-muted-foreground">Borra lo creado durante la demo en todas las pestañas abiertas.</p>
            {confirmReset ? (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={reset}>
                  Sí, reiniciar
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setConfirmReset(true)} className="text-destructive">
                <RotateCcw className="size-4" aria-hidden="true" />
                Reiniciar demo
              </Button>
            )}
          </section>
        </div>
      </Dialog>
    </>
  )
}
