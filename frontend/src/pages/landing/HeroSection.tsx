import { Lock, Star } from 'lucide-react'
import type { Ref } from 'react'
import { SearchForm } from './SearchForm'

// Cifras de marketing ficticias, solo para la demo
const STATS = [
  { value: '4.8', star: true, label: 'de +2.000 reseñas' },
  { value: '+150', label: 'profesionales verificados' },
  { value: '+3.000', label: 'trabajos realizados' },
]

export function HeroSection({ searchRef }: { searchRef: Ref<HTMLDivElement> }) {
  return (
    <section id="inicio" className="relative isolate overflow-hidden scroll-mt-20">
      <img
        src="/images/hero.webp"
        alt=""
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      {/* Degradado marino: garantiza contraste del texto blanco sobre la foto */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/95 via-primary/75 to-primary/30" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <h1 className="max-w-2xl text-4xl leading-tight font-bold text-balance text-white sm:text-6xl">
          Para todo lo que tu hogar necesita.
        </h1>
        <p className="mt-4 max-w-xl text-lg font-medium text-white/90">
          Encontrá profesionales de confianza para reparaciones, mantenimiento y mejoras, cerca tuyo y en un solo lugar.
        </p>

        <div ref={searchRef} className="mt-8 max-w-xl">
          <SearchForm />
        </div>

        <p className="mt-4 flex items-center gap-2 text-sm text-white/90">
          <Lock className="size-4 shrink-0" aria-hidden="true" />
          Tus datos solo se comparten con el profesional que elijas.
        </p>

        <ul className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-white">
          {STATS.map((stat) => (
            <li key={stat.label}>
              <span className="flex items-center gap-1 font-heading text-2xl font-bold sm:text-3xl">
                {stat.value}
                {stat.star && <Star className="size-5 fill-accent text-accent" aria-label="estrellas" role="img" />}
              </span>
              <span className="text-sm text-white/85">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
