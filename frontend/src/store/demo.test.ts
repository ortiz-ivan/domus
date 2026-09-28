import { beforeEach, describe, expect, it } from 'vitest'
import { DEMO_USER_IDS } from '@/data/seed'
import { clientNextAction } from '@/pages/cliente/nextAction'
import { useDemoStore, type NewRequestInput } from '@/store/demo'
import { ratingOf } from '@/store/selectors'
import { TRANSITIONS } from '@/lib/status'
import type { RequestStatus } from '@/types'

const store = () => useDemoStore.getState()
const requestById = (id: string) => store().requests.find((r) => r.id === id)!

/** Solicitud del cliente demo a Carlos (p-1, plomería) */
function newInput(overrides: Partial<NewRequestInput> = {}): NewRequestInput {
  return {
    clientId: DEMO_USER_IDS.cliente,
    professionalId: 'p-1',
    categoryId: 'plomeria',
    title: 'Pérdidas de agua',
    description: 'Gotea la canilla del baño desde ayer.',
    address: 'Av. España 1234',
    city: 'Asunción',
    date: '2030-01-10',
    timeSlot: 'manana',
    price: 150000,
    ...overrides,
  }
}

beforeEach(() => {
  localStorage.clear()
  store().resetDemo()
})

describe('flujo principal de la demo', () => {
  it('recorre solicitud → aceptada → en proceso → terminada → confirmada → calificada → pagada', () => {
    const jobsBefore = store().professionals.find((p) => p.id === 'p-1')!.jobsCompleted
    const reviewsBefore = store().reviews.length
    const paymentsBefore = store().payments.length

    const id = store().createRequest(newInput())
    expect(requestById(id).status).toBe('pendiente')
    expect(requestById(id).code).toBe('DOM-1002') // el seed llega hasta DOM-1001

    expect(store().transition(id, 'aceptada', 'profesional')).toBe(true)
    expect(store().transition(id, 'en_proceso', 'profesional')).toBe(true)
    expect(store().transition(id, 'terminada', 'profesional')).toBe(true)
    expect(clientNextAction(requestById(id), false)?.to).toBe(`/cliente/solicitudes/${id}/confirmar`)

    expect(store().transition(id, 'confirmada', 'cliente')).toBe(true)
    expect(clientNextAction(requestById(id), false)?.to).toBe(`/cliente/solicitudes/${id}/calificar`)

    store().addReview(id, 5, 'Excelente')
    expect(store().reviews).toHaveLength(reviewsBefore + 1)
    expect(clientNextAction(requestById(id), true)?.to).toBe(`/cliente/solicitudes/${id}/pago`)

    expect(store().payRequest(id, 'tarjeta')).toBe(true)
    const request = requestById(id)
    expect(request.status).toBe('pagada')
    expect(request.history.map((h) => h.status)).toEqual(['pendiente', 'aceptada', 'en_proceso', 'terminada', 'confirmada', 'pagada'])
    expect(clientNextAction(request, true)).toBeNull()

    const payment = store().payments.find((p) => p.requestId === id)!
    expect(store().payments).toHaveLength(paymentsBefore + 1)
    expect(payment).toMatchObject({ amount: 150000, fee: 15000, method: 'tarjeta' })
    expect(store().professionals.find((p) => p.id === 'p-1')!.jobsCompleted).toBe(jobsBefore + 1)
  })

  it('guarda el motivo del rechazo en el historial', () => {
    const id = store().createRequest(newInput())
    expect(store().transition(id, 'rechazada', 'profesional', 'Fuera de mi zona')).toBe(true)
    expect(requestById(id).history.at(-1)).toMatchObject({ status: 'rechazada', note: 'Fuera de mi zona' })
  })

  it('el cliente puede cancelar mientras el trabajo no empezó', () => {
    const pending = store().createRequest(newInput())
    expect(store().transition(pending, 'cancelada', 'cliente')).toBe(true)

    const accepted = store().createRequest(newInput())
    store().transition(accepted, 'aceptada', 'profesional')
    expect(store().transition(accepted, 'cancelada', 'cliente')).toBe(true)

    const started = store().createRequest(newInput())
    store().transition(started, 'aceptada', 'profesional')
    store().transition(started, 'en_proceso', 'profesional')
    expect(store().transition(started, 'cancelada', 'cliente')).toBe(false)
  })
})

