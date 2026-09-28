import { ArrowRight, ClipboardList, HardHat, Landmark, Users } from 'lucide-react'
import { Link } from 'react-router'
import { BarList } from '@/components/charts/BarList'
import { ColumnChart } from '@/components/charts/ColumnChart'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate, formatGs, formatGsShort } from '@/lib/format'
import { lastMonths, sumByPeriod } from '@/lib/periods'
import { ACTIVE_STATUSES } from '@/lib/status'
import { useDemoStore } from '@/store/demo'
import { useDirectory } from '@/store/selectors'

export function AdminDashboardPage() {
  const users = useDemoStore((s) => s.users)
  const professionals = useDemoStore((s) => s.professionals)
  const requests = useDemoStore((s) => s.requests)
  const payments = useDemoStore((s) => s.payments)
  const categories = useDemoStore((s) => s.categories)
  const dir = useDirectory()

  const clients = users.filter((u) => u.role === 'cliente')
  const active = requests.filter((r) => ACTIVE_STATUSES.includes(r.status))
  const months = lastMonths(6)
  const monthlyFees = sumByPeriod(payments, months, (p) => p.createdAt, (p) => p.fee)
  const byCategory = categories.map((c) => ({ label: c.name, value: requests.filter((r) => r.categoryId === c.id).length }))
  const latest = [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6)

  return (
    <>
      <PageHeader title="Dashboard" description="Resumen de la actividad de la plataforma." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Clientes" value={clients.length} icon={Users} hint={`${clients.filter((c) => c.active).length} activos`} />
        <StatCard label="Profesionales" value={professionals.length} icon={HardHat} hint={`${professionals.filter((p) => p.verified).length} verificados`} />
        <StatCard label="Solicitudes activas" value={active.length} icon={ClipboardList} hint={`${requests.length} en total`} />
        <StatCard label="Comisiones del mes" value={formatGs(monthlyFees[monthlyFees.length - 1])} icon={Landmark} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Ingresos por comisión</h2>
          <p className="mb-6 text-sm text-muted-foreground">Últimos 6 meses. En dorado, el mes actual.</p>
          <ColumnChart
            title="Ingresos por comisión por mes"
            data={months.map((m, i) => ({ label: m.label, value: monthlyFees[i], highlight: i === months.length - 1 }))}
            formatValue={formatGs}
            formatShort={formatGsShort}
          />
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Solicitudes por categoría</h2>
          <p className="mb-6 text-sm text-muted-foreground">Total histórico.</p>
          <BarList title="Solicitudes por categoría" data={byCategory} formatValue={(v) => String(v)} />
        </Card>
      </div>

      <Card className="mt-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold">Últimas solicitudes</h2>
          <Link to="/admin/solicitudes" className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Ver todas
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {latest.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
              <div className="min-w-0">
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-muted-foreground">
                  {r.code} · {dir.user(r.clientId)?.name} → {dir.professional(r.professionalId)?.name} · {formatDate(r.createdAt)}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
