import { beforeEach, describe, expect, it } from 'vitest'
import { DEMO_USER_IDS } from '@/data/seed'
import { diffNotifications, type Viewer } from '@/lib/notifications'
import { useDemoStore } from '@/store/demo'

const store = () => useDemoStore.getState()
const snapshot = () => {
  const { requests, users, professionals, payments } = store()
  return { requests, users, professionals, payments }
}

const cliente: Viewer = { role: 'cliente', userId: DEMO_USER_IDS.cliente }
const profesional: Viewer = { role: 'profesional', userId: DEMO_USER_IDS.profesional } // Carlos, p-1
const admin: Viewer = { role: 'admin', userId: DEMO_USER_IDS.admin }
const otroProfesional: Viewer = { role: 'profesional', userId: 'u-pro-3' } // Fernando, p-3

/** Ejecuta una acción y devuelve lo que vería cada rol */
function noticesAfter(action: () => void) {
  const prev = snapshot()
  action()
  const next = snapshot()
  // Intl separa "Gs." del número con un espacio no separable: se normaliza para comparar
  const messages = (viewer: Viewer) => diffNotifications(prev, next, viewer).map((n) => n.message.replaceAll(' ', ' '))
  return {
    cliente: messages(cliente),
    profesional: messages(profesional),
    admin: messages(admin),
    otroProfesional: messages(otroProfesional),
  }
}

let id = ''
const create = () => {
  id = store().createRequest({
    clientId: DEMO_USER_IDS.cliente,
    professionalId: 'p-1',
    categoryId: 'plomeria',
    title: 'Pérdidas de agua',
    description: 'Gotea la canilla.',
    address: 'Av. España 1234',
    city: 'Asunción',
    date: '2030-01-10',
    timeSlot: 'manana',
    price: 150000,
  })
}

beforeEach(() => {
  localStorage.clear()
  store().resetDemo()
})

describe('avisos en tiempo real', () => {
  it('la solicitud nueva le llega al profesional elegido y al admin, no al cliente que la creó', () => {
    const n = noticesAfter(create)
    expect(n.profesional).toEqual(['Nueva solicitud de María: Pérdidas de agua'])
    expect(n.admin).toEqual([expect.stringMatching(/^Nueva solicitud DOM-\d+: Pérdidas de agua$/)])
    expect(n.cliente).toEqual([])
    expect(n.otroProfesional).toEqual([])
  })

  it('cada avance del profesional le llega solo al cliente', () => {
    create()
    const aceptada = noticesAfter(() => store().transition(id, 'aceptada', 'profesional'))
    expect(aceptada.cliente).toEqual(['Carlos aceptó tu solicitud “Pérdidas de agua”'])
    expect(aceptada.profesional).toEqual([])
    expect(aceptada.admin).toEqual([])

    expect(noticesAfter(() => store().transition(id, 'en_proceso', 'profesional')).cliente).toEqual([
      'Carlos empezó a trabajar en “Pérdidas de agua”',
    ])

    const terminada = diffNotifications(snapshot(), (store().transition(id, 'terminada', 'profesional'), snapshot()), cliente)
    expect(terminada).toEqual([
      { message: 'Carlos terminó “Pérdidas de agua”. Confirmá que quedó bien', action: { label: 'Confirmar', to: `/cliente/solicitudes/${id}/confirmar` } },
    ])
  })

  it('las acciones del cliente le llegan al profesional', () => {
    create()
    store().transition(id, 'aceptada', 'profesional')
    store().transition(id, 'en_proceso', 'profesional')
    store().transition(id, 'terminada', 'profesional')

    const confirmada = noticesAfter(() => store().transition(id, 'confirmada', 'cliente'))
    expect(confirmada.profesional).toEqual(['María confirmó que “Pérdidas de agua” quedó bien'])
    expect(confirmada.cliente).toEqual([])

    store().addReview(id, 5, '')
    const pagada = noticesAfter(() => store().payRequest(id, 'tarjeta'))
    expect(pagada.profesional).toEqual(['Recibiste el pago de “Pérdidas de agua” (Gs. 135.000 neto)'])
    expect(pagada.admin).toEqual([expect.stringMatching(/^Pago recibido: DOM-\d+ · Gs\. 150\.000$/)])
    expect(pagada.cliente).toEqual([])
  })

  it('rechazo y cancelación', () => {
    create()
    expect(noticesAfter(() => store().transition(id, 'rechazada', 'profesional')).cliente).toEqual(['Carlos no puede tomar “Pérdidas de agua”'])

    create()
    expect(noticesAfter(() => store().transition(id, 'cancelada', 'cliente')).profesional).toEqual(['María canceló “Pérdidas de agua”'])
  })

  it('reiniciar la demo no genera avisos', () => {
    create()
    store().transition('r-1', 'aceptada', 'profesional')
    const n = noticesAfter(() => store().resetDemo())
    expect(n).toEqual({ cliente: [], profesional: [], admin: [], otroProfesional: [] })
  })

  it('sin cambios en solicitudes no hay avisos', () => {
    const n = noticesAfter(() => store().updateSettings({ supportEmail: 'otro@domus.com.py' }))
    expect(n).toEqual({ cliente: [], profesional: [], admin: [], otroProfesional: [] })
  })
})
