import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { StatusTone } from '@/lib/status'

export type BadgeTone = StatusTone | 'neutral' | 'accent'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  accent: 'bg-accent-soft text-accent-text',
  pending: 'bg-status-pending/10 text-status-pending',
  accepted: 'bg-status-accepted/10 text-status-accepted',
  progress: 'bg-status-progress/10 text-status-progress',
  done: 'bg-status-done/10 text-status-done',
  rejected: 'bg-status-rejected/10 text-status-rejected',
}

interface BadgeProps {
  tone?: BadgeTone
  className?: string
  children: ReactNode
}

export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
