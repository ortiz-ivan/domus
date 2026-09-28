import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from './Card'

interface StatCardProps {
  label: string
  value: ReactNode
  icon: LucideIcon
  hint?: string
}

/** Tarjeta de KPI: etiqueta, valor destacado y una línea de contexto */
export function StatCard({ label, value, icon: Icon, hint }: StatCardProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent-soft">
          <Icon className="size-5 text-accent-text" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 font-heading text-2xl font-bold sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </Card>
  )
}
