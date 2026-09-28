import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { formatGs } from '@/lib/format'
import { useDemoStore } from '@/store/demo'

export function AdminFinanzasPage() {
  const payments = useDemoStore((s) => s.payments)
  const fees = payments.reduce((sum, p) => sum + p.fee, 0)
  return (
    <ScreenPlaceholder
      title="Finanzas"
      description={`Comisiones cobradas: ${formatGs(fees)}`}
      planned={[
        'Totales: volumen transaccionado, comisiones y pagos a profesionales',
        'Gráfico de ingresos por mes',
        'Tabla de pagos con método y fecha',
      ]}
    />
  )
}
