import { create } from 'zustand'
import { IS_EMBEDDED } from '@/app/config'

export interface ToastAction {
  label: string
  to: string
}

export interface Toast {
  id: number
  message: string
  /** success: confirma algo que hizo el usuario. notice: aviso de lo que hizo la otra parte. */
  tone: 'success' | 'info' | 'notice'
  action?: ToastAction
}

interface ToastState {
  toasts: Toast[]
  show: (message: string, tone?: Toast['tone'], action?: ToastAction) => void
  dismiss: (id: number) => void
}

let nextId = 1

/** Lo que dura un aviso de la otra parte. Lo cierra el Toaster, que lo pausa mientras el puntero está encima. */
export const NOTICE_DURATION_MS = 10000

/**
 * Avisos breves. Los propios se cierran solos: 4 s, o 7 s si traen una acción para dar tiempo a usarla.
 * Los de la otra parte (notice) duran más: son los que el jurado tiene que alcanzar a leer en la TV.
 */
export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message, tone = 'success', action) => {
    const id = nextId++
    // Máximo 3 a la vez: si llegan muchos juntos, se descartan los más viejos
    set((s) => ({ toasts: [...s.toasts, { id, message, tone, action }].slice(-3) }))
    if (tone !== 'notice') setTimeout(() => get().dismiss(id), action ? 7000 : 4000)
    // En la vista dividida, el celular que recibe el aviso se ilumina (ver PresentacionPage)
    else if (IS_EMBEDDED) window.parent.postMessage({ type: 'domus:notice' }, window.location.origin)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = (message: string, tone?: Toast['tone'], action?: ToastAction) => useToastStore.getState().show(message, tone, action)