describe('transiciones prohibidas', () => {
  it('cada paso solo lo puede dar su rol', () => {
    const id = store().createRequest(newInput())
    expect(store().transition(id, 'aceptada', 'cliente')).toBe(false)
    expect(store().transition(id, 'aceptada', 'admin')).toBe(false)
    store().transition(id, 'aceptada', 'profesional')
    store().transition(id, 'en_proceso', 'profesional')
    store().transition(id, 'terminada', 'profesional')
    expect(store().transition(id, 'confirmada', 'profesional')).toBe(false)
    expect(requestById(id).status).toBe('terminada')
  })

  it('no se pueden saltear pasos', () => {
    const id = store().createRequest(newInput())
    const skips: RequestStatus[] = ['en_proceso', 'terminada', 'confirmada', 'pagada']
    for (const to of skips) {
      expect(store().transition(id, to, 'profesional')).toBe(false)
      expect(store().transition(id, to, 'cliente')).toBe(false)
    }
    expect(requestById(id).history).toHaveLength(1)
  })

  it('no se paga antes de confirmar ni dos veces', () => {
    const id = store().createRequest(newInput())
    expect(store().payRequest(id, 'tarjeta')).toBe(false)

    store().transition(id, 'aceptada', 'profesional')
    store().transition(id, 'en_proceso', 'profesional')
    store().transition(id, 'terminada', 'profesional')
    expect(store().payRequest(id, 'tarjeta')).toBe(false)

    store().transition(id, 'confirmada', 'cliente')
    const paymentsBefore = store().payments.length
    expect(store().payRequest(id, 'transferencia')).toBe(true)
    expect(store().payRequest(id, 'transferencia')).toBe(false)
    expect(store().payments).toHaveLength(paymentsBefore + 1)
  })

  it('los estados finales no cambian más', () => {
    const rejected = store().createRequest(newInput())
    store().transition(rejected, 'rechazada', 'profesional')
    expect(store().transition(rejected, 'aceptada', 'profesional')).toBe(false)

    const cancelled = store().createRequest(newInput())
    store().transition(cancelled, 'cancelada', 'cliente')
    expect(store().transition(cancelled, 'aceptada', 'profesional')).toBe(false)
  })

  it('una solicitud inexistente no cambia nada', () => {
    const before = store().requests
    expect(store().transition('no-existe', 'aceptada', 'profesional')).toBe(false)
    expect(store().payRequest('no-existe', 'tarjeta')).toBe(false)
    expect(store().requests).toBe(before)
  })

  it('se califica una sola vez por solicitud', () => {
    const id = store().createRequest(newInput())
    const before = store().reviews.length
    store().addReview(id, 5, 'Primera')
    store().addReview(id, 1, 'Segunda')
    expect(store().reviews).toHaveLength(before + 1)
    expect(store().reviews.find((r) => r.requestId === id)?.comment).toBe('Primera')
  })
})

describe('configuración y calificaciones', () => {
  it('la comisión nueva se aplica solo a los pagos nuevos', () => {
    const oldFees = store().payments.map((p) => p.fee)
    store().updateSettings({ commissionRate: 0.2 })
    const id = store().createRequest(newInput({ price: 200000 }))
    store().transition(id, 'aceptada', 'profesional')
    store().transition(id, 'en_proceso', 'profesional')
    store().transition(id, 'terminada', 'profesional')
    store().transition(id, 'confirmada', 'cliente')
    store().payRequest(id, 'billetera')
    expect(store().payments.find((p) => p.requestId === id)?.fee).toBe(40000)
    expect(store().payments.filter((p) => p.requestId !== id).map((p) => p.fee)).toEqual(oldFees)
  })

  it('el promedio combina reseñas históricas y nuevas', () => {
    const pro = { ...store().professionals[0], id: 'x', pastRating: { average: 4, count: 3 } }
    const reviews = [5, 5].map((rating, i) => ({ id: `r${i}`, requestId: `q${i}`, professionalId: 'x', clientId: 'c', rating, comment: '', createdAt: '' }))
    expect(ratingOf(reviews, pro)).toEqual({ average: 4.4, count: 5 }) // (4·3 + 10) / 5
    expect(ratingOf([], { ...pro, pastRating: { average: 0, count: 0 } })).toEqual({ average: 0, count: 0 })
  })

  it('reiniciar la demo vuelve al estado inicial', () => {
    store().createRequest(newInput())
    store().updateSettings({ commissionRate: 0.3 })
    store().resetDemo()
    expect(store().requests.some((r) => r.code === 'DOM-1002')).toBe(false)
    expect(store().settings.commissionRate).toBe(0.1)
  })
})

