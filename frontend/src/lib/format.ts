import type { TimeSlot } from '@/types'

const currency = new Intl.NumberFormat('es-PY', {
  style: 'currency',
  currency: 'PYG',
  maximumFractionDigits: 0,
})

/** 150000 → "Gs. 150.000" */
export function formatGs(amount: number): string {
  return currency.format(amount)
}

const dateFormat = new Intl.DateTimeFormat('es-PY', { day: 'numeric', month: 'short', year: 'numeric' })
const dateTimeFormat = new Intl.DateTimeFormat('es-PY', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

/** Acepta ISO completo o YYYY-MM-DD (sin corrimiento por zona horaria) */
export function formatDate(value: string): string {
  const date = value.length === 10 ? new Date(`${value}T12:00:00`) : new Date(value)
  return dateFormat.format(date)
}

export function formatDateTime(value: string): string {
  return dateTimeFormat.format(new Date(value))
}

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  manana: 'Mañana (8 a 12 h)',
  tarde: 'Tarde (13 a 18 h)',
  noche: 'Noche (18 a 21 h)',
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

/** Formato compacto para ejes y etiquetas de gráficos: 1250000 → "1,3 M", 450000 → "450 mil" */
export function formatGsShort(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toLocaleString('es-PY', { maximumFractionDigits: 1 })} M`
  if (amount >= 1_000) return `${Math.round(amount / 1_000)} mil`
  return String(amount)
}
