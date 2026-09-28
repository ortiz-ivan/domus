import { Info, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { PlanCards } from '@/components/PlanCards'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatGs } from '@/lib/format'
import { planOf, planRank, PLANS, type Plan } from '@/lib/plans'
import { useDemoStore } from '@/store/demo'
import { useCurrentProfessional } from '@/store/selectors'
import { toast } from '@/store/toast'
import type { PlanId } from '@/types'

const isPlanId = (value: string | null): value is PlanId => PLANS.some((p) => p.id === value)

/** Membresía simulada: el cambio de plan no cobra nada, pero sí cambia la visibilidad en la plataforma */
export function MembresiaPage() {
  const professional = useCurrentProfessional()
  const setPlan = useDemoStore((s) => s.setProfessionalPlan)
  const [params] = useSearchParams()
  const [pending, setPending] = useState<Plan | null>(null)
  const [processing, setProcessing] = useState(false)

  if (!professional) return null

  const requested = params.get('plan')
  const current = professional.plan

  const confirm = () => {
    if (!pending) return
    setProcessing(true)
    // Simula la confirmación del pago de la suscripción
    setTimeout(() => {
      setPlan(professional.id, pending.id)
      toast(
        pending.id === 'basico'
          ? 'Volviste al plan Básico'
          : `¡Listo! Ya sos ${pending.name}: tu perfil aparece antes en tu categoría`,
      )
      setProcessing(false)
      setPending(null)
    }, 900)
  }

  const isUpgrade = pending ? planRank(pending.id) > planRank(current) : false

  return (
    <>
      <BackLink to="/profesional/perfil" label="Perfil" />
      <PageHeader
        title="Membresía"
        description={`Tu plan actual es ${planOf(current).name}. Cambialo cuando quieras para ganar visibilidad.`}
      />

      <p className="mb-8 flex gap-2 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Membresías simuladas para la demo: no se cobra nada. El cambio de plan se ve al instante en los listados y en la portada.
      </p>

      <PlanCards
        current={current}
        highlighted={isPlanId(requested) ? requested : current}
        action={(plan) =>
          plan.id === current ? (
            <Button variant="soft" className="w-full" disabled>
              Plan actual
            </Button>
          ) : (
            <Button variant={planRank(plan.id) > planRank(current) ? 'primary' : 'outline'} className="w-full" onClick={() => setPending(plan)}>
              {planRank(plan.id) > planRank(current) ? `Pasar a ${plan.name}` : `Cambiar a ${plan.name}`}
            </Button>
          )
        }
      />

      <Dialog
        open={Boolean(pending)}
        onClose={() => !processing && setPending(null)}
        title={pending ? `${isUpgrade ? 'Pasar' : 'Cambiar'} a ${pending.name}` : ''}
        description={
          pending
            ? pending.priceMonthly === 0
              ? 'Tu perfil deja de tener insignia y vuelve al orden normal de tu categoría.'
              : `Se debita ${formatGs(pending.priceMonthly)} por mes (simulado). Podés cambiar de plan cuando quieras.`
            : ''
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setPending(null)} disabled={processing}>
              Cancelar
            </Button>
            <Button onClick={confirm} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Activando…
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </>
        }
      />
    </>
  )
}
