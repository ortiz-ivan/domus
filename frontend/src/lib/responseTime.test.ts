import { describe, expect, it } from 'vitest'
import { createSeed } from '@/data/seed'
import { formatResponseTime, isFastResponder } from './responseTime'

describe('formatResponseTime', () => {
  it('usa minutos, horas o días según el tamaño', () => {
    expect(formatResponseTime(8)).toBe('8 min')
    expect(formatResponseTime(45)).toBe('45 min')
    expect(formatResponseTime(90)).toBe('2 h')
    expect(formatResponseTime(300)).toBe('5 h')
    expect(formatResponseTime(1440)).toBe('1 día')
    expect(formatResponseTime(4000)).toBe('3 días')
  })
})

describe('tiempos de respuesta del seed', () => {
  it('todos los profesionales tienen uno y hay rápidos y lentos para comparar', () => {
    const { professionals } = createSeed()
    expect(professionals.every((p) => p.responseMinutes > 0)).toBe(true)
    expect(professionals.some((p) => isFastResponder(p.responseMinutes))).toBe(true)
    expect(professionals.some((p) => !isFastResponder(p.responseMinutes))).toBe(true)
  })

  it('Carlos, el profesional demo, responde rápido', () => {
    expect(isFastResponder(createSeed().professionals.find((p) => p.id === 'p-1')!.responseMinutes)).toBe(true)
  })
})
