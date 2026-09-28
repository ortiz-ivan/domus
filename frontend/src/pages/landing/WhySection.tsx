import { BadgeCheck, Check, Star, X } from 'lucide-react'
import { useState, type ComponentType } from 'react'
import { cn } from '@/lib/cn'
import { formatGs } from '@/lib/format'

const FEATURES = [
  {
    id: 'rapido',
    title: 'Contratá más rápido.',
    text: 'Contanos qué necesitás con tus palabras, respondé un par de preguntas y te mostramos a los indicados.',
  },
  {
    id: 'confianza',
    title: 'Solo profesionales de confianza.',
    text: 'Verificamos a cada profesional y ves las calificaciones reales de otros clientes antes de elegir.',
  },
  {
    id: 'seguimiento',
    title: 'Seguí tu trabajo de principio a fin.',
    text: 'Sabés en todo momento en qué estado está tu servicio, y pagás recién cuando confirmás que quedó bien.',
  },
] as const

type FeatureId = (typeof FEATURES)[number]['id']

function TimelineScreen() {
  const options = [
    { title: 'Lo necesito ya', hint: 'Dentro de 48 horas' },
    { title: 'Esta semana', hint: 'No es urgente' },
    { title: 'Estoy averiguando', hint: 'Fecha flexible' },
  ]
  return (
    <>
      <p className="font-heading text-lg font-bold">¿Para cuándo lo necesitás?</p>
      <ul className="mt-4 space-y-3">
        {options.map((option, i) => (
          <li key={option.title} className={cn('flex gap-3 rounded-lg border p-3', i === 0 ? 'border-primary bg-accent-soft' : 'border-border')}>
            <span className={cn('mt-0.5 size-4 shrink-0 rounded-full border-2', i === 0 ? 'border-[5px] border-primary' : 'border-muted-foreground')} />
            <span>
              <span className="block text-sm font-semibold">{option.title}</span>
              <span className="block text-xs text-muted-foreground">{option.hint}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm font-semibold text-accent-text">Elegir una fecha</p>
    </>
  )
}

function ProScreen() {
  return (
    <>
      <p className="font-heading text-lg font-bold">Plomeros en Asunción</p>
      {[
        { name: 'Carlos Benítez', rating: '4.9', jobs: 184, price: 150000 },
        { name: 'Ramón Giménez', rating: '4.7', jobs: 96, price: 120000 },
      ].map((pro) => (
        <div key={pro.name} className="mt-3 rounded-lg border border-border p-3">
          <p className="flex items-center gap-1 text-sm font-semibold">
            {pro.name}
            <BadgeCheck className="size-4 text-status-accepted" />
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs">
            <Star className="size-3.5 fill-accent text-accent" />
            <span className="font-semibold">{pro.rating}</span>
            <span className="text-muted-foreground">· {pro.jobs} trabajos</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Desde <span className="font-semibold text-foreground">{formatGs(pro.price)}</span>
          </p>
        </div>
      ))}
    </>
  )
}

function TrackingScreen() {
  const steps = ['Solicitud enviada', 'Aceptada por el profesional', 'Trabajo en proceso', 'Trabajo terminado', 'Calificar y pagar']
  const current = 2
  return (
    <>
      <p className="font-heading text-lg font-bold">Instalar ventilador</p>
      <p className="text-xs text-muted-foreground">DOM-0998 · Fernando Duarte</p>
      <ol className="mt-4">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 pb-4 last:pb-0">
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full text-white',
                i < current ? 'bg-status-done' : i === current ? 'bg-status-progress' : 'bg-muted',
              )}
            >
              {i < current && <Check className="size-3" strokeWidth={3} />}
            </span>
            <span className={cn('text-sm', i > current ? 'text-muted-foreground' : 'font-medium')}>{step}</span>
          </li>
        ))}
      </ol>
    </>
  )
}

const SCREENS: Record<FeatureId, ComponentType> = {
  rapido: TimelineScreen,
  confianza: ProScreen,
  seguimiento: TrackingScreen,
}

export function WhySection() {
  const [activeId, setActiveId] = useState<FeatureId>('rapido')
  const Screen = SCREENS[activeId]

  return (
    <section className="relative isolate overflow-hidden bg-card py-16 sm:py-24">
      {/* Curva decorativa, como el fondo de la referencia */}
      <div className="absolute -right-40 top-24 -z-10 size-[36rem] rounded-full bg-accent-soft" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-balance sm:text-5xl">Por qué los hogares eligen Domus.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Cuidar tu casa no tiene que ser complicado. Te acompañamos desde que pedís el servicio hasta que el trabajo está listo.
        </p>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <ul className="flex flex-col gap-3">
            {FEATURES.map((feature) => {
              const selected = feature.id === activeId
              return (
                <li key={feature.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveId(feature.id)}
                    className={cn(
                      'w-full rounded-2xl border p-6 text-left transition-colors duration-150',
                      selected ? 'border-primary bg-card' : 'border-transparent hover:bg-muted',
                    )}
                  >
                    <span className={cn('block font-heading text-xl font-semibold sm:text-2xl', !selected && 'text-muted-foreground')}>
                      {feature.title}
                    </span>
                    <span className="mt-2 block text-muted-foreground">{feature.text}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Mockup de celular: decorativo, el texto de la izquierda ya describe cada punto */}
          <div className="mx-auto w-full max-w-72" aria-hidden="true">
            <div className="rounded-[2.5rem] border-8 border-primary bg-primary shadow-2xl">
              <div className="flex h-7 items-center justify-between rounded-t-[2rem] bg-primary px-6 text-[10px] font-semibold text-white">
                <span>9:41</span>
                <span className="h-4 w-16 rounded-full bg-black/40" />
                <span>100%</span>
              </div>
              <div className="min-h-[26rem] rounded-b-[2rem] bg-card p-5">
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
                <div className="mb-4 flex justify-end">
                  <X className="size-4 text-muted-foreground" />
                </div>
                <div key={activeId} className="animate-fade-in">
                  <Screen />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
