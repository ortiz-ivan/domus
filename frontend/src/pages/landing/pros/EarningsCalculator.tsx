import { useId, useState } from 'react'
import { formatGs } from '@/lib/format'
import { useDemoStore } from '@/store/demo'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (value: number) => void
}

function Slider({ label, value, min, max, step, display, onChange }: SliderProps) {
  const id = useId()
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <output htmlFor={id} className="font-heading text-lg font-bold tabular-nums">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={display}
        className="mt-3 h-11 w-full cursor-pointer accent-primary"
      />
    </div>
  )
}

/** Calculadora: trabajos por mes × precio promedio, menos la comisión que cobra Domus (la de Configuración) */
export function EarningsCalculator() {
  const commissionRate = useDemoStore((s) => s.settings.commissionRate)
  const [jobs, setJobs] = useState(12)
  const [price, setPrice] = useState(200000)

  const gross = jobs * price
  const fee = Math.round(gross * commissionRate)
  const net = gross - fee

  return (
    <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
      <div className="space-y-8">
        <Slider label="Trabajos por mes" value={jobs} min={1} max={60} step={1} display={String(jobs)} onChange={setJobs} />
        <Slider
          label="Precio promedio por trabajo"
          value={price}
          min={50000}
          max={1000000}
          step={10000}
          display={formatGs(price)}
          onChange={setPrice}
        />
      </div>

      <div className="flex flex-col justify-center rounded-2xl bg-primary p-6 text-on-primary sm:p-8" aria-live="polite">
        <p className="text-sm text-white/80">Ganarías por mes</p>
        <p className="font-heading text-4xl font-bold sm:text-5xl">{formatGs(net)}</p>
        <dl className="mt-6 space-y-2 border-t border-white/15 pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-white/80">Total de tus trabajos</dt>
            <dd className="tabular-nums">{formatGs(gross)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-white/80">Comisión Domus ({Math.round(commissionRate * 100)}%)</dt>
            <dd className="tabular-nums">−{formatGs(fee)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-white/70">La comisión se descuenta solo de los trabajos cobrados. Cálculo de ejemplo.</p>
      </div>
    </div>
  )
}
