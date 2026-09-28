import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router'
import { LinkButton } from '@/components/ui/Button'

const BENEFITS = [
  'Recibí solicitudes de clientes de tu zona',
  'Aceptá solo los trabajos que te convienen',
  'Cobrá de forma segura y seguí tus ganancias',
  'Destacá tu perfil con una membresía',
]

export function ProCtaSection() {
  return (
    <section id="profesionales" className="scroll-mt-20 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl bg-primary lg:grid-cols-2">
          <img
            src="/images/profesional.webp"
            alt="Electricista con casco apoyado junto a un tablero"
            width={1200}
            height={801}
            loading="lazy"
            className="h-64 w-full object-cover sm:h-80 lg:h-full"
          />
          <div className="p-8 text-white sm:p-12">
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">Para profesionales</p>
            <h2 className="mt-2 text-3xl font-bold text-balance sm:text-4xl">Conseguí más clientes con Domus.</h2>
            <ul className="mt-6 space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                  <span className="text-white/90">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton to="/para-profesionales" variant="accent" size="lg" className="rounded-full">
                Sumate como profesional
              </LinkButton>
              <Link
                to="/para-profesionales#planes"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 font-semibold text-white transition-colors duration-150 hover:bg-white/10"
              >
                Ver planes
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
