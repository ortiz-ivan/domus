import { Star } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

const LABELS = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente']

interface RatingInputProps {
  value: number
  onChange: (value: number) => void
  error?: string
}

/** Selector de 1 a 5 estrellas sobre radios nativos: funciona con flechas del teclado y lectores de pantalla */
export function RatingInput({ value, onChange, error }: RatingInputProps) {
  const name = useId()
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="sr-only">Calificación de 1 a 5 estrellas</legend>
      <div className="flex justify-center gap-1 sm:gap-2">
        {LABELS.map((label, i) => {
          const starValue = i + 1
          const active = starValue <= value
          return (
            <label key={label} className="group cursor-pointer rounded-lg p-1 has-focus-visible:outline-2 has-focus-visible:outline-ring">
              <input
                type="radio"
                name={name}
                value={starValue}
                checked={value === starValue}
                onChange={() => onChange(starValue)}
                className="sr-only"
              />
              <span className="sr-only">{`${starValue} ${starValue === 1 ? 'estrella' : 'estrellas'}: ${label}`}</span>
              <Star
                className={cn(
                  'size-10 transition-colors duration-150 sm:size-12',
                  active ? 'fill-accent text-accent' : 'text-border group-hover:text-accent',
                )}
                aria-hidden="true"
              />
            </label>
          )
        })}
      </div>
      <p className="mt-2 h-6 text-center font-semibold" aria-hidden="true">
        {value > 0 ? LABELS[value - 1] : ''}
      </p>
      {error && (
        <p id={`${name}-error`} className="text-center text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
