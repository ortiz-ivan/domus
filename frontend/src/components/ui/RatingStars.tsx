import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

interface RatingStarsProps {
  value: number
  count?: number
  className?: string
}

/** Calificación de solo lectura: estrella + promedio + cantidad de reseñas */
export function RatingStars({ value, count, className }: RatingStarsProps) {
  const isNew = count === 0
  const label = isNew ? 'Sin calificaciones' : `Calificación ${value.toFixed(1)} de 5`
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm', className)} role="img" aria-label={label}>
      <Star className="size-4 fill-accent text-accent" aria-hidden="true" />
      <span className="font-semibold text-foreground">{isNew ? 'Nuevo' : value.toFixed(1)}</span>
      {count !== undefined && count > 0 && <span className="text-muted-foreground">({count})</span>}
    </span>
  )
}
