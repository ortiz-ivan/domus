import { ArrowRight, MapPin, Search } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { buttonClasses } from '@/components/ui/button-styles'
import { CITIES } from '@/data/seed'
import { cn } from '@/lib/cn'
import { matchCategory } from '@/lib/search'
import { useDemoStore } from '@/store/demo'
import { loginPath } from '@/app/paths'

interface SearchFormProps {
  variant?: 'hero' | 'compact'
  className?: string
}

/** Buscador del landing: interpreta la descripción y lleva al listado de la categoría (previo ingreso) */
export function SearchForm({ variant = 'hero', className }: SearchFormProps) {
  const navigate = useNavigate()
  const categories = useDemoStore((s) => s.categories)
  const [query, setQuery] = useState('')
  const [city, setCity] = useState<string>(CITIES[0])
  const id = useId()
  const isHero = variant === 'hero'

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const category = matchCategory(query, categories)
    const next = category ? `/cliente/categorias/${category.id}` : '/cliente/categorias'
    navigate(loginPath({ next, rol: 'cliente' }))
  }

  const cityField = (
    <div className={cn('relative', isHero ? 'sm:w-48' : 'w-40 shrink-0')}>
      <label htmlFor={`${id}-city`} className="sr-only">
        Ciudad
      </label>
      <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <select
        id={`${id}-city`}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className={cn(
          'min-h-11 w-full cursor-pointer appearance-none bg-card pr-3 pl-9 text-sm text-foreground',
          isHero ? 'rounded-full border border-border' : 'border-l border-border',
        )}
      >
        {CITIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>
  )

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn(
        'bg-card text-foreground',
        isHero ? 'rounded-2xl p-3 shadow-xl sm:p-4' : 'flex items-center rounded-full border border-border py-1 pr-1 pl-4 shadow-sm',
        className,
      )}
    >
      <label htmlFor={`${id}-q`} className={isHero ? 'block px-2 pb-1 text-sm font-semibold' : 'sr-only'}>
        ¿Qué necesitás arreglar?
      </label>
      <div className={cn('flex items-center gap-3', isHero ? 'px-2 pb-3' : 'min-w-0 flex-1')}>
        <Search className={cn('shrink-0', isHero ? 'size-6' : 'size-4 text-muted-foreground')} aria-hidden="true" />
        <input
          id={`${id}-q`}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isHero ? 'Ej.: "pierde agua el inodoro"' : '¿Qué necesitás arreglar?'}
          className="min-h-11 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          autoComplete="off"
        />
      </div>

      {isHero ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          {cityField}
          <button type="submit" className={buttonClasses('primary', 'lg', 'flex-1 rounded-full')}>
            Buscar profesional
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <div className="hidden md:block">{cityField}</div>
          <button type="submit" className={buttonClasses('primary', 'md', 'shrink-0 rounded-full')}>
            <span className="hidden sm:inline">Buscar</span>
            <ArrowRight className="size-4" aria-hidden="true" />
            <span className="sr-only sm:hidden">Buscar</span>
          </button>
        </>
      )}
    </form>
  )
}
