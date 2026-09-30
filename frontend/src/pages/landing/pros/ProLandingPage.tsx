import { ArrowRight, Bell, Eye, Hammer, Inbox, LayoutGrid, ShieldCheck, Star, UserRound, Wallet } from 'lucide-react'
import { loginPath } from '@/app/paths'
import { PlanCards } from '@/components/PlanCards'
import { ProCard } from '@/components/ProCard'
import { LinkButton } from '@/components/ui/Button'
import { roundedDown, usePlatformStats } from '@/lib/platformStats'
import { ratingOf } from '@/store/selectors'
import { useDemoStore } from '@/store/demo'
import { LandingFooter } from '../LandingFooter'
import { LandingHeader } from '../LandingHeader'
import { ProcessShowcase, type ProcessStep } from '../phone/ProcessShowcase'
import { EarningsScreen, InboxScreen, JobScreen, ProfileScreen } from '../phone/ProScreens'
import { EarningsCalculator } from './EarningsCalculator'

// La demo no tiene alta de perfiles: los botones entran como el profesional de prueba (Carlos)
const JOIN_PATH = loginPath({ rol: 'profesional' })

// El mismo trabajo que la portada le muestra al cliente, del lado del profesional (Carlos)
const STEPS: ProcessStep[] = [
  {
    id: 'perfil',
    icon: LayoutGrid,
    title: 'Mostrá tus servicios',
    text: 'Tus rubros, tu zona y tu precio de referencia, en un perfil que ven los clientes.',
    screen: ProfileScreen,
    aside: { icon: Eye, title: 'Los clientes ya te ven', hint: 'en tu rubro, con tu precio' },
  },
  {
    id: 'solicitudes',
    icon: Inbox,
    title: 'Recibí solicitudes',
    text: 'Te llegan pedidos de clientes cerca tuyo, con el detalle del trabajo.',
    screen: InboxScreen,
    aside: { icon: UserRound, title: 'María pidió un plomero', hint: 'en Asunción, hace 1 minuto' },
  },
  {
    id: 'trabajo',
    icon: Hammer,
    title: 'Hacé el trabajo',
    text: 'Aceptá solo lo que te conviene y avisá cada avance desde la app.',
    screen: JobScreen,
    aside: { icon: Bell, title: 'María ve cada avance', hint: 'sin que tengas que llamarla' },
  },
  {
    id: 'cobro',
    icon: Wallet,
    title: 'Cobrá y crecé',
    text: 'El cliente paga en la app y cada reseña te trae más trabajos.',
    screen: EarningsScreen,
    aside: { icon: ShieldCheck, title: 'Cobro seguro', hint: 'el cliente paga en la app al confirmar' },
  },
]

const FAQ = [
  { q: '¿Cuánto cuesta?', a: 'Recibir solicitudes es gratis. Domus cobra una comisión solo sobre los trabajos que cobrás.' },
  { q: '¿Cuándo cobro mis trabajos?', a: 'Cuando el cliente confirma que el trabajo quedó bien y paga en la app. Ves cada cobro, ya descontada la comisión, en Ganancias.' },
  { q: '¿Qué me da una membresía?', a: 'Más visibilidad: una insignia en tu perfil y un lugar más alto en tu categoría. Premium, además, te muestra en los destacados de la portada.' },
  { q: '¿Puedo cambiar o cancelar mi plan?', a: 'Sí, cuando quieras, desde Perfil → Membresía. En esta demo los planes son simulados: no se cobra nada.' },
  { q: '¿Cómo me verifican?', a: 'El equipo de Domus revisa tu identidad. Los perfiles verificados muestran una insignia y generan más confianza.' },
]

/** Así ve el cliente el mismo perfil con plan Básico y con Premium */
function PlanPreview() {
  const carlos = useDemoStore((s) => s.professionals.find((p) => p.id === 'p-1'))
  const reviews = useDemoStore((s) => s.reviews)
  if (!carlos) return null
  const rating = ratingOf(reviews, carlos)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {(['basico', 'premium'] as const).map((plan) => (
        <figure key={plan}>
          <figcaption className="mb-3 text-sm font-semibold text-muted-foreground">
            {plan === 'basico' ? 'Con plan Básico' : 'Con plan Premium: insignia y primero en su categoría'}
          </figcaption>
          <ProCard professional={{ ...carlos, plan }} rating={rating} categoryName="Plomería" to={`/profesionales/${carlos.id}`} />
        </figure>
      ))}
    </div>
  )
}

