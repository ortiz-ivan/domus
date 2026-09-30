import { BatteryFull, ChevronLeft, Signal, Wifi } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * Celular decorativo de la landing: marco, isla y barra de estado. `screenKey` remonta la
 * pantalla al cambiarla, así entra con la animación y reinicia su recorrido.
 */
export function PhoneFrame({ screenKey, children }: { screenKey: string; children: ReactNode }) {
  return (
    <div className="rounded-[2.75rem] bg-primary p-2.5 shadow-2xl ring-1 ring-primary/20">
      <div className="relative h-[31rem] overflow-hidden rounded-[2.25rem] bg-card text-foreground">
        <div className="relative flex h-9 items-center justify-between px-6 text-[11px] font-semibold">
          <span>9:41</span>
          <span className="absolute top-2 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-primary" />
          <span className="flex items-center gap-1">
            <Signal className="size-3" />
            <Wifi className="size-3" />
            <BatteryFull className="size-3.5" />
          </span>
        </div>
        <div key={screenKey} className="h-[calc(100%-2.25rem)] animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  )
}

/** Barra superior de las pantallas: logo en el inicio, flecha atrás en las demás */
export function AppBar({ title, back = false }: { title: string; back?: boolean }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
      {back ? (
        <ChevronLeft className="size-4 text-muted-foreground" />
      ) : (
        <img src="/domus_isotipo.png" alt="" width={20} height={20} className="size-5 rounded" />
      )}
      <p className="font-heading text-sm font-semibold">{title}</p>
    </div>
  )
}
