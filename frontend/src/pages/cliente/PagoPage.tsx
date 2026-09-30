import { CheckCircle2, CreditCard, Info, Landmark, Loader2, Smartphone, type LucideIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router'
import { BackLink } from '@/components/ui/BackLink'
import { Button, LinkButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input } from '@/components/ui/Field'
import { cn } from '@/lib/cn'
import { formatDate, formatDateTime, formatGs } from '@/lib/format'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { useDirectory } from '@/store/selectors'
import { toast } from '@/store/toast'
import type { PaymentMethod } from '@/types'
import { ClosingSteps } from './ClosingSteps'
import { useClientRequest } from './useClientRequest'

const METHODS: { value: PaymentMethod; label: string; hint: string; icon: LucideIcon }[] = [
  { value: 'tarjeta', label: 'Tarjeta', hint: 'Crédito o débito', icon: CreditCard },
  { value: 'transferencia', label: 'Transferencia', hint: 'Desde tu banco', icon: Landmark },
  { value: 'billetera', label: 'Billetera electrónica', hint: 'Pagá con tu celular', icon: Smartphone },
]

const METHOD_LABELS: Record<PaymentMethod, string> = { tarjeta: 'Tarjeta', transferencia: 'Transferencia', billetera: 'Billetera electrónica' }

export function PagoPage() {
  const request = useClientRequest()
  const payment = useDemoStore((s) => s.payments.find((p) => p.requestId === request?.id))
  const hasReview = useDemoStore((s) => s.reviews.some((rv) => rv.requestId === request?.id))
  const payRequest = useDemoStore((s) => s.payRequest)
  const dir = useDirectory()
  const [method, setMethod] = useState<PaymentMethod>('tarjeta')
  const [processing, setProcessing] = useState(false)

  if (!request) return <MissingResource what="esa solicitud" backTo="/cliente/solicitudes" backLabel="Mis solicitudes" />
  const base = `/cliente/solicitudes/${request.id}`
  if (request.status !== 'confirmada' && request.status !== 'pagada') return <Navigate to={base} replace />
  if (request.status === 'confirmada' && !hasReview) return <Navigate to={`${base}/calificar`} replace />

  const professional = dir.professional(request.professionalId)

  // Comprobante
  if (request.status === 'pagada') {
    return (
      <div className="mx-auto max-w-md">
        <BackLink to={base} label="Volver al seguimiento" />
        <ClosingSteps current={3} />
        <Card className="text-center">
          <span className="mx-auto inline-flex size-16 animate-fade-in items-center justify-center rounded-full bg-status-done/10">
            <CheckCircle2 className="size-9 text-status-done" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">¡Pago realizado!</h1>
          <p className="mt-1 text-muted-foreground">Gracias por confiar en Domus.</p>
          <dl className="mt-6 divide-y divide-border rounded-xl bg-muted px-4 text-left text-sm">
            {[
              ['Servicio', request.title],
              ['Profesional', professional?.name ?? ''],
              ['Solicitud', request.code],
              ['Método', payment ? METHOD_LABELS[payment.method] : '-'],
              ['Fecha', payment ? formatDateTime(payment.createdAt) : '-'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-3">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 py-3">
              <dt className="font-semibold">Total pagado</dt>
              <dd className="font-heading text-lg font-bold tabular-nums">{formatGs(request.price)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">Comprobante simulado: no se realizó ningún cobro real.</p>
          <LinkButton to="/cliente" size="lg" className="mt-6 w-full">
            Volver al inicio
          </LinkButton>
        </Card>
      </div>
    )
  }

  const pay = (event: FormEvent) => {
    event.preventDefault()
    setProcessing(true)
    // Simula la respuesta de la pasarela
    setTimeout(() => {
      payRequest(request.id, method)
      toast('Pago realizado con éxito')
    }, 1200)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink to={base} label="Volver al seguimiento" />
      <ClosingSteps current={2} />
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Resumen y pago</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_18rem] md:items-start">
        <Card>
          <form onSubmit={pay}>
            <fieldset disabled={processing}>
              <legend className="mb-3 font-semibold">Método de pago</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {METHODS.map(({ value, label, hint, icon: Icon }) => (
                  <label
                    key={value}
                    className={cn(
                      'flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-ring',
                      method === value ? 'border-primary bg-accent-soft' : 'border-border hover:bg-muted',
                    )}
                  >
                    <input type="radio" name="method" className="sr-only" checked={method === value} onChange={() => setMethod(value)} />
                    <Icon className="size-6 text-accent-text" aria-hidden="true" />
                    <span className="font-semibold">{label}</span>
                    <span className="text-xs text-muted-foreground">{hint}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {method === 'tarjeta' && (
                  <>
                    <Field label="Número de tarjeta" hint="Datos de prueba precargados.">
                      {(props) => <Input {...props} inputMode="numeric" autoComplete="cc-number" defaultValue="4242 4242 4242 4242" />}
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Vencimiento">
                        {(props) => <Input {...props} autoComplete="cc-exp" defaultValue="12/29" />}
                      </Field>
                      <Field label="CVV">
                        {(props) => <Input {...props} inputMode="numeric" autoComplete="cc-csc" defaultValue="123" />}
                      </Field>
                    </div>
                  </>
                )}
                {method === 'transferencia' && (
                  <div className="rounded-xl bg-muted p-4 text-sm">
                    <p className="font-semibold">Datos para transferir (ficticios)</p>
                    <p className="mt-2">Banco Demo S.A. · Cuenta 123-456789-0</p>
                    <p>Titular: Domus S.A. · RUC 80000000-0</p>
                    <p className="mt-2 text-muted-foreground">Usá {request.code} como referencia.</p>
                  </div>
                )}
                {method === 'billetera' && (
                  <Field label="Número de celular" hint="Vas a recibir una notificación para aprobar el pago (simulado).">
                    {(props) => <Input {...props} type="tel" autoComplete="tel" defaultValue="0981 123 456" />}
                  </Field>
                )}
              </div>
            </fieldset>

            <p className="mt-6 flex gap-2 rounded-xl border border-border p-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Pago simulado para la demo: no se procesa dinero real.
            </p>

            <Button type="submit" size="lg" className="mt-6 w-full" disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  Procesando pago…
                </>
              ) : (
                `Pagar ${formatGs(request.price)}`
              )}
            </Button>
          </form>
        </Card>

        <Card className="md:sticky md:top-8">
          <h2 className="font-semibold">Resumen</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Servicio</dt>
              <dd className="font-medium">{request.title}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Profesional</dt>
              <dd className="font-medium">{professional?.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Fecha</dt>
              <dd className="font-medium">{formatDate(request.date)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-heading text-2xl font-bold tabular-nums">{formatGs(request.price)}</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
