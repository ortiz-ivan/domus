import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { ACTIVE_STATUSES } from '@/lib/status'
import { useDemoStore } from '@/store/demo'

export function AdminDashboardPage() {
  const requests = useDemoStore((s) => s.requests)
  const active = requests.filter((r) => ACTIVE_STATUSES.includes(r.status)).length

  return (
    <ScreenPlaceholder
      title="Dashboard"
      description={`${requests.length} solicitudes en total, ${active} activas.`}
      planned={[
        'KPIs: usuarios, profesionales, solicitudes activas, ingresos por comisión',
        'Gráfico de solicitudes por categoría',
        'Gráfico de ingresos por mes',
        'Últimas solicitudes',
      ]}
      links={[
        { to: '/admin/solicitudes', label: 'Gestión de solicitudes' },
        { to: '/admin/finanzas', label: 'Finanzas' },
      ]}
    />
  )
}
