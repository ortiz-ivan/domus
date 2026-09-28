import { ArrowRight, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { withService } from '@/app/serviceParam'
import { CategoryIcon } from '@/components/CategoryIcon'
import { ProCard } from '@/components/ProCard'
import { RotationProgress, RotationToggle } from '@/components/ui/RotationProgress'
import { cn } from '@/lib/cn'
import { useAutoRotate } from '@/lib/useAutoRotate'
import { compareRecommended } from '@/lib/plans'
import { useDemoStore } from '@/store/demo'
import { ratingOf } from '@/store/selectors'

/** Tiempo de cada categoría en la rotación automática: el panel tiene foto, trabajos y profesionales para mirar */
const ROTATE_MS = 7000

export function CategoriesSection() {
  const categories = useDemoStore((s) => s.categories)
  const professionals = useDemoStore((s) => s.professionals)
  const reviews = useDemoStore((s) => s.reviews)
  const [activeId, setActiveId] = useState(categories[0].id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  // Recorre las categorías sola en escritorio (ver useAutoRotate); en móvil las pestañas se deslizan a mano
  const { ref: rotationRef, ...rotation } = useAutoRotate<HTMLElement>()

  const active = categories.find((c) => c.id === activeId) ?? categories[0]
  const listPath = `/servicios/${active.id}`
  const topPros = professionals
    .filter((p) => p.categoryIds.includes(active.id))
    .map((p) => ({ professional: p, rating: ratingOf(reviews, p) }))
    .sort(compareRecommended)
    .slice(0, 3)

  const activeIndex = categories.findIndex((c) => c.id === active.id)
  const nextCategory = categories[(activeIndex + 1) % categories.length]
  const next = () => setActiveId(nextCategory.id)

  // Elegir una categoría a mano detiene la rotación: la persona tomó el control
  const choose = (id: string) => {
    setActiveId(id)
    rotation.stop()
  }

  // Precarga la foto de la categoría siguiente para que el cambio automático no muestre un hueco
  const preload = rotation.rotating ? nextCategory.image : null
  useEffect(() => {
    if (preload) new Image().src = preload
  }, [preload])

  // Patrón de pestañas WAI-ARIA: flechas, Inicio y Fin mueven la selección
  const onTabKeyDown = (event: KeyboardEvent, index: number) => {
    const last = categories.length - 1
    const target =
      event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null
    if (target === null) return
    event.preventDefault()
    choose(categories[target].id)
    tabRefs.current[target]?.focus()
  }

  return (
    <section ref={rotationRef} id="servicios" className="scroll-mt-20 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-balance sm:text-5xl">
          Profesionales para cada trabajo <span className="text-accent-text">en tu zona.</span>
        </h2>

        {/* Con el mouse encima o el foco adentro la rotación se pausa, y sigue donde quedó */}
        <div {...rotation.interactionHandlers}>
          {/* Pestañas: scroll horizontal propio en móvil, sin mover la página */}
          <div
            role="tablist"
            aria-label="Categorías de servicio"
            className="mt-10 flex snap-x gap-2 overflow-x-auto border-b border-border [scrollbar-width:none] mask-r-from-85% sm:justify-between lg:mask-none"
          >
            {categories.map((category, index) => {
              const selected = category.id === active.id
              return (
                <button
                  key={category.id}
                  ref={(el) => {
                    tabRefs.current[index] = el
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${category.id}`}
                  aria-selected={selected}
                  aria-controls="panel-categoria"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(category.id)}
                  onKeyDown={(e) => onTabKeyDown(e, index)}
                  className={cn(
                    'relative -mb-px flex min-w-24 shrink-0 snap-start flex-col items-center gap-2 border-b-2 px-2 pt-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors duration-150',
                    selected ? 'border-accent text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
                    // Mientras rota, la línea de la pestaña activa se va llenando
                    selected && rotation.rotating && 'border-accent/25',
                  )}
                >
                  {selected && rotation.rotating && (
                    <RotationProgress key={category.id} durationMs={ROTATE_MS} paused={rotation.paused} onDone={next} className="-bottom-0.5" />
                  )}
                  <CategoryIcon name={category.icon} className={cn('size-6', selected && 'text-accent-text')} strokeWidth={1.75} />
                  {category.name}
                </button>
              )
            })}
          </div>

          <div
            key={active.id}
            id="panel-categoria"
            role="tabpanel"
            aria-labelledby={`tab-${active.id}`}
            className="mt-8 grid animate-fade-in gap-6 lg:grid-cols-[1.1fr_1fr]"
          >
            <Link
              to={listPath}
              className="group relative isolate flex min-h-72 overflow-hidden rounded-2xl sm:min-h-96"
            >
              <img
                key={active.image}
                src={active.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary/90 via-primary/30 to-transparent" aria-hidden="true" />
              <div className="mt-auto p-6 text-white">
                <CategoryIcon name={active.icon} className="mb-2 size-7 text-accent" />
                <p className="font-heading text-2xl font-bold">{active.name}</p>
                <p className="mt-1 text-white/90">{active.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-semibold">
                  Ver profesionales
                  <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
            </Link>

            <div className="flex flex-col gap-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold">Trabajos más pedidos</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {active.services.map((service) => (
                    <li key={service}>
                      <Link
                        to={withService(listPath, service)}
                        className="flex min-h-12 items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors duration-150 hover:border-accent"
                      >
                        {service}
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {topPros.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Recomendados en {active.name.toLowerCase()}</h3>
                  <ul className="flex flex-col gap-2">
                    {topPros.map(({ professional, rating }) => (
                      <li key={professional.id}>
                        <ProCard
                          professional={professional}
                          rating={rating}
                          variant="compact"
                          to={`/profesionales/${professional.id}`}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {rotation.canRotate && (
            <div className="mt-4 flex justify-end">
              <RotationToggle autoplay={rotation.autoplay} onToggle={rotation.toggle} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
