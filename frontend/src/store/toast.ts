import { create } from 'zustand'

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

/** Avisos breves. Se cierran solos: 4 s, o 7 s si traen una acción para dar tiempo a usarla. */
export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message, tone = 'success', action) => {
    const id = nextId++
    // Máximo 3 a la vez: si llegan muchos juntos, se descartan los más viejos
    set((s) => ({ toasts: [...s.toasts, { id, message, tone, action }].slice(-3) }))
    setTimeout(() => get().dismiss(id), action ? 7000 : 4000)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = (message: string, tone?: Toast['tone'], action?: ToastAction) => useToastStore.getState().show(message, tone, action)
