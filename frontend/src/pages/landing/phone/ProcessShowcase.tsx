import type { LucideIcon } from 'lucide-react'
import { useState, type ComponentType } from 'react'
import { RotationProgress, RotationToggle } from '@/components/ui/RotationProgress'
import { cn } from '@/lib/cn'
import { useAutoRotate } from '@/lib/useAutoRotate'
import { PhoneFrame } from './PhoneFrame'

/** Pantallas animadas: reciben si la sección está a la vista, para arrancar su guion recién ahí */
export interface ScreenProps {
  playing: boolean
}

export interface ProcessStep {
  id: string
  icon: LucideIcon
  title: string
  text: string
  /** Pantalla animada del celular para este paso */
  screen: ComponentType<ScreenProps>
  /** Tarjeta junto al celular: lo que pasa del otro lado (solo escritorio) */
  aside: { icon: LucideIcon; title: string; hint: string }
}

/** Tiempo de cada paso en la rotación automática: alcanza para ver su animación completa y leerla */
const ROTATE_MS = 7500

/**
 * Recorrido de la app: los pasos como línea de tiempo y un celular que anima cada proceso.
 * Lo usan la portada (el cliente) y la landing de profesionales (el profesional).
 */
export function ProcessShowcase({ steps }: { steps: ProcessStep[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = steps[activeIndex]
  const { ref: rotationRef, ...rotation } = useAutoRotate<HTMLDivElement>()

  const next = () => setActiveIndex((i) => (i + 1) % steps.length)

  // Elegir un paso a mano detiene la rotación: la persona tomó el control
  const choose = (index: number) => {
    setActiveIndex(index)
    rotation.stop()
  }

  const Screen = active.screen
  const AsideIcon = active.aside.icon

  return (
    // Con el mouse encima o el foco adentro la rotación se pausa, y sigue donde quedó
    <div ref={rotationRef} className="mt-12" {...rotation.interactionHandlers}>
      <ol className="relative grid grid-cols-4 gap-2 sm:gap-4">
        {/* Línea que une los pasos (detrás de las tarjetas) */}
        <span className="absolute top-1/2 right-[12.5%] left-[12.5%] hidden h-px bg-border lg:block" aria-hidden="true" />
        {steps.map((step, i) => {
          const Icon = step.icon
          const selected = i === activeIndex
          const done = i < activeIndex
          return (
            <li key={step.id} className="relative">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => choose(i)}
                className={cn(
                  'relative flex h-full w-full flex-col overflow-hidden rounded-2xl border p-3 text-left transition-colors duration-150 sm:p-5',
                  selected ? 'border-border bg-card shadow-sm' : 'border-transparent bg-background hover:bg-muted',
                )}
              >
                {rotation.rotating && selected && <RotationProgress key={step.id} durationMs={ROTATE_MS} paused={rotation.paused} onDone={next} />}
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-150 sm:size-12',
                      selected ? 'bg-primary text-accent' : done ? 'bg-accent-soft text-accent-text' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <Icon className="size-5 sm:size-6" aria-hidden="true" />
                  </span>
                  <span className={cn('hidden font-heading text-4xl font-bold sm:block', selected ? 'text-accent' : 'text-border')} aria-hidden="true">
                    {i + 1}
                  </span>
                </span>
                <span className="mt-3 block text-xs font-semibold tracking-wide text-accent-text uppercase sm:hidden">Paso {i + 1}</span>
                <span className={cn('mt-1 hidden font-heading text-lg leading-snug font-semibold sm:mt-4 sm:block', !selected && 'text-muted-foreground')}>
                  {step.title}
                </span>
                <span className="mt-1 hidden text-muted-foreground lg:block">{step.text}</span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* Móvil y tablet: el texto del paso activo va entre los pasos y el celular */}
      <div className="mx-auto mt-6 max-w-md text-center lg:hidden">
        <p className="font-heading text-xl font-semibold sm:hidden">{active.title}</p>
        <p className="mt-1 text-muted-foreground sm:mt-0">{active.text}</p>
      </div>

      {/* Celular decorativo: el texto de cada paso ya describe lo que muestra, por eso aria-hidden */}
      <div className="relative mx-auto mt-10 w-full max-w-[18.5rem]" aria-hidden="true">
        <div className="absolute inset-x-[-15%] top-[10%] -z-10 aspect-square rounded-full bg-accent-soft" />
        <PhoneFrame screenKey={active.id}>
          <Screen playing={rotation.onScreen} />
        </PhoneFrame>

        {/* Lo que pasa del otro lado, a la derecha del celular (solo escritorio, donde hay lugar) */}
        <div
          key={`aside-${active.id}`}
          className="absolute top-1/3 left-full ml-10 hidden w-56 animate-fade-in items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xl [animation-delay:300ms] [animation-fill-mode:backwards] lg:flex"
        >
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft">
            <AsideIcon className="size-5 text-accent-text" />
          </span>
          <span>
            <span className="block text-sm font-semibold">{active.aside.title}</span>
            <span className="block text-xs text-muted-foreground">{active.aside.hint}</span>
          </span>
        </div>
      </div>

      {rotation.canRotate && (
        <div className="mt-6 flex justify-center">
          <RotationToggle autoplay={rotation.autoplay} onToggle={rotation.toggle} />
        </div>
      )}
    </div>
  )
}
