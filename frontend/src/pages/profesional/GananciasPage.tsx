import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { formatGs } from '@/lib/format'
import { useDemoStore } from '@/store/demo'
import { useProRequests } from './useProRequests'

export function GananciasPage() {
  const payments = useDemoStore((s) => s.payments)
  const ownIds = new Set(useProRequests().map((r) => r.id))
  const net = payments.filter((p) => ownIds.has(p.requestId)).reduce((sum, p) => sum + p.amount - p.fee, 0)

  return (
    <ScreenPlaceholder
      title="Ganancias"
      description={`Total neto cobrado: ${formatGs(net)}`}
      planned={[
        'Totales: bruto, comisión de Domus y neto',
        'Gráfico de ganancias por semana o mes',
        'Detalle de cada trabajo pagado',
      ]}
    />
  )
}