/** Landing pública para profesionales: cómo funciona, cuánto se gana y los planes de membresía */
export function ProLandingPage() {
  const stats = usePlatformStats()

  return (
    <>
      <LandingHeader onLanding={false} />
      <main>
        {/* Hero */}
        <section className="bg-primary text-on-primary">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <p className="text-sm font-semibold tracking-wide text-accent uppercase">Domus para profesionales</p>
              <h1 className="mt-3 text-4xl leading-tight font-bold text-balance sm:text-5xl">Más clientes, menos vueltas.</h1>
              <p className="mt-4 max-w-xl text-lg text-white/85">
                Recibí pedidos de hogares de tu zona, gestioná tus trabajos desde el celular y cobrá de forma segura.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton to={JOIN_PATH} variant="accent" size="lg" className="rounded-full">
                  Probar la app del profesional
                </LinkButton>
                <a
                  href="#planes"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 font-semibold transition-colors duration-150 hover:bg-white/10"
                >
                  Ver planes
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
              {/* Calculadas desde los datos de la demo, igual que en la portada */}
              <ul className="mt-10 grid max-w-md grid-cols-3 gap-4">
                <li>
                  <span className="block font-heading text-2xl font-bold sm:text-3xl">{stats.professionals}</span>
                  <span className="text-sm text-white/80">profesionales</span>
                </li>
                <li>
                  <span className="flex items-center gap-1 font-heading text-2xl font-bold sm:text-3xl">
                    {stats.averageRating.toFixed(1)} <Star className="size-5 fill-accent text-accent" aria-label="estrellas" role="img" />
                  </span>
                  <span className="text-sm text-white/80">calificación media</span>
                </li>
                <li>
                  <span className="block font-heading text-2xl font-bold sm:text-3xl">{roundedDown(stats.jobs)}</span>
                  <span className="text-sm text-white/80">trabajos</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="/images/profesional.webp"
                alt="Electricista con casco apoyado junto a un tablero"
                width={1200}
                height={801}
                className="aspect-[4/3] w-full rounded-3xl object-cover"
              />
              <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-card p-4 text-foreground shadow-xl sm:left-8">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-accent-soft">
                  <Inbox className="size-5 text-accent-text" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">Nueva solicitud</span>
                  <span className="block text-xs text-muted-foreground">Pérdida de agua · Asunción</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo funciona: el recorrido del profesional en un celular animado */}
        <section className="overflow-hidden bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-balance sm:text-4xl">Así trabajás con Domus.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Del perfil al cobro, todo desde el celular. Mirá cómo Carlos recibe el pedido de María, hace el trabajo y cobra.
            </p>
            <ProcessShowcase steps={STEPS} />
          </div>
        </section>

        {/* Calculadora */}
        <section className="bg-card py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-balance sm:text-4xl">¿Cuánto podés ganar?</h2>
            <p className="mt-2 mb-8 text-muted-foreground">Mové los valores según tu trabajo.</p>
            <EarningsCalculator />
          </div>
        </section>

        {/* Planes */}
        <section id="planes" className="scroll-mt-20 bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold text-balance sm:text-4xl">Destacá tu perfil con una membresía.</h2>
            <p className="mx-auto mt-3 mb-12 max-w-2xl text-center text-muted-foreground">
              Empezá gratis y, cuando quieras más visibilidad, pasá a Destacado o Premium. Precios de ejemplo para la demo.
            </p>
            <PlanCards
              action={(plan) =>
                plan.id === 'basico' ? (
                  <LinkButton to={JOIN_PATH} variant="outline" className="w-full">
                    Probar con plan Básico
                  </LinkButton>
                ) : (
                  <LinkButton
                    to={loginPath({ rol: 'profesional', next: `/profesional/membresia?plan=${plan.id}` })}
                    variant={plan.id === 'destacado' ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Elegir {plan.name}
                  </LinkButton>
                )
              }
            />
          </div>
        </section>

        {/* Así te ven */}
        <section className="bg-card py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-balance sm:text-4xl">Así te ven los clientes.</h2>
            <p className="mt-2 mb-8 text-muted-foreground">El mismo perfil, con y sin membresía.</p>
            <PlanPreview />
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section className="bg-background py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Preguntas frecuentes</h2>
            <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group px-6">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                    {q}
                    <span className="text-xl leading-none text-muted-foreground transition-transform duration-150 group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="pb-5 text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Llamado final */}
        <section className="bg-background pb-16 sm:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start gap-6 rounded-3xl bg-primary p-8 text-on-primary sm:p-12 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-balance sm:text-3xl">Tu próximo cliente ya está buscando.</h2>
                <p className="mt-2 text-white/85">Entrá a la app del profesional y mirá cómo se reciben y gestionan los trabajos.</p>
              </div>
              <LinkButton to={JOIN_PATH} variant="accent" size="lg" className="shrink-0 rounded-full">
                Probar la app del profesional
              </LinkButton>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  )
}
