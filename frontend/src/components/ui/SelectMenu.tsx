import { Check, ChevronDown, type LucideIcon } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'
import { normalize } from '@/lib/search'

interface SelectMenuProps {
  /**
   * Nombre de la lista. Sin `id` también nombra al botón (el ícono y el valor lo explican a la vista);
   * con `id`, dentro de un Field, al botón lo nombra la etiqueta visible.
   */
  label: string
  /** Props que pasa Field: etiqueta, ayuda y error conectados */
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  required?: boolean
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  icon?: LucideIcon
  className?: string
  /** Clases del botón: bordes y redondeo según dónde se use */
  triggerClassName?: string
}

/** Tiempo para seguir escribiendo y buscar por más de una letra ("la" → Lambaré) */
const TYPEAHEAD_MS = 600

/**
 * Selector con la lista desplegable con estilo propio (la de un <select> nativo la dibuja el sistema).
 * Patrón "select-only combobox" de WAI-ARIA: el foco queda en el botón y la opción activa se anuncia
 * con aria-activedescendant. Teclado: flechas, Inicio/Fin, Enter/Espacio, Esc, Tab y escribir la inicial.
 */
export function SelectMenu({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  className,
  triggerClassName,
  id: fieldId,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  required,
}: SelectMenuProps) {
  const id = useId()
  const listId = `${id}-list`
  const optionId = (index: number) => `${id}-opt-${index}`
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const typeahead = useRef({ text: '', timer: 0 })

  const selectedIndex = Math.max(0, options.indexOf(value))

  const openMenu = (index = selectedIndex) => {
    setActive(index)
    setOpen(true)
  }

  const choose = (index: number) => {
    onChange(options[index])
    setOpen(false)
  }

  // Clic o toque fuera del selector: se cierra sin cambiar el valor
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // La opción activa siempre a la vista (listas largas)
  useEffect(() => {
    if (open) document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, id])

  useEffect(() => () => window.clearTimeout(typeahead.current.timer), [])

  /** Busca la opción que empieza con lo escrito, desde la siguiente a la actual */
  const findByTyping = (char: string, from: number): number => {
    const state = typeahead.current
    window.clearTimeout(state.timer)
    state.text += normalize(char)
    state.timer = window.setTimeout(() => (state.text = ''), TYPEAHEAD_MS)
    const start = state.text.length === 1 ? from + 1 : from
    for (let i = 0; i < options.length; i++) {
      const index = (start + i) % options.length
      if (normalize(options[index]).startsWith(state.text)) return index
    }
    return -1
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1
    const { key } = event

    if (key.length === 1 && key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const match = findByTyping(key, open ? active : selectedIndex)
      if (match < 0) return
      if (open) setActive(match)
      else openMenu(match)
      return
    }

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        event.preventDefault()
        openMenu()
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault()
        openMenu(key === 'Home' ? 0 : last)
      }
      return
    }

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive((i) => Math.min(last, i + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((i) => Math.max(0, i - 1))
        break
      case 'Home':
      case 'End':
        event.preventDefault()
        setActive(key === 'Home' ? 0 : last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(active)
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        // Tab confirma la opción activa y deja seguir al siguiente campo
        choose(active)
        break
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        role="combobox"
        id={fieldId}
        aria-label={fieldId ? undefined : label}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        aria-required={required}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
        className={cn('flex min-h-11 w-full items-center gap-2 bg-card px-3 text-left text-sm text-foreground', triggerClassName)}
      >
        {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <ChevronDown
          className={cn('size-4 shrink-0 text-muted-foreground transition-transform duration-150', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <ul
        id={listId}
        role="listbox"
        aria-label={label}
        tabIndex={-1}
        hidden={!open}
        className="absolute top-full left-0 z-30 mt-2 max-h-72 w-max min-w-full animate-fade-in overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-xl"
      >
        {options.map((option, index) => {
          const selected = option === value
          return (
            <li
              key={option}
              id={optionId(index)}
              role="option"
              aria-selected={selected}
              // mousedown sin foco: el foco queda en el botón y no se dispara su onBlur
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
              onMouseMove={() => index !== active && setActive(index)}
              className={cn(
                'flex min-h-10 cursor-pointer items-center justify-between gap-6 rounded-xl px-3 text-sm',
                index === active && 'bg-muted',
                selected ? 'font-semibold text-primary' : 'text-foreground',
              )}
            >
              {option}
              <Check className={cn('size-4 shrink-0 text-accent-text', !selected && 'invisible')} aria-hidden="true" />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
