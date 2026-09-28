import {
  BadgeCheck,
  BatteryFull,
  Bell,
  Check,
  ChevronLeft,
  ClipboardList,
  House,
  LayoutGrid,
  ShieldCheck,
  Signal,
  Star,
  Timer,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useState, type ComponentType, type ReactNode } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { RotationProgress, RotationToggle } from '@/components/ui/RotationProgress'
import { cn } from '@/lib/cn'
import { formatGs } from '@/lib/format'
import { useAutoRotate } from '@/lib/useAutoRotate'
import { useDemoStore } from '@/store/demo'
import { ratingOf } from '@/store/selectors'

type FeatureId = 'rapido' | 'confianza' | 'seguimiento'

interface Feature {
  id: FeatureId
  icon: LucideIcon
  title: string
  text: string
  /** Tarjeta flotante junto al celular (solo escritorio) */
  float: { icon: LucideIcon; title: string; hint: string }
}

const FEATURES: Feature[] = [
  {
    id: 'rapido',
    icon: Zap,
    title: 'Contratá más rápido.',
    text: 'Contanos qué necesitás con tus palabras, respondé un par de preguntas y te mostramos a los indicados.',
    float: { icon: Timer, title: 'Solicitud enviada', hint: 'en menos de 1 minuto' },
  },
  {
    id: 'confianza',
    icon: ShieldCheck,
    title: 'Solo profesionales de confianza.',
    text: 'Verificamos a cada profesional y ves las calificaciones reales de otros clientes antes de elegir.',
    float: { icon: BadgeCheck, title: 'Identidad verificada', hint: 'en cada profesional destacado' },
  },
  {
    id: 'seguimiento',
    icon: ClipboardList,
    title: 'Seguí tu trabajo de principio a fin.',
    text: 'Sabés en todo momento en qué estado está tu servicio, y pagás recién cuando confirmás que quedó bien.',
    float: { icon: Bell, title: 'Avisos en tiempo real', hint: 'en cada cambio de estado' },
  },
]

// ---------------------------------------------------------------------------
// Pantallas del celular: imitan las de la app real (mismos componentes visuales)

function AppBar({ title, back = false }: { title: string; back?: boolean }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
      {back ? (
        <ChevronLeft className="size-4 text-muted-foreground" />
      ) : (
        <img src="/domus_isotipo.png" alt="" width={20} height={20} className="size-5 rounded" />
      )}
      <p className="font-heading text-sm font-semibold">{title}</p>
    </div>
  )
}

function RequestScreen() {
  const options = [
    { title: 'Lo necesito ya', hint: 'Dentro de 48 horas' },
    { title: 'Esta semana', hint: 'No es urgente' },
    { title: 'Elegir una fecha', hint: 'Tengo un día en mente' },
  ]
  return (
    <div className="flex h-full flex-col">
      <AppBar title="Nueva solicitud" back />
      <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
        <p className="text-[11px] font-medium text-muted-foreground">Paso 3 de 5</p>
        <div className="mt-1.5 flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={cn('h-1 flex-1 rounded-full', i <= 2 ? 'bg-primary' : 'bg-border')} />
          ))}
        </div>
        <p className="mt-4 font-heading text-lg leading-tight font-bold">¿Para cuándo lo necesitás?</p>
        <ul className="mt-4 space-y-2.5">
          {options.map((option, i) => (
            <li
              key={option.title}
              className={cn('flex items-center gap-3 rounded-xl border p-3', i === 0 ? 'border-primary bg-accent-soft' : 'border-border')}
            >
              <span className={cn('size-4 shrink-0 rounded-full', i === 0 ? 'border-[5px] border-primary' : 'border-2 border-muted-foreground/60')} />
              <span>
                <span className="block text-[13px] font-semibold">{option.title}</span>
                <span className="block text-[11px] text-muted-foreground">{option.hint}</span>
              </span>
            </li>
          ))}
        </ul>
        <span className="mt-auto flex h-10 items-center justify-center rounded-lg bg-primary text-[13px] font-semibold text-on-primary">
          Continuar
        </span>
      </div>
    </div>
  )
}

