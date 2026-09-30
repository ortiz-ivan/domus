import { Bell, ClipboardCheck, MessageSquareText, Search, ShieldCheck, Smartphone, Sparkles, Star } from 'lucide-react'
import { CompareScreen, RateScreen, SearchScreen, TrackScreen } from './phone/HowItWorksScreens'
import { ProcessShowcase, type ProcessStep } from './phone/ProcessShowcase'

const STEPS: ProcessStep[] = [
  {
    id: 'servicio',
    icon: Search,
    title: 'Elegí el servicio',
    text: 'Buscá por categoría o describí tu problema con tus palabras.',
    screen: SearchScreen,
    aside: { icon: Sparkles, title: 'Entendemos tu problema', hint: '“Gotea la canilla” es plomería' },
  },
  {
    id: 'solicitud',
    icon: ClipboardCheck,
    title: 'Compará y solicitá',
    text: 'Mirá calificaciones, tiempos de respuesta y precios estimados, y enviá tu solicitud.',
    screen: CompareScreen,
    aside: { icon: Smartphone, title: 'Carlos recibe tu pedido', hint: 'al instante, en su celular' },
  },
  {
    id: 'seguimiento',
    icon: MessageSquareText,
    title: 'Seguí el trabajo',
    text: 'El profesional acepta y ves cada avance hasta que termina.',
    screen: TrackScreen,
    aside: { icon: Bell, title: 'Un aviso en cada cambio', hint: 'sin llamar ni preguntar' },
  },
  {
    id: 'pago',
    icon: Star,
    title: 'Calificá y pagá',
    text: 'Confirmá que quedó bien, dejá tu opinión y pagá en la app.',
    screen: RateScreen,
    aside: { icon: ShieldCheck, title: 'Pagás recién al final', hint: 'cuando confirmás que quedó bien' },
  },
]

/** Cómo funciona para el cliente: María contrata a Carlos, paso a paso en un celular animado */
export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="scroll-mt-20 overflow-hidden bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-balance sm:text-5xl">Así de simple funciona.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Del problema al pago, todo desde el celular. Mirá cómo María contrata a Carlos para arreglar una pérdida de agua.
        </p>
        <ProcessShowcase steps={STEPS} />
      </div>
    </section>
  )
}
