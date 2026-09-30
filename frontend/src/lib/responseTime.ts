/** Hasta cuántos minutos se considera que un profesional responde rápido */
export const FAST_RESPONSE_MINUTES = 30

/** 15 → "15 min", 90 → "2 h", 1440 → "1 día" (redondeado: es un tiempo típico, no exacto) */
export function formatResponseTime(minutes: number): string {
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h`
  const days = Math.round(hours / 24)
  return days === 1 ? '1 día' : `${days} días`
}

export const isFastResponder = (minutes: number) => minutes <= FAST_RESPONSE_MINUTES
