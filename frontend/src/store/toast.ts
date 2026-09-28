import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
  tone: 'success' | 'info'
}

interface ToastState {
  toasts: Toast[]
  show: (message: string, tone?: Toast['tone']) => void
  dismiss: (id: number) => void
}

let nextId = 1

/** Avisos breves de confirmación ("Solicitud enviada"). Se cierran solos a los 4 s. */
export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message, tone = 'success') => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }))
    setTimeout(() => get().dismiss(id), 4000)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = (message: string, tone?: Toast['tone']) => useToastStore.getState().show(message, tone)
