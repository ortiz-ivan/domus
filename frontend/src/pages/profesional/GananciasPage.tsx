import { BadgePercent, Briefcase, CalendarCheck, Wallet } from 'lucide-react'
import { ColumnChart } from '@/components/charts/ColumnChart'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { formatDate, formatGs, formatGsShort } from '@/lib/format'
import { lastMonths, lastWeeks, sumByPeriod } from '@/lib/periods'
import { useDemoStore } from '@/store/demo'
import { useDirectory } from '@/store/selectors'
import { useProRequests } from './useProRequests'

export function GananciasPage() {
  const requests = useProRequests()
  const allPayments = useDemoStore((s) => s.payments)
  const dir = useDirectory()

  const byId = new Map(requests.map((r) => [r.id, r]))
  const payments = allPayments.filter((p) => byId.has(p.requestId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const net = (p: (typeof payments)[number]) => p.amount - p.fee

  const [month] = lastMonths(1)
  const monthPayments = payments.filter((p) => new Date(p.createdAt).getTime() >= month.start)
  const totalNet = payments.reduce((s, p) => s + net(p), 0)
  const totalFees = payments.reduce((s, p) => s + p.fee, 0)

  const weeks = lastWeeks(8)
  const weekly = sumByPeriod(payments, weeks, (p) => p.createdAt, net)
  const chartData = weeks.map((w, i) => ({ label: w.label, value: weekly[i], highlight: i === weeks.length - 1 }))

  return (
    <>
      <PageHeader title="Ganancias" description="Lo que cobraste por tus trabajos, ya descontada la comisión de Domus." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Este mes" value={formatGs(monthPayments.reduce((s, p) => s + net(p), 0))} icon={CalendarCheck} hint={`${monthPayments.length} trabajos cobrados`} />
        <StatCard label="Total cobrado" value={formatGs(totalNet)} icon={Wallet} hint="Últimos 6 meses" />
        <StatCard label="Comisión Domus" value={formatGs(totalFees)} icon={BadgePercent} />
        <StatCard label="Trabajos pagados" value={payments.length} icon={Briefcase} />
      </div>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold">Ganancias netas por semana</h2>
        <p className="mb-6 text-sm text-muted-foreground">Últimas 8 semanas. En dorado, la semana actual.</p>
        <ColumnChart data={chartData} title="Ganancias netas por semana" formatValue={formatGs} formatShort={formatGsShort} />
      </Card>

      <Card className="mt-6">
        <h2 className="mb-4 text-lg font-semibold">Detalle de cobros</h2>
        {payments.length === 0 ? (
          <p className="text-muted-foreground">Todavía no cobraste trabajos.</p>
        ) : (
          <>
            {/* Móvil: lista */}
            <ul className="divide-y divide-border md:hidden">
              {payments.map((p) => {
                const r = byId.get(p.requestId)!
                return (
                  <li key={p.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="font-medium">{r.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(p.createdAt)} · {dir.user(r.clientId)?.name}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold tabular-nums">{formatGs(net(p))}</p>
                  </li>
                )
              })}
            </ul>
            {/* Escritorio: tabla */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th scope="col" className="py-2 font-medium">Fecha</th>
                  <th scope="col" className="py-2 font-medium">Trabajo</th>
                  <th scope="col" className="py-2 font-medium">Cliente</th>
                  <th scope="col" className="py-2 text-right font-medium">Monto</th>
                  <th scope="col" className="py-2 text-right font-medium">Comisión</th>
                  <th scope="col" className="py-2 text-right font-medium">Neto</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const r = byId.get(p.requestId)!
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="py-3 whitespace-nowrap">{formatDate(p.createdAt)}</td>
                      <td className="py-3">{r.title}</td>
                      <td className="py-3">{dir.user(r.clientId)?.name}</td>
                      <td className="py-3 text-right tabular-nums">{formatGs(p.amount)}</td>
                      <td className="py-3 text-right text-muted-foreground tabular-nums">−{formatGs(p.fee)}</td>
                      <td className="py-3 text-right font-semibold tabular-nums">{formatGs(net(p))}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}
      </Card>
    </>
  )
}
