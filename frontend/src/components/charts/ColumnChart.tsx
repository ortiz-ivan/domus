import { cn } from '@/lib/cn'
import { ChartTable } from './ChartTable'

export interface ChartDatum {
  label: string
  value: number
  /** Período actual: se pinta con el color de acento */
  highlight?: boolean
}

interface ColumnChartProps {
  data: ChartDatum[]
  /** Describe el gráfico para lectores de pantalla y encabeza la tabla */
  title: string
  formatValue: (value: number) => string
  /** Formato corto para ejes y etiquetas (p. ej. "1,2 M") */
  formatShort?: (value: number) => string
  className?: string
}

/** Máximo "redondo" (1-2-5 × 10ⁿ) para que los ticks del eje sean números limpios */
function niceMax(value: number): number {
  if (value <= 0) return 1
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 2.5, 5, 10].find((m) => m * magnitude >= value) ?? 10
  return step * magnitude
}

/**
 * Columnas de una sola serie (sin leyenda: el título nombra lo que se grafica).
 * Etiqueta solo el máximo y el período destacado; el resto va en tooltip y tabla.
 */
export function ColumnChart({ data, title, formatValue, formatShort = formatValue, className }: ColumnChartProps) {
  const max = niceMax(Math.max(...data.map((d) => d.value)))
  const peak = Math.max(...data.map((d) => d.value))
  const ticks = [max, max / 2, 0]

  return (
    <figure className={className}>
      <div className="flex gap-2" role="group" aria-label={title}>
        {/* Eje Y */}
        <div className="flex h-52 flex-col justify-between pb-6 text-right text-xs text-muted-foreground tabular-nums" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">
              {formatShort(t)}
            </span>
          ))}
        </div>

        <div className="relative flex-1">
          {/* Grilla: líneas finas y recesivas */}
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between" aria-hidden="true">
            {ticks.map((t) => (
              <span key={t} className="h-px bg-border" />
            ))}
          </div>

          <div className="relative flex h-52 items-stretch justify-around gap-0.5">
            {data.map((d) => {
              const showLabel = d.highlight || (d.value === peak && d.value > 0)
              return (
                <div key={d.label} className="group relative flex flex-1 flex-col items-center">
                  <div className="relative flex w-full flex-1 items-end justify-center">
                    {/* Área de hover más grande que la barra */}
                    <button
                      type="button"
                      className="absolute inset-0 cursor-default rounded-md focus-visible:bg-muted/60"
                      aria-label={`${d.label}: ${formatValue(d.value)}`}
                      tabIndex={0}
                    />
                    <div
                      className={cn(
                        'pointer-events-none relative w-full max-w-6 rounded-t-[4px] transition-opacity duration-150 group-hover:opacity-85',
                        d.highlight ? 'bg-chart-highlight' : 'bg-chart',
                      )}
                      style={{ height: `${(d.value / max) * 100}%` }}
                    >
                      {showLabel && (
                        <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 text-xs font-semibold whitespace-nowrap text-foreground tabular-nums group-hover:invisible group-focus-within:invisible">
                          {formatShort(d.value)}
                        </span>
                      )}
                    </div>
                    {/* Tooltip */}
                    <div className="pointer-events-none invisible absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg bg-primary px-2.5 py-1.5 text-xs whitespace-nowrap text-on-primary shadow-lg group-hover:visible group-focus-within:visible">
                      <p className="text-white/80">{d.label}</p>
                      <p className="font-semibold tabular-nums">{formatValue(d.value)}</p>
                    </div>
                  </div>
                  <span className="mt-1 h-5 text-xs text-muted-foreground">{d.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <ChartTable title={title} rows={data.map((d) => [d.label, formatValue(d.value)])} />
    </figure>
  )
}
