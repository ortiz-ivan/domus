import { BadgeCheck, Bell, Check, ChevronRight, CircleCheck, Search, Star, Zap } from 'lucide-react'
import { CategoryIcon } from '@/components/CategoryIcon'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/cn'
import { estimateFor, formatRange } from '@/lib/estimates'
import { formatGs } from '@/lib/format'
import { formatResponseTime } from '@/lib/responseTime'
import { matchCategory } from '@/lib/search'
import { useDemoStore } from '@/store/demo'
import { ratingOf } from '@/store/selectors'
import { AppBar } from './PhoneFrame'
import { useScript, useTyping } from './useScript'

/**
 * Pantallas animadas de "Así de simple funciona": cada una cuenta su paso con un guion corto
 * (ver useScript). Usan los datos de la demo: María le pide a Carlos, el plomero demo.
 */
export interface ScreenProps {
  /** La sección está a la vista: recién ahí arranca el guion */
  playing: boolean
}

const SERVICE = 'Pérdidas de agua'
const QUERY = 'gotea la canilla del baño'

/** Círculo que marca un toque, como en una grabación de pantalla */
function Tap({ className }: { className?: string }) {
  return (
    <span className={cn('pointer-events-none absolute flex size-9 items-center justify-center', className)}>
      <span className="absolute size-full animate-ping rounded-full bg-primary/25" />
      <span className="size-5 rounded-full border-2 border-white bg-primary/40 shadow" />
    </span>
  )
}

function useDemoPros() {
  const professionals = useDemoStore((s) => s.professionals)
  const reviews = useDemoStore((s) => s.reviews)
  return ['p-1', 'p-2']
    .map((id) => professionals.find((p) => p.id === id))
    .filter((p) => p !== undefined)
    .map((p) => ({ p, rating: ratingOf(reviews, p) }))
}

// 1 · Elegí el servicio: escribe el problema y Domus sugiere la categoría ---------------------------

const SEARCH_SCRIPT = [700, 1700, 1100] as const