function ProsScreen() {
  const professionals = useDemoStore((s) => s.professionals)
  const reviews = useDemoStore((s) => s.reviews)
  // Plomeros reales de los datos de la demo, los mejor calificados primero
  const pros = professionals
    .filter((p) => p.categoryIds.includes('plomeria'))
    .map((p) => ({ p, rating: ratingOf(reviews, p) }))
    .sort((a, b) => b.rating.average - a.rating.average)
    .slice(0, 2)

  return (
    <div className="flex h-full flex-col">
      <AppBar title="Plomería" back />
      <div className="flex-1 space-y-3 px-4 pt-4 pb-5">
        <div className="flex gap-2">
          <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-on-primary">Mejor calificados</span>
          <span className="rounded-full border border-border px-3 py-1 text-[11px] font-medium">Verificados</span>
        </div>
        {pros.map(({ p, rating }, i) => (
          <div key={p.id} className={cn('rounded-xl border p-3', i === 0 ? 'border-accent' : 'border-border')}>
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
                  <span className="text-muted-foreground">
                    ({rating.count}) · {p.jobsCompleted} trabajos
                  </span>
                </p>
              </div>
            </div>
            {i === 0 && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold">
                <Star className="size-2.5 fill-accent text-accent" />
                Top Domus
              </span>
            )}
            <div className="mt-2 flex items-end justify-between">
              <p className="text-[10px] text-muted-foreground">
                Desde <span className="block font-heading text-[13px] font-bold text-foreground">{formatGs(p.basePrice)}</span>
              </p>
              <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-on-primary">Solicitar</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrackingScreen() {
  const steps = ['Solicitud enviada', 'Aceptada por Carlos', 'Trabajo en proceso', 'Trabajo terminado', 'Calificar y pagar']
  const current = 2
  return (
    <div className="relative flex h-full flex-col">
      <AppBar title="Seguimiento" back />
      <div className="flex-1 px-4 pt-4">
        <p className="font-heading text-base leading-tight font-bold">Pérdida de agua bajo la pileta</p>
        <span className="mt-1.5 inline-flex rounded-full bg-status-progress/10 px-2 py-0.5 text-[10px] font-semibold text-status-progress">En proceso</span>
        <ol className="mt-4">
          {steps.map((step, i) => (
            <li key={step} className="relative flex gap-3 pb-3.5 last:pb-0">
              {i < steps.length - 1 && (
                <span className={cn('absolute top-5 left-2 h-[calc(100%-1rem)] w-0.5 -translate-x-1/2', i < current ? 'bg-status-done' : 'bg-border')} />
              )}
              <span
                className={cn(
                  'relative flex size-4 shrink-0 items-center justify-center rounded-full border-2',
                  i < current ? 'border-status-done bg-status-done text-white' : i === current ? 'border-primary bg-card' : 'border-border bg-card',
                )}
              >
                {i < current && <Check className="size-2.5" strokeWidth={4} />}
                {i === current && <span className="size-1.5 rounded-full bg-primary" />}
              </span>
              <span className={cn('-mt-0.5 text-[12px]', i > current ? 'text-muted-foreground' : 'font-medium')}>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      {/* Aviso en vivo, como los de la app */}
      <div className="mx-3 mb-2 flex animate-fade-in items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-[11px] text-on-primary shadow-lg [animation-delay:400ms] [animation-fill-mode:backwards]">
        <Bell className="size-3.5 shrink-0 text-accent" />
        <span className="flex-1">Carlos empezó a trabajar en tu solicitud</span>
      </div>
      {/* Menú inferior de la app */}
      <div className="flex justify-around border-t border-border px-2 pt-2 pb-3 text-[9px] text-muted-foreground">
        {[
          { icon: House, label: 'Inicio' },
          { icon: LayoutGrid, label: 'Categorías' },
          { icon: ClipboardList, label: 'Solicitudes', active: true },
        ].map(({ icon: Icon, label, active }) => (
          <span key={label} className={cn('flex flex-col items-center gap-0.5', active && 'font-semibold text-primary')}>
            <Icon className="size-4" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Tiempo de cada opción en la rotación automática (escritorio) */
const ROTATE_MS = 6000

const SCREENS: Record<FeatureId, ComponentType> = {
  rapido: RequestScreen,
  confianza: ProsScreen,
  seguimiento: TrackingScreen,
}

// ---------------------------------------------------------------------------

/** Celular decorativo: el texto de cada opción ya describe lo que muestra, por eso aria-hidden */
function Phone({ feature, withFloat = false }: { feature: Feature; withFloat?: boolean }) {
  const Screen = SCREENS[feature.id]
  const FloatIcon = feature.float.icon
  return (
    <div className={cn('relative mx-auto w-full max-w-[18.5rem]', withFloat && 'xl:mr-4')} aria-hidden="true">
      {/* Halo detrás del celular */}
      <div className="absolute inset-x-[-15%] top-[10%] -z-10 aspect-square rounded-full bg-accent-soft" />

      <div className="rounded-[2.75rem] bg-primary p-2.5 shadow-2xl ring-1 ring-primary/20">
        <div className="relative h-[31rem] overflow-hidden rounded-[2.25rem] bg-card text-foreground">
          {/* Barra de estado + isla */}
          <div className="relative flex h-9 items-center justify-between px-6 text-[11px] font-semibold">
            <span>9:41</span>
            <span className="absolute top-2 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-primary" />
            <span className="flex items-center gap-1">
              <Signal className="size-3" />
              <Wifi className="size-3" />
              <BatteryFull className="size-3.5" />
            </span>
          </div>
          <div key={feature.id} className="h-[calc(100%-2.25rem)] animate-fade-in">
            <Screen />
          </div>
        </div>
      </div>

      {withFloat && (
        // Afuera del celular, a su izquierda: solo desde xl, donde hay lugar sin pisar las opciones
        <div
          key={`float-${feature.id}`}
          className="absolute top-1/4 right-full mr-6 hidden w-52 animate-fade-in items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xl xl:flex"
        >
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft">
            <FloatIcon className="size-5 text-accent-text" />
          </span>
          <span>
            <span className="block text-sm font-semibold">{feature.float.title}</span>
            <span className="block text-xs text-muted-foreground">{feature.float.hint}</span>
          </span>
        </div>
      )}
    </div>
  )
}

interface FeatureButtonProps {
  feature: Feature
  index: number
  selected: boolean
  onSelect: () => void
  /** Rotación automática: la barra se llena y al terminar avanza a la opción siguiente */
  progress?: { paused: boolean; onDone: () => void }
  children?: ReactNode
}

function FeatureButton({ feature, index, selected, onSelect, progress, children }: FeatureButtonProps) {
  const Icon = feature.icon
  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        onClick={onSelect}
        className={cn(
          'relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-150 sm:p-6',
          selected ? 'border-border bg-card shadow-sm' : 'border-transparent hover:bg-muted',
        )}
      >
        {progress && <RotationProgress durationMs={ROTATE_MS} paused={progress.paused} onDone={progress.onDone} />}
        {/* Barra dorada de la opción activa */}
        <span className={cn('absolute inset-y-0 left-0 w-1 transition-colors duration-150', selected ? 'bg-accent' : 'bg-transparent')} aria-hidden="true" />
        <span className="flex items-start gap-4">
          <span
            className={cn(
              'inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-150',
              selected ? 'bg-primary text-accent' : 'bg-muted text-muted-foreground',
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-xs font-semibold tracking-wide text-accent-text uppercase">0{index + 1}</span>
            <span className={cn('block font-heading text-lg font-semibold sm:text-xl', !selected && 'text-muted-foreground')}>{feature.title}</span>
            <span className="mt-1.5 block text-muted-foreground">{feature.text}</span>
          </span>
        </span>
      </button>
      {children}
    </li>
  )
}

export function WhySection() {
  const [activeId, setActiveId] = useState<FeatureId>('rapido')
  const active = FEATURES.find((f) => f.id === activeId)!

  const { ref: rotationRef, ...rotation } = useAutoRotate<HTMLElement>()

  const next = () => {
    const i = FEATURES.findIndex((f) => f.id === activeId)
    setActiveId(FEATURES[(i + 1) % FEATURES.length].id)
  }

  // Elegir una opción a mano detiene la rotación: la persona tomó el control
  const choose = (id: FeatureId) => {
    setActiveId(id)
    rotation.stop()
  }

  return (
    <section ref={rotationRef} className="overflow-hidden bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-balance sm:text-5xl">Por qué los hogares eligen Domus.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Cuidar tu casa no tiene que ser complicado. Te acompañamos desde que pedís el servicio hasta que el trabajo está listo.
        </p>

        {/* Con el mouse encima o el foco adentro la rotación se pausa, y sigue donde quedó */}
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16" {...rotation.interactionHandlers}>
          <div>
            <ul className="flex flex-col gap-3">
              {FEATURES.map((feature, index) => (
                <FeatureButton
                  key={feature.id}
                  feature={feature}
                  index={index}
                  selected={feature.id === activeId}
                  onSelect={() => choose(feature.id)}
                  progress={rotation.rotating && feature.id === activeId ? { paused: rotation.paused, onDone: next } : undefined}
                >
                  {/* Móvil: el celular aparece debajo de la opción tocada, donde se está mirando */}
                  {feature.id === activeId && (
                    <div className="pt-6 pb-4 lg:hidden">
                      <Phone feature={feature} />
                    </div>
                  )}
                </FeatureButton>
              ))}
            </ul>
            {rotation.canRotate && <RotationToggle autoplay={rotation.autoplay} onToggle={rotation.toggle} className="mt-3 ml-2" />}
          </div>

          <div className="hidden lg:block">
            <Phone feature={active} withFloat />
          </div>
        </div>
      </div>
    </section>
  )
}
