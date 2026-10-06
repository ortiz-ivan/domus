import { ArrowRight, MapPin, Search } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { buttonClasses } from '@/components/ui/button-styles'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { CITIES } from '@/data/seed'
import { cn } from '@/lib/cn'
import { matchCategory } from '@/lib/search'
import { useDemoStore } from '@/store/demo'

interface SearchFormProps {
  variant?: 'hero' | 'compact'
  /** login: landing pública (pasa por /ingresar). app: cliente ya logueado. */
  destination?: 'login' | 'app'
  className?: string
}

/** Buscador del landing: interpreta la descripción y lleva al listado de la categoría (previo ingreso) */
export function SearchForm({ variant = 'hero', destination = 'login', className }: SearchFormProps) {
  const navigate = useNavigate()
  const categories = useDemoStore((s) => s.categories)
  const [query, setQuery] = useState('')
  const [city, setCity] = useState<string>(CITIES[0])
  const id = useId()
  const isHero = variant === 'hero'

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const category = matchCategory(query, categories)
    if (destination === 'app') {
      // Sin coincidencia, a las categorías con lo escrito en el filtro: se ve que no hubo resultado y se puede corregir
      const q = query.trim()
      navigate(category ? `/cliente/categorias/${category.id}` : q ? `/cliente/categorias?q=${encodeURIComponent(q)}` : '/cliente/categorias')
      return
    }
    // Portada: la lista pública de la categoría, sin pedir ingreso (funciona también en el deploy "solo landing")
    navigate(category ? `/servicios/${category.id}` : '/#servicios')
  }

  const cityField = (
    <SelectMenu
      label="Ciudad"
      value={city}
      options={CITIES}
      onChange={setCity}
      icon={MapPin}
      className={isHero ? 'sm:w-48' : 'w-40 shrink-0'}
      triggerClassName={isHero ? 'rounded-full border border-border pl-3.5' : 'border-l border-border'}
    />
  )

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn(
        'bg-card text-foreground',
        isHero ? 'rounded-2xl p-3 shadow-xl sm:p-4' : 'flex items-center rounded-full border border-border py-1 pr-1 pl-3 shadow-sm sm:pl-4',
        className,
      )}
    >
      <label htmlFor={`${id}-q`} className={isHero ? 'block px-2 pb-1 text-sm font-semibold' : 'sr-only'}>
        ¿Qué necesitás arreglar?
      </label>
      <div className={cn('flex items-center', isHero ? 'gap-3 px-2 pb-3' : 'min-w-0 flex-1 gap-2 sm:gap-3')}>
        <Search className={cn('shrink-0', isHero ? 'size-6' : 'size-4 text-muted-foreground')} aria-hidden="true" />
        <input
          id={`${id}-q`}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // El compacto entra en el header del celular junto al logo y el menú: el texto corto no se corta
          placeholder={isHero ? 'Ej.: "pierde agua el inodoro"' : '¿Qué necesitás?'}
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
          <button type="submit" className={buttonClasses('primary', 'md', 'shrink-0 rounded-full max-sm:size-11 max-sm:px-0')}>
            <span className="hidden sm:inline">Buscar</span>
            <ArrowRight className="size-4" aria-hidden="true" />
            <span className="sr-only sm:hidden">Buscar</span>
          </button>
        </>
      )}
    </form>
  )
}