export function SearchScreen({ playing }: ScreenProps) {
  const stage = useScript(SEARCH_SCRIPT, playing)
  const typed = useTyping(QUERY, stage >= 1)
  const categories = useDemoStore((s) => s.categories)
  const match = matchCategory(QUERY, categories)

  return (
    <div className="flex h-full flex-col">
      <AppBar title="Domus" />
      <div className="flex-1 px-4 pt-4">
        <p className="text-[11px] text-muted-foreground">Hola, María</p>
        <p className="font-heading text-lg leading-tight font-bold">¿Qué necesitás arreglar?</p>
        <div className={cn('mt-3 flex h-10 items-center gap-2 rounded-xl border px-3 text-[13px]', stage >= 1 ? 'border-primary' : 'border-border')}>
          <Search className="size-4 shrink-0 text-muted-foreground" />
          {typed ? (
            <span>
              {typed}
              {stage < 2 && <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-foreground" />}
            </span>
          ) : (
            <span className="text-muted-foreground">Describí tu problema…</span>
          )}
        </div>

        {stage >= 2 && match ? (
          <div className="mt-5 animate-fade-in">
            <p className="text-[11px] font-semibold tracking-wide text-accent-text uppercase">Te sugerimos</p>
            <div
              className={cn(
                'relative mt-2 flex items-center gap-3 rounded-xl border p-3 transition-colors duration-300',
                stage >= 3 ? 'border-primary bg-accent-soft' : 'border-border',
              )}
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary">
                <CategoryIcon name={match.icon} className="size-4 text-accent" />
              </span>
              <span className="flex-1">
                <span className="block text-[13px] font-semibold">{match.name}</span>
                <span className="block text-[11px] text-muted-foreground">{SERVICE}</span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
              {stage >= 3 && <Tap className="top-1/2 right-6 -translate-y-1/2" />}
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Categorías</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {categories.slice(0, 6).map((c) => (
                <span key={c.id} className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-2 text-[11px] font-medium">
                  <CategoryIcon name={c.icon} className="size-3.5 text-accent-text" />
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 2 · Compará y solicitá: elige a Carlos por calificación, respuesta y presupuesto ------------------

const COMPARE_SCRIPT = [1200, 1000, 700] as const

export function CompareScreen({ playing }: ScreenProps) {
  const stage = useScript(COMPARE_SCRIPT, playing)
  const pros = useDemoPros()
  const chosen = pros[0]?.p

  return (
    <div className="relative flex h-full flex-col">
      <AppBar title={`Plomería · ${SERVICE}`} back />
      <div className="flex-1 space-y-3 px-4 pt-4">
        {pros.map(({ p, rating }, i) => {
          const estimate = estimateFor(p.basePrice, SERVICE)
          const highlighted = i === 0 && stage >= 1
          return (
            <div key={p.id} className={cn('rounded-xl border p-3 transition-colors duration-300', highlighted ? 'border-accent shadow-md' : 'border-border')}>
              <div className="flex items-center gap-2.5">
                <Avatar name={p.name} size="sm" />
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-[13px] font-semibold">
                    {p.name}
                    {p.verified && <BadgeCheck className="size-3.5 shrink-0 text-status-accepted" />}
                  </p>
                  <p className="flex items-center gap-1 text-[11px]">
                    <Star className="size-3 fill-accent text-accent" />
                    <span className="font-semibold">{rating.average.toFixed(1)}</span>
                    <span className="text-muted-foreground">({rating.count})</span>
                  </p>
                </div>
              </div>
              <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-status-done">
                <Zap className="size-3" />
                Responde en {formatResponseTime(p.responseMinutes)}
              </p>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-[10px] text-muted-foreground">
                  Estimado
                  {estimate && <span className="block font-heading text-[12px] font-bold text-foreground">{formatRange(estimate)}</span>}
                </p>
                <span
                  className={cn(
                    'relative rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors duration-150',
                    i === 0 && stage >= 2 ? 'bg-primary-hover text-on-primary' : 'bg-primary text-on-primary',
                  )}
                >
                  Solicitar
                  {i === 0 && stage === 2 && <Tap className="-top-2 left-1/2 -translate-x-1/2" />}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Hoja inferior: la solicitud salió */}
      {stage >= 3 && chosen && (
        <div className="absolute inset-x-0 bottom-0 animate-fade-in rounded-t-3xl border-t border-border bg-card px-5 pt-5 pb-6 shadow-[0_-12px_30px_rgb(11_31_58/0.15)]">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-status-done/10">
            <Check className="size-5 text-status-done" strokeWidth={3} />
          </span>
          <p className="mt-2 font-heading text-base font-bold">Solicitud enviada</p>
          <p className="text-[12px] text-muted-foreground">
            {chosen.name.split(' ')[0]} suele responder en {formatResponseTime(chosen.responseMinutes)}. Te avisamos apenas acepte.
          </p>
        </div>
      )}
    </div>
  )
}

// 3 · Seguí el trabajo: los estados avanzan solos y llega un aviso en cada uno ---------------------

const TRACK_SCRIPT = [1400, 1600, 1600] as const
const TRACK_STEPS = ['Solicitud enviada', 'Aceptada por Carlos', 'Trabajo en proceso', 'Trabajo terminado']
const TRACK_NOTICES = ['', 'Carlos aceptó tu solicitud', 'Carlos empezó a trabajar', 'Carlos terminó: confirmá que quedó bien']
const TRACK_BADGES = [
  { label: 'Pendiente', className: 'bg-status-pending/10 text-status-pending' },
  { label: 'Aceptada', className: 'bg-status-accepted/10 text-status-accepted' },
  { label: 'En proceso', className: 'bg-status-progress/10 text-status-progress' },
  { label: 'Terminada', className: 'bg-status-done/10 text-status-done' },
]

export function TrackScreen({ playing }: ScreenProps) {
  const current = useScript(TRACK_SCRIPT, playing)
  const badge = TRACK_BADGES[current]

  return (
    <div className="relative flex h-full flex-col">
      <AppBar title="Seguimiento" back />
      <div className="flex-1 px-4 pt-4">
        <p className="font-heading text-base leading-tight font-bold">{SERVICE}</p>
        <span key={badge.label} className={cn('mt-1.5 inline-flex animate-fade-in rounded-full px-2 py-0.5 text-[10px] font-semibold', badge.className)}>
          {badge.label}
        </span>
        <ol className="mt-4">
          {TRACK_STEPS.map((step, i) => {
            const done = i < current || (i === current && i === TRACK_STEPS.length - 1)
            return (
              <li key={step} className="relative flex gap-3 pb-4 last:pb-0">
                {i < TRACK_STEPS.length - 1 && (
                  <span
                    className={cn(
                      'absolute top-5 left-2 h-[calc(100%-1rem)] w-0.5 -translate-x-1/2 transition-colors duration-500',
                      i < current ? 'bg-status-done' : 'bg-border',
                    )}
                  />
                )}
                <span
                  className={cn(
                    'relative flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500',
                    done ? 'border-status-done bg-status-done text-white' : i === current ? 'border-primary bg-card' : 'border-border bg-card',
                  )}
                >
                  {done && <Check className="size-2.5" strokeWidth={4} />}
                  {!done && i === current && <span className="size-1.5 rounded-full bg-primary" />}
                </span>
                <span className={cn('-mt-0.5 text-[12px] transition-colors duration-500', i > current ? 'text-muted-foreground' : 'font-medium')}>{step}</span>
              </li>
            )
          })}
        </ol>
      </div>
      {current > 0 && (
        <div key={current} className="mx-3 mb-4 flex animate-fade-in items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-[11px] text-on-primary shadow-lg">
          <Bell className="size-3.5 shrink-0 text-accent" />
          <span className="flex-1">{TRACK_NOTICES[current]}</span>
        </div>
      )}
    </div>
  )
}

// 4 · Calificá y pagá: se llenan las estrellas, paga y recibe el comprobante ------------------------

const RATE_SCRIPT = [800, 220, 220, 220, 220, 1000, 1100] as const
const PAY_STAGE = 6
const PAID_STAGE = 7

export function RateScreen({ playing }: ScreenProps) {
  const stage = useScript(RATE_SCRIPT, playing)
  const carlos = useDemoStore((s) => s.professionals.find((p) => p.id === 'p-1'))
  const stars = Math.min(stage, 5)
  const price = carlos?.basePrice ?? 150000

  return (
    <div className="relative flex h-full flex-col">
      <AppBar title="Calificar y pagar" back />
      <div className="flex flex-1 flex-col items-center px-4 pt-5 text-center">
        <Avatar name={carlos?.name ?? 'Carlos Benítez'} size="lg" className="size-14 text-lg" />
        <p className="mt-3 font-heading text-base leading-tight font-bold">¿Cómo fue tu experiencia con Carlos?</p>
        <p className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={cn('size-7 transition-all duration-200', n <= stars ? 'scale-110 fill-accent text-accent' : 'text-border')}
            />
          ))}
        </p>
        <p className="mt-1 h-4 text-[12px] font-semibold">{stars === 5 ? 'Excelente' : ''}</p>
        {stars === 5 && (
          <div className="mt-2 flex animate-fade-in flex-wrap justify-center gap-1.5">
            {['Puntual', 'Prolijo'].map((tag) => (
              <span key={tag} className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-on-primary">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto mb-5 w-full">
          <div className="mb-2 flex justify-between text-[12px]">
            <span className="text-muted-foreground">Total</span>
            <span className="font-heading font-bold">{formatGs(price)}</span>
          </div>
          <span
            className={cn(
              'relative flex h-10 items-center justify-center rounded-lg text-[13px] font-semibold text-on-primary transition-colors duration-150',
              stage >= PAY_STAGE ? 'bg-primary-hover' : 'bg-primary',
            )}
          >
            Pagar {formatGs(price)}
            {stage === PAY_STAGE && <Tap className="top-1/2 left-1/2 -translate-1/2" />}
          </span>
        </div>
      </div>

      {stage >= PAID_STAGE && (
        <div className="absolute inset-0 flex animate-fade-in flex-col items-center justify-center bg-card px-6 text-center">
          <CircleCheck className="size-14 text-status-done" />
          <p className="mt-3 font-heading text-lg font-bold">¡Pago realizado!</p>
          <p className="mt-1 text-[12px] text-muted-foreground">Gracias por confiar en Domus. Tu reseña ya ayuda a otros clientes.</p>
          <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-[11px] text-muted-foreground">Comprobante enviado a tu correo</p>
        </div>
      )}
    </div>
  )
}
