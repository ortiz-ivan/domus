import { ChartTable } from './ChartTable'

interface BarListProps {
  data: { label: string; value: number }[]
  title: string
  formatValue: (value: number) => string
  /** Encabezado de la primera columna en la tabla alternativa */
  labelHeader?: string
}

/**
 * Barras horizontales ordenadas de mayor a menor (comparar categorías).
 * Pocas barras: el valor va en la punta de cada una y la etiqueta de texto queda legible sin rotar.
 */
export function BarList({ data, title, formatValue, labelHeader = 'Categoría' }: BarListProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value)
  const max = Math.max(1, ...sorted.map((d) => d.value))

  return (
    <figure>
      <ul className="space-y-3" aria-label={title}>
        {sorted.map((d) => (
          <li key={d.label} className="grid grid-cols-[minmax(6rem,9rem)_1fr] items-center gap-3 text-sm">
            <span className="text-foreground">{d.label}</span>
            <span className="flex items-center gap-2">
              <span
                className="h-5 max-h-6 rounded-r-[4px] bg-chart"
                style={{ width: `${(d.value / max) * 85}%`, minWidth: d.value > 0 ? '4px' : 0 }}
                aria-hidden="true"
              />
              <span className="font-semibold whitespace-nowrap tabular-nums">{formatValue(d.value)}</span>
            </span>
          </li>
        ))}
      </ul>
      <ChartTable title={title} headers={[labelHeader, 'Valor']} rows={sorted.map((d) => [d.label, formatValue(d.value)])} />
    </figure>
  )
}
