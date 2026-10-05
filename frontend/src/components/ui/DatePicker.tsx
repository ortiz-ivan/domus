import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

interface DatePickerProps {
  /** Nombre del calendario (el panel); con `id`, dentro de un Field, al botón lo nombra la etiqueta visible */
  label: string
  /** Props que pasa Field: etiqueta, ayuda y error conectados */
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  required?: boolean
  /** Fecha elegida (YYYY-MM-DD) o '' */
  value: string
  onChange: (value: string) => void
  /** Primera fecha que se puede elegir (YYYY-MM-DD) */
  min?: string
  placeholder?: string
  triggerClassName?: string
  /** Para que el formulario lleve el foco acá si falta la fecha */
  'data-field'?: string
}

const WEEKDAYS = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do']
const monthTitle = new Intl.DateTimeFormat('es-PY', { month: 'long', year: 'numeric' })
const longDate = new Intl.DateTimeFormat('es-PY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const shortDate = new Intl.DateTimeFormat('es-PY', { weekday: 'long', day: 'numeric', month: 'long' })

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const pad = (n: number) => String(n).padStart(2, '0')
/** Fechas locales a mediodía: sin corrimientos por zona horaria ni cambios de horario */
const fromIso = (iso: string) => new Date(`${iso}T12:00:00`)
const toIso = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const addDays = (iso: string, days: number) => {
  const date = fromIso(iso)
  date.setDate(date.getDate() + days)
  return toIso(date)
}
const addMonths = (iso: string, months: number) => {
  const date = fromIso(iso)
  const day = date.getDate()
  date.setDate(1)
  date.setMonth(date.getMonth() + months)
  // 31 de enero + 1 mes → 28/29 de febrero, no 3 de marzo
  date.setDate(Math.min(day, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()))
  return toIso(date)
}

/** Semanas (de lunes a domingo) del mes de `iso`; los días de otros meses quedan en null */
function monthWeeks(iso: string): (string | null)[][] {
  const first = fromIso(`${iso.slice(0, 7)}-01`)
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const offset = (first.getDay() + 6) % 7
  const cells: (string | null)[] = Array.from({ length: offset }, () => null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${iso.slice(0, 7)}-${pad(d)}`)
  while (cells.length % 7) cells.push(null)
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7))
}

/**
 * Calendario con estilo propio (el de <input type="date"> lo dibuja el sistema), a juego con SelectMenu.
 * Patrón "date picker dialog" de WAI-ARIA. Teclado en los días: flechas, Inicio/Fin (semana),
 * RePág/AvPág (mes), Enter/Espacio para elegir y Esc para cerrar.
 */
export function DatePicker({
  label,
  value,
  onChange,
  min,
  placeholder = 'Elegí una fecha',
  triggerClassName,
  id: fieldId,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  required,
  'data-field': dataField,
}: DatePickerProps) {
  const id = useId()
  const dialogId = `${id}-calendar`
  const titleId = `${id}-title`
  const today = toIso(new Date())
  const [open, setOpen] = useState(false)
  // Día con el foco del teclado; el mes que se ve es el suyo
  const [focused, setFocused] = useState(value || (min && min > today ? min : today))
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const gridRef = useRef<HTMLTableElement>(null)

  const isDisabled = (iso: string) => Boolean(min && iso < min)
  const clamp = (iso: string) => (min && iso < min ? min : iso)

  const openCalendar = () => {
    setFocused(clamp(value || today))
    setOpen(true)
  }

  const close = (focusTrigger = true) => {
    setOpen(false)
    if (focusTrigger) triggerRef.current?.focus()
  }

  const choose = (iso: string) => {
    if (isDisabled(iso)) return
    onChange(iso)
    close()
  }

  // Clic o toque fuera: se cierra sin cambiar el valor
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // El foco sigue al día activo (al abrir y al moverse con el teclado)
  useEffect(() => {
    if (open) gridRef.current?.querySelector<HTMLButtonElement>(`[data-iso="${focused}"]`)?.focus()
  }, [open, focused])

  const onGridKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const moves: Record<string, () => string> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -((fromIso(focused).getDay() + 6) % 7)),
      End: () => addDays(focused, 6 - ((fromIso(focused).getDay() + 6) % 7)),
      PageUp: () => addMonths(focused, -1),
      PageDown: () => addMonths(focused, 1),
    }
    const move = moves[event.key]
    if (move) {
      event.preventDefault()
      setFocused(clamp(move()))
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  const monthStart = `${focused.slice(0, 7)}-01`
  const canGoBack = !min || addDays(monthStart, -1) >= min
  const weeks = monthWeeks(focused)

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={fieldId}
        aria-label={fieldId ? undefined : label}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        aria-required={required}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        data-field={dataField}
        onClick={() => (open ? close(false) : openCalendar())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault()
            openCalendar()
          }
        }}
        className={cn('flex min-h-11 w-full items-center gap-2 bg-card px-3 text-left text-sm text-foreground', triggerClassName)}
      >
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className={cn('min-w-0 flex-1 truncate', !value && 'text-muted-foreground/70')}>
          {value ? capitalize(shortDate.format(fromIso(value))) : placeholder}
        </span>
        <ChevronDown className={cn('size-4 shrink-0 text-muted-foreground transition-transform duration-150', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="absolute top-full left-0 z-30 mt-2 w-[19.5rem] max-w-[calc(100vw-2rem)] animate-fade-in rounded-2xl border border-border bg-card p-3 shadow-xl"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setFocused(clamp(addMonths(focused, -1)))}
              disabled={!canGoBack}
              className="inline-flex size-9 items-center justify-center rounded-xl text-foreground hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <p id={titleId} className="font-heading text-sm font-semibold" aria-live="polite">
              <span className="sr-only">{label}: </span>
              {capitalize(monthTitle.format(fromIso(focused)))}
            </p>
            <button
              type="button"
              onClick={() => setFocused(addMonths(focused, 1))}
              className="inline-flex size-9 items-center justify-center rounded-xl text-foreground hover:bg-muted"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <table ref={gridRef} role="grid" aria-labelledby={titleId} onKeyDown={onGridKeyDown} className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {WEEKDAYS.map((day) => (
                  <th key={day} scope="col" className="pb-1 text-xs font-medium text-muted-foreground">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, w) => (
                <tr key={w}>
                  {week.map((iso, d) => {
                    if (!iso) return <td key={d} />
                    const selected = iso === value
                    const disabled = isDisabled(iso)
                    return (
                      <td key={iso} role="gridcell" aria-selected={selected} className="p-0.5 text-center">
                        <button
                          type="button"
                          data-iso={iso}
                          tabIndex={iso === focused ? 0 : -1}
                          disabled={disabled}
                          aria-label={capitalize(longDate.format(fromIso(iso)))}
                          aria-current={iso === today ? 'date' : undefined}
                          onClick={() => choose(iso)}
                          className={cn(
                            'inline-flex size-9 items-center justify-center rounded-xl tabular-nums transition-colors duration-150',
                            selected ? 'bg-primary font-semibold text-on-primary' : 'text-foreground hover:bg-muted',
                            iso === today && !selected && 'font-semibold text-accent-text ring-1 ring-accent ring-inset',
                            disabled && 'pointer-events-none text-muted-foreground/40',
                          )}
                        >
                          {Number(iso.slice(8))}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
