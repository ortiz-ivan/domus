import { BadgePercent, Banknote, Receipt, Wallet } from 'lucide-react'
import { BarList } from '@/components/charts/BarList'
import { ColumnChart } from '@/components/charts/ColumnChart'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ShowMore } from '@/components/ui/ShowMore'
import { StatCard } from '@/components/ui/StatCard'
import { formatDate, formatGs, formatGsShort } from '@/lib/format'
import { lastMonths, sumByPeriod } from '@/lib/periods'
import { usePaged } from '@/lib/usePaged'
import { useDemoStore } from '@/store/demo'
import { useDirectory } from '@/store/selectors'
import type { PaymentMethod } from '@/types'

const METHOD_LABELS: Record<PaymentMethod, string> = { tarjeta: 'Tarjeta', transferencia: 'Transferencia', billetera: 'Billetera electrónica' }

export function AdminFinanzasPage() {
  const payments = useDemoStore((s) => s.payments)
  const requests = useDemoStore((s) => s.requests)
  const dir = useDirectory()

  const sorted = [...payments].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const page = usePaged(sorted)
  const volume = payments.reduce((s, p) => s + p.amount, 0)
  const fees = payments.reduce((s, p) => s + p.fee, 0)
  const months = lastMonths(6)
  const monthlyVolume = sumByPeriod(payments, months, (p) => p.createdAt, (p) => p.amount)
  const byMethod = (Object.keys(METHOD_LABELS) as PaymentMethod[]).map((m) => ({
    label: METHOD_LABELS[m],
    value: payments.filter((p) => p.method === m).reduce((s, p) => s + p.amount, 0),
  }))
  const requestOf = (id: string) => requests.find((r) => r.id === id)

  return (
    <>
      <PageHeader title="Finanzas" description="Pagos procesados en la plataforma (simulados)." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Volumen transaccionado" value={formatGs(volume)} icon={Banknote} hint={`${payments.length} pagos`} />
        <StatCard label="Comisiones Domus" value={formatGs(fees)} icon={BadgePercent} />
        <StatCard label="Pagado a profesionales" value={formatGs(volume - fees)} icon={Wallet} />
        <StatCard label="Ticket promedio" value={formatGs(payments.length ? Math.round(volume / payments.length) : 0)} icon={Receipt} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card>
          <h2 className="text-lg font-semibold">Volumen por mes</h2>
          <p className="mb-6 text-sm text-muted-foreground">Últimos 6 meses. En dorado, el mes actual.</p>
          <ColumnChart
            title="Volumen transaccionado por mes"
            data={months.map((m, i) => ({ label: m.label, value: monthlyVolume[i], highlight: i === months.length - 1 }))}
            formatValue={formatGs}
            formatShort={formatGsShort}
          />
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Por método de pago</h2>
          <p className="mb-6 text-sm text-muted-foreground">Volumen total.</p>
          <BarList title="Volumen por método de pago" labelHeader="Método" data={byMethod} formatValue={formatGsShort} />
        </Card>
      </div>

      <Card className="mt-6" padded={false}>
        <h2 className="p-4 text-lg font-semibold sm:px-6">Pagos recientes</h2>
        <ul className="divide-y divide-border border-t border-border md:hidden">
          {page.items.map((p) => {
            const r = requestOf(p.requestId)
            return (
              <li key={p.id} className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="font-medium">{r?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(p.createdAt)} · {METHOD_LABELS[p.method]}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold tabular-nums">{formatGs(p.amount)}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">Comisión {formatGs(p.fee)}</p>
                </div>
              </li>
            )
          })}
        </ul>
        <table className="hidden w-full border-t border-border text-left text-sm md:table">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="px-6 py-3 font-medium">Fecha</th>
              <th scope="col" className="px-3 py-3 font-medium">Solicitud</th>
              <th scope="col" className="px-3 py-3 font-medium">Profesional</th>
              <th scope="col" className="px-3 py-3 font-medium">Método</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Monto</th>
              <th scope="col" className="px-6 py-3 text-right font-medium">Comisión</th>
            </tr>
          </thead>
          <tbody>
            {page.items.map((p) => {
              const r = requestOf(p.requestId)
              return (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 whitespace-nowrap">{formatDate(p.createdAt)}</td>
                  <td className="px-3 py-3">
                    <p className="font-medium">{r?.title}</p>
                    <p className="text-muted-foreground">{r?.code}</p>
                  </td>
                  <td className="px-3 py-3">{r && dir.professional(r.professionalId)?.name}</td>
                  <td className="px-3 py-3">{METHOD_LABELS[p.method]}</td>
                  <td className="px-3 py-3 text-right whitespace-nowrap tabular-nums">{formatGs(p.amount)}</td>
                  <td className="px-6 py-3 text-right whitespace-nowrap tabular-nums">{formatGs(p.fee)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <ShowMore {...page} onShowMore={page.showMore} noun="pagos" />
      </Card>
    </>
  )
}
