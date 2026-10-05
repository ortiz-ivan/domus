import { cn } from '@/lib/cn'

/** Opciones de motivo (radio) para cuando el profesional no toma un trabajo */
export function ReasonPicker({ reasons, value, onChange }: { reasons: string[]; value: string; onChange: (reason: string) => void }) {
  return (
    <fieldset>
      <legend className="sr-only">Motivo</legend>
      <div className="space-y-2">
        {reasons.map((r) => (
          <label
            key={r}
            className={cn(
              'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm',
              value === r ? 'border-primary bg-accent-soft' : 'border-border hover:bg-muted',
            )}
          >
            <input type="radio" name="reason" checked={value === r} onChange={() => onChange(r)} className="size-4 accent-primary" />
            {r}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
