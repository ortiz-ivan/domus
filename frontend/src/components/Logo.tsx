import { cn } from '@/lib/cn'

/** Isotipo recortado del logo + wordmark en texto, para las barras de navegación */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <img src="/domus_isotipo.png" alt="" width={36} height={36} className="size-9 rounded-md" />
      {!compact && (
        <span className="font-heading text-lg font-bold tracking-[0.2em] text-primary" aria-hidden="true">
          DOMUS
        </span>
      )}
      <span className="sr-only">Domus</span>
    </span>
  )
}
