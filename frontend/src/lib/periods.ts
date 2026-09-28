const DAY = 24 * 60 * 60 * 1000

export interface Period {
  label: string
  start: number
  end: number
}

const monthLabel = new Intl.DateTimeFormat('es-PY', { month: 'short' })
const dayLabel = new Intl.DateTimeFormat('es-PY', { day: 'numeric', month: 'short' })

/** Últimas n semanas (lunes a domingo), la actual al final */
export function lastWeeks(n: number, now = new Date()): Period[] {
  const monday = new Date(now)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return Array.from({ length: n }, (_, i) => {
    const start = monday.getTime() - (n - 1 - i) * 7 * DAY
    return { label: dayLabel.format(start), start, end: start + 7 * DAY }
  })
}

/** Últimos n meses calendario, el actual al final */
export function lastMonths(n: number, now = new Date()): Period[] {
  return Array.from({ length: n }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1)
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1)
    return { label: monthLabel.format(start).replace('.', ''), start: start.getTime(), end: end.getTime() }
  })
}

/** Suma un valor por período según la fecha ISO de cada ítem */
export function sumByPeriod<T>(items: T[], periods: Period[], date: (item: T) => string, value: (item: T) => number): number[] {
  return periods.map((p) =>
    items.reduce((sum, item) => {
      const t = new Date(date(item)).getTime()
      return t >= p.start && t < p.end ? sum + value(item) : sum
    }, 0),
  )
}
