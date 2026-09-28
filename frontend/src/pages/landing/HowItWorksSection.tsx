import { ClipboardCheck, MessageSquareText, Search, Star, type LucideIcon } from 'lucide-react'

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Search, title: 'Elegí el servicio', text: 'Buscá por categoría o describí tu problema con tus palabras.' },
  { icon: ClipboardCheck, title: 'Compará y solicitá', text: 'Mirá calificaciones, experiencia y precios, y enviá tu solicitud.' },
  { icon: MessageSquareText, title: 'Seguí el trabajo', text: 'El profesional acepta y ves cada avance hasta que termina.' },
  { icon: Star, title: 'Calificá y pagá', text: 'Confirmá que quedó bien, dejá tu opinión y pagá en la app.' },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-balance sm:text-5xl">Así de simple funciona.</h2>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary">
                  <Icon className="size-6 text-accent" aria-hidden="true" />
                </span>
                <span className="font-heading text-4xl font-bold text-border" aria-hidden="true">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
