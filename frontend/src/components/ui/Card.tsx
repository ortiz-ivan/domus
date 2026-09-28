import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** false: sin padding, para tablas y listas que llegan al borde */
  padded?: boolean
}

export function Card({ className, padded = true, ...props }: CardProps) {
  return <div className={cn('rounded-xl border border-border bg-card', padded && 'p-4 sm:p-6', className)} {...props} />
}