describe('integridad de los datos semilla', () => {
  it('toda solicitud apunta a cliente, profesional y categoría existentes', () => {
    const { requests, users, professionals, categories } = store()
    for (const r of requests) {
      expect(users.find((u) => u.id === r.clientId)?.role, r.id).toBe('cliente')
      const pro = professionals.find((p) => p.id === r.professionalId)
      expect(pro, r.id).toBeDefined()
      expect(pro!.categoryIds, r.id).toContain(r.categoryId)
      expect(categories.some((c) => c.id === r.categoryId), r.id).toBe(true)
    }
  })

  it('ids y códigos son únicos', () => {
    const { requests, reviews, payments } = store()
    expect(new Set(requests.map((r) => r.id)).size).toBe(requests.length)
    expect(new Set(requests.map((r) => r.code)).size).toBe(requests.length)
    expect(new Set(reviews.map((r) => r.id)).size).toBe(reviews.length)
    expect(new Set(payments.map((p) => p.id)).size).toBe(payments.length)
  })

  it('cada solicitud pagada tiene exactamente un pago y viceversa', () => {
    const { requests, payments } = store()
    const paid = requests.filter((r) => r.status === 'pagada')
    expect(payments).toHaveLength(paid.length)
    for (const r of paid) expect(payments.filter((p) => p.requestId === r.id)).toHaveLength(1)
  })

  it('el historial termina en el estado actual y respeta las transiciones', () => {
    for (const r of store().requests) {
      expect(r.history.at(-1)?.status, r.id).toBe(r.status)
      expect(r.history[0].status, r.id).toBe('pendiente')
      for (let i = 1; i < r.history.length; i++) {
        const from = r.history[i - 1].status
        const to = r.history[i].status
        expect(TRANSITIONS[from][to], `${r.id}: ${from} → ${to}`).toBeDefined()
      }
    }
  })

  it('cada usuario profesional tiene su perfil', () => {
    const { users, professionals } = store()
    for (const u of users.filter((x) => x.role === 'profesional')) {
      expect(professionals.some((p) => p.userId === u.id), u.id).toBe(true)
    }
    expect(professionals.some((p) => p.userId === DEMO_USER_IDS.profesional)).toBe(true)
  })

  it('cada categoría tiene entre 12 y 16 profesionales', () => {
    const { categories, professionals } = store()
    for (const c of categories) {
      const count = professionals.filter((p) => p.categoryIds.includes(c.id)).length
      expect(count, c.id).toBeGreaterThanOrEqual(12)
      expect(count, c.id).toBeLessThanOrEqual(16)
    }
  })

  it('los profesionales no repiten nombre ni email, y ningún plomero es Premium de entrada', () => {
    const { professionals, users } = store()
    expect(new Set(professionals.map((p) => p.name)).size).toBe(professionals.length)
    const proEmails = users.filter((u) => u.role === 'profesional').map((u) => u.email)
    expect(new Set(proEmails).size).toBe(proEmails.length)
    expect(professionals.filter((p) => p.categoryIds.includes('plomeria') && p.plan === 'premium')).toEqual([])
  })

  it('el cliente demo tiene solicitudes en distintos estados', () => {
    const own = store().requests.filter((r) => r.clientId === DEMO_USER_IDS.cliente).map((r) => r.status)
    expect(own).toEqual(expect.arrayContaining(['pendiente', 'en_proceso', 'terminada', 'pagada']))
  })
})

describe('persistencia y sincronización entre pestañas', () => {
  it('guarda el estado en localStorage', () => {
    const id = store().createRequest(newInput())
    const saved = JSON.parse(localStorage.getItem('domus-demo')!)
    expect(saved.state.requests.some((r: { id: string }) => r.id === id)).toBe(true)
  })

  it('aplica los cambios que hace otra pestaña', async () => {
    // Simula otra pestaña: escribe un estado con una solicitud aceptada y dispara el evento "storage"
    const saved = JSON.parse(localStorage.getItem('domus-demo')!)
    saved.state.requests = saved.state.requests.map((r: { id: string; status: string }) =>
      r.id === 'r-1' ? { ...r, status: 'aceptada' } : r,
    )
    const value = JSON.stringify(saved)
    localStorage.setItem('domus-demo', value)
    window.dispatchEvent(new StorageEvent('storage', { key: 'domus-demo', newValue: value }))

    await Promise.resolve()
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(requestById('r-1').status).toBe('aceptada')
  })
})
