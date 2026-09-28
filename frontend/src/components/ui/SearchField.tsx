import { Search } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

interface SearchFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/** Buscador de listas, con etiqueta accesible (oculta visualmente) */
export function SearchField({ label, value, onChange, placeholder, className }: SearchFieldProps) {
  const id = useId()
  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-lg border border-border bg-card pr-3 pl-9 text-base placeholder:text-muted-foreground/70"
      />
    </div>
  )
}
