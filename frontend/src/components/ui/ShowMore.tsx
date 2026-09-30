import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ShowMoreProps {
  shown: number
  total: number
  remaining: number
  pageSize: number
  onShowMore: () => void
  /** Qué se lista, en plural: "usuarios", "pagos"… */
  noun: string
}

/** Pie de las listas por tandas (ver usePaged): cuánto se ve y el botón para cargar la siguiente */
export function ShowMore({ shown, total, remaining, pageSize, onShowMore, noun }: ShowMoreProps) {
  if (total <= pageSize) return null
  return (
    <div className="flex flex-col items-center gap-2 border-t border-border p-4 text-center">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Mostrando {shown} de {total} {noun}
      </p>
      {remaining > 0 && (
        <Button variant="outline" onClick={onShowMore}>
          <ChevronDown className="size-4" aria-hidden="true" />
          Ver {Math.min(pageSize, remaining)} más
        </Button>
      )}
    </div>
  )
}
