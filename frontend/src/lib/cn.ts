import { twMerge } from 'tailwind-merge'

/**
 * Une clases condicionales: cn('a', cond && 'b').
 * twMerge resuelve conflictos (p. ej. bg-card vs bg-accent-soft) dejando la última,
 * así las clases que recibe un componente siempre pisan sus estilos base.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return twMerge(classes.filter(Boolean).join(' '))
}
