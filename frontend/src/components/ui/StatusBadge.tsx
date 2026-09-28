import { CheckCircle2, Clock, Hammer, ThumbsUp, XCircle, type LucideIcon } from 'lucide-react'
import { STATUS_META, type StatusTone } from '@/lib/status'
import type { RequestStatus } from '@/types'
import { Badge } from './Badge'

// El ícono acompaña al color para no depender solo de él
const TONE_ICONS: Record<StatusTone, LucideIcon> = {
  pending: Clock,
  accepted: ThumbsUp,
  progress: Hammer,
  done: CheckCircle2,
  rejected: XCircle,
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  const { label, tone } = STATUS_META[status]
  const Icon = TONE_ICONS[tone]
  return (
    <Badge tone={tone}>
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </Badge>
  )
}
