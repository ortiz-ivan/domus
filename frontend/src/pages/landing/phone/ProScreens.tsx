import { Bell, CalendarDays, Check, Inbox, Lock, MapPin, Phone, Star, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/cn'
import { estimateFor, formatRange } from '@/lib/estimates'
import { formatGs } from '@/lib/format'
import { useDemoStore } from '@/store/demo'
import { ratingOf } from '@/store/selectors'
import { Tap } from './HowItWorksScreens'
import { AppBar } from './PhoneFrame'
import type { ScreenProps } from './ProcessShowcase'
import { useScript, useTyping } from './useScript'

/**
 * Pantallas animadas de la landing de profesionales: el mismo trabajo que ve el cliente en la
 * portada, del lado de Carlos (el plomero demo): publica su perfil, le llega el pedido de María,
 * lo hace y lo cobra. Usan los datos de la demo: su precio, la comisión y sus reseñas.
 */

const SERVICE = 'Pérdidas de agua'
const CLIENT = 'María G.'
const thousands = new Intl.NumberFormat('es-PY')

function useCarlos() {
  const carlos = useDemoStore((s) => s.professionals.find((p) => p.id === 'p-1'))
  const reviews = useDemoStore((s) => s.reviews)
  const commissionRate = useDemoStore((s) => s.settings.commissionRate)
  const price = carlos?.basePrice ?? 150000
  return {
    carlos,
    price,
    net: price - Math.round(price * commissionRate),
    commissionRate,
    rating: carlos ? ratingOf(reviews, carlos) : { average: 4.8, count: 150 },
  }
}

// 1 · Mostrá tus servicios: arma su perfil y lo publica ---------------------------------------------

const PROFILE_SCRIPT = [900, 900, 1300, 900] as const

export function ProfileScreen({ playing }: ScreenProps) {
  const stage = useScript(PROFILE_SCRIPT, playing)
  const { carlos, price, rating } = useCarlos()
  const typedPrice = useTyping(thousands.format(price), stage >= 2, 110)

  return (
    <div className="relative flex h-full flex-col">
      <AppBar title="Tu perfil" />
      <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
        <p className="text-[11px] font-semibold text-muted-foreground">Tus rubros</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {['Plomería', 'Electricidad', 'Aire acondicionado'].map((name, i) => (
            <span
              key={name}
              className={cn(
                'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-300',
                i === 0 && stage >= 1 ? 'border-primary bg-primary text-on-primary' : 'border-border',
              )}
            >
              {i === 0 && stage >= 1 && <Check className="mr-1 inline size-3" strokeWidth={3} />}
              {name}
            </span>
          ))}
        </div>

        <p className="mt-4 text-[11px] font-semibold text-muted-foreground">Zona de trabajo</p>
        <span className="mt-1.5 flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-[12px]">
          <MapPin className="size-3.5 text-muted-foreground" />
          {carlos?.city ?? 'Asunción'}
        </span>

        <p className="mt-4 text-[11px] font-semibold text-muted-foreground">Precio por visita</p>
        <span className={cn('mt-1.5 flex h-9 items-center gap-1 rounded-lg border px-3 text-[12px]', stage === 2 ? 'border-primary' : 'border-border')}>
          <span className="text-muted-foreground">Gs.</span>
          {typedPrice}
          {stage === 2 && <span className="ml-px inline-block h-3.5 w-px animate-pulse bg-foreground" />}
        </span>

        <span
          className={cn(
            'relative mt-auto flex h-10 items-center justify-center rounded-lg text-[13px] font-semibold text-on-primary transition-colors duration-150',
            stage >= 3 ? 'bg-primary-hover' : 'bg-primary',
          )}
        >
          Publicar perfil
          {stage === 3 && <Tap className="top-1/2 left-1/2 -translate-1/2" />}
        </span>
      </div>

      {/* Publicado: así aparece en la lista de los clientes */}
      {stage >= 4 && (
        <div className="absolute inset-x-0 bottom-0 animate-fade-in rounded-t-3xl border-t border-border bg-card px-4 pt-4 pb-5 shadow-[0_-12px_30px_rgb(11_31_58/0.15)]">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-status-done">
            <Check className="size-3.5" strokeWidth={3} />
            Perfil publicado
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Así te ven los clientes en Plomería:</p>
          <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-accent p-2.5">
            <Avatar name={carlos?.name ?? 'Carlos Benítez'} src={carlos?.photo} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold">{carlos?.name}</p>
              <p className="flex items-center gap-1 text-[10px]">
                <Star className="size-2.5 fill-accent text-accent" />
                <span className="font-semibold">{rating.average.toFixed(1)}</span>
                <span className="text-muted-foreground">({rating.count})</span>
              </p>
            </div>
            <p className="text-right text-[9px] text-muted-foreground">
              Desde
              <span className="block font-heading text-[11px] font-bold text-foreground">{formatGs(price)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// 2 · Recibí solicitudes: llega el aviso y la solicitud aparece en su bandeja -------------------------

const INBOX_SCRIPT = [900, 1600, 1100] as const

export function InboxScreen({ playing }: ScreenProps) {
  const stage = useScript(INBOX_SCRIPT, playing)
  const { price } = useCarlos()
  const estimate = estimateFor(price, SERVICE)

  return (
    <div className="relative flex h-full flex-col">
      <AppBar title="Solicitudes nuevas" />
      <div className="flex-1 space-y-2.5 px-4 pt-4">
        {stage >= 2 && (
          <div className="animate-fade-in rounded-xl border border-accent p-3 shadow-md">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-semibold">{SERVICE}</p>
                <p className="text-[11px] text-muted-foreground">{CLIENT} · Asunción</p>
              </div>
              <span className="rounded-full bg-status-pending/10 px-2 py-0.5 text-[10px] font-semibold text-status-pending">Nueva</span>
            </div>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
              <CalendarDays className="size-3" />
              Mañana · Tarde
            </p>
            {estimate && (
              <p className="mt-1 text-[11px]">
                <span className="text-muted-foreground">El cliente vio: </span>
                <span className="font-semibold">{formatRange(estimate)}</span>
              </p>
            )}
            <div className="mt-2.5 flex gap-2">
              <span className="flex-1 rounded-md bg-primary py-1.5 text-center text-[11px] font-semibold text-on-primary">Aceptar</span>
              <span className="relative flex-1 rounded-md border border-border py-1.5 text-center text-[11px] font-semibold">
                Ver detalle
                {stage >= 3 && <Tap className="top-1/2 left-1/2 -translate-1/2" />}
              </span>
            </div>
          </div>
        )}
        <div className="rounded-xl border border-border p-3">
          <p className="text-[13px] font-semibold">Inodoro pierde agua</p>
          <p className="text-[11px] text-muted-foreground">Lucía F. · San Lorenzo</p>
        </div>
        {stage < 2 && (
          <p className="flex items-center gap-2 px-1 pt-2 text-[11px] text-muted-foreground">
            <Inbox className="size-3.5" />
            Te avisamos apenas llegue un pedido.
          </p>
        )}
      </div>

      {/* Notificación del celular */}
      {stage === 1 && (
        <div className="absolute inset-x-2 top-1 animate-fade-in rounded-2xl bg-primary p-3 text-on-primary shadow-xl">
          <p className="flex items-center gap-1.5 text-[10px] text-white/70">
            <img src="/domus_isotipo.png" alt="" width={14} height={14} className="size-3.5 rounded" />
            Domus · ahora
          </p>
          <p className="mt-1 text-[12px] font-semibold">Nueva solicitud de {CLIENT}</p>
          <p className="text-[11px] text-white/85">{SERVICE} · Asunción</p>
        </div>
      )}
    </div>
  )
}

// 3 · Hacé el trabajo: acepta, ve el contacto, inicia y termina; el cliente se entera solo -----------

const JOB_SCRIPT = [800, 500, 1000, 500, 1000, 500] as const
const JOB_STATES = [
  { badge: 'Pendiente', tone: 'bg-status-pending/10 text-status-pending', action: 'Aceptar trabajo' },
  { badge: 'Aceptada', tone: 'bg-status-accepted/10 text-status-accepted', action: 'Iniciar trabajo' },
  { badge: 'En proceso', tone: 'bg-status-progress/10 text-status-progress', action: 'Marcar como terminado' },
  { badge: 'Terminada', tone: 'bg-status-done/10 text-status-done', action: 'Esperando confirmación' },
]

export function JobScreen({ playing }: ScreenProps) {
  const stage = useScript(JOB_SCRIPT, playing)
  // Etapas pares: un estado; impares: el toque sobre su botón
  const state = Math.floor(stage / 2)
  const tapping = stage % 2 === 1
  const current = JOB_STATES[state]
  const accepted = state >= 1

  return (
    <div className="relative flex h-full flex-col">
      <AppBar title="Detalle del trabajo" back />
      <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
        <p className="font-heading text-base leading-tight font-bold">{SERVICE}</p>
        <span key={current.badge} className={cn('mt-1.5 inline-flex w-fit animate-fade-in rounded-full px-2 py-0.5 text-[10px] font-semibold', current.tone)}>
          {current.badge}
        </span>
        <p className="mt-3 text-[12px] text-muted-foreground">Gotea la cañería debajo de la pileta de la cocina desde ayer.</p>

        <div className="mt-4 rounded-xl border border-border p-3">
          <div className="flex items-center gap-2.5">
            <Avatar name="María González" size="sm" />
            <div>
              <p className="text-[12px] font-semibold">María González</p>
              {accepted ? (
                <p className="flex animate-fade-in items-center gap-1 text-[11px] font-medium text-primary">
                  <Phone className="size-3" />
                  0981 123 456
                </p>
              ) : (
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Lock className="size-3" />
                  Contacto visible al aceptar
                </p>
              )}
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1 border-t border-border pt-2 text-[11px] text-muted-foreground">
            <MapPin className="size-3" />
            {accepted ? 'Av. España 1234, Asunción' : 'Asunción (dirección al aceptar)'}
          </p>
        </div>

        <span
          className={cn(
            'relative mt-auto flex h-10 items-center justify-center rounded-lg text-[13px] font-semibold transition-colors duration-150',
            state === 3 ? 'border border-border text-muted-foreground' : tapping ? 'bg-primary-hover text-on-primary' : 'bg-primary text-on-primary',
          )}
        >
          {current.action}
          {tapping && <Tap className="top-1/2 left-1/2 -translate-1/2" />}
        </span>
      </div>

      {state === 3 && (
        <div className="absolute inset-x-3 bottom-18 flex animate-fade-in items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-[11px] text-on-primary shadow-lg">
          <Bell className="size-3.5 shrink-0 text-accent" />
          <span className="flex-1">Le avisamos a María para que confirme y pague</span>
        </div>
      )}
    </div>
  )
}

// 4 · Cobrá y crecé: entra el pago ya sin la comisión y llega una reseña nueva ----------------------

const EARNINGS_SCRIPT = [900, 1000, 1200] as const

export function EarningsScreen({ playing }: ScreenProps) {
  const stage = useScript(EARNINGS_SCRIPT, playing)
  const { net, commissionRate, rating } = useCarlos()
  const payments = useDemoStore((s) => s.payments)
  const requests = useDemoStore((s) => s.requests)

  // Lo cobrado por Carlos en los últimos 30 días, de los datos de la demo (la fecha de corte se fija al montar)
  const [since] = useState(() => Date.now() - 30 * 86_400_000)
  const monthNet = payments
    .filter((p) => new Date(p.createdAt).getTime() >= since && requests.find((r) => r.id === p.requestId)?.professionalId === 'p-1')
    .reduce((sum, p) => sum + p.amount - p.fee, 0)
  const paid = stage >= 1

  return (
    <div className="relative flex h-full flex-col">
      <AppBar title="Ganancias" />
      <div className="flex-1 px-4 pt-4">
        <div className="rounded-2xl bg-primary p-4 text-on-primary">
          <p className="text-[11px] text-white/75">Últimos 30 días</p>
          <p key={paid ? 'con-pago' : 'sin-pago'} className="animate-fade-in font-heading text-2xl font-bold">
            {formatGs(monthNet + (paid ? net : 0))}
          </p>
          {paid && (
            <p className="mt-0.5 flex animate-fade-in items-center gap-1 text-[11px] font-semibold text-accent">
              <TrendingUp className="size-3" />+{formatGs(net)} hoy
            </p>
          )}
        </div>

        <p className="mt-4 text-[11px] font-semibold text-muted-foreground">Últimos cobros</p>
        <ul className="mt-2 space-y-2">
          {paid && (
            <li className="flex animate-fade-in items-center justify-between rounded-xl border border-status-done/40 bg-status-done/5 p-2.5">
              <span>
                <span className="block text-[12px] font-semibold">
                  {CLIENT} · {SERVICE}
                </span>
                <span className="block text-[10px] text-muted-foreground">Comisión Domus ({Math.round(commissionRate * 100)}%) ya descontada</span>
              </span>
              <span className="font-heading text-[12px] font-bold text-status-done">+{formatGs(net)}</span>
            </li>
          )}
          <li className="flex items-center justify-between rounded-xl border border-border p-2.5">
            <span className="block text-[12px] font-semibold">Lucía F. · Inodoro</span>
            <span className="font-heading text-[12px] font-bold">+{formatGs(net)}</span>
          </li>
        </ul>

        {stage >= 2 && (
          <div className="mt-4 animate-fade-in rounded-xl border border-accent p-3">
            <p className="flex items-center justify-between text-[11px]">
              <span className="font-semibold">Reseña nueva de {CLIENT}</span>
              <span className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="size-3 fill-accent text-accent" />
                ))}
              </span>
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">“Muy prolijo y puntual.”</p>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Tu calificación: <span className="font-semibold text-foreground">{rating.average.toFixed(1)}</span> · {rating.count + 1} reseñas
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
