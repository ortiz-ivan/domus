import { cn } from '@/lib/cn'

export interface FilterOption<T extends string> {
  value: T
  label: string
  count?: number
}

interface FilterTabsProps<T extends string> {
  label: string
  options: FilterOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** Filtro segmentado para listas (Activas / Finalizadas…). Se envuelve en varias líneas si no entra. */
export function FilterTabs<T extends string>({ label, options, value, onChange, className }: FilterTabsProps<T>) {
  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-150',
              selected ? 'border-primary bg-primary text-on-primary' : 'border-border bg-card text-foreground hover:bg-muted',
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 text-xs tabular-nums',
                  selected ? 'bg-white/20' : 'bg-muted text-muted-foreground',
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
