import { ArrowLeft, BatteryFull, HardHat, RotateCcw, Signal, UserRound, Wifi, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router'
import { ROLE_LABELS } from '@/app/navigation'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { SelectMenu } from '@/components/ui/SelectMenu'
import { DEMO_USER_IDS } from '@/data/seed'
import { cn } from '@/lib/cn'
import { useDemoStore } from '@/store/demo'
import { useDemoProfessionals } from '@/store/selectors'
import type { Role } from '@/types'

// Tamaño lógico de cada celular (px CSS): pantalla de un iPhone estándar con la barra de estado aparte
const SCREEN_W = 390
const SCREEN_H = 780
const STATUS_H = 32
const BEZEL = 12
const FRAME_W = SCREEN_W + BEZEL * 2
const FRAME_H = SCREEN_H + STATUS_H + BEZEL * 2
/** Etiqueta sobre cada celular + separación */
const LABEL_H = 56
const COLUMN_GAP = 64
/** En una TV grande no conviene agrandar más: se ve pixelado y deja de parecer un celular */
const MAX_SCALE = 1.4

const PHONES: { role: Role; icon: LucideIcon }[] = [
  { role: 'cliente', icon: UserRound },
  { role: 'profesional', icon: HardHat },
]

/** Cuánto dura el brillo del celular que recibe un aviso */
const GLOW_MS = 2500

/** Se activa un rato cada vez que la app de ese iframe muestra un aviso de la otra parte (ver store/toast.ts) */
function useNoticeGlow(iframe: RefObject<HTMLIFrameElement | null>) {
  const [glowing, setGlowing] = useState(false)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframe.current?.contentWindow) return
      if ((event.data as { type?: string } | null)?.type !== 'domus:notice') return
      setGlowing(true)
      clearTimeout(timer)
      timer = setTimeout(() => setGlowing(false), GLOW_MS)
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      clearTimeout(timer)
    }
  }, [iframe])
  return glowing
}

/** Escala para que los dos celulares entren completos en el espacio disponible */
function useFitScale() {
  const ref = useRef<HTMLElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const byHeight = (height - LABEL_H) / FRAME_H
      const byWidth = (width - COLUMN_GAP) / (FRAME_W * PHONES.length)
      setScale(Math.max(0.3, Math.min(byHeight, byWidth, MAX_SCALE)))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, scale }
}

/** Elegir qué profesional muestra su celular (uno por categoría, ver useDemoProfessionals) */
function ProPicker({ value, onChange }: { value: string; onChange: (professionalId: string) => void }) {
  const demoPros = useDemoProfessionals()
  return (
    <SelectMenu
      label="Profesional que se muestra"
      value={value}
      options={demoPros.map(({ category, professional }) => ({ value: professional.id, label: `${professional.name} · ${category.name}` }))}
      onChange={onChange}
      // Sobre la etiqueta oscura del celular: sin fondo, texto claro; la lista sí con el estilo de siempre
      triggerClassName="min-h-9 rounded-full bg-transparent px-2 text-lg font-normal text-white/90 hover:text-on-primary focus-visible:outline-2 focus-visible:outline-accent [&_svg]:text-white/70"
    />
  )
}

interface PhoneProps {
  role: Role
  icon: LucideIcon
  scale: number
  reloadKey: number
  /** Solo en el celular del profesional: con cuál entra */
  professionalId?: string
  onProfessionalChange?: (professionalId: string) => void
}

function Phone({ role, icon: Icon, scale, reloadKey, professionalId, onProfessionalChange }: PhoneProps) {
  const user = useDemoStore((s) => s.users.find((u) => u.id === DEMO_USER_IDS[role]))
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const glowing = useNoticeGlow(iframeRef)
  return (
    <div className="flex flex-col items-center">
      <p className="mb-3 inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-lg font-semibold text-on-primary">
        <Icon className="size-5 text-accent" aria-hidden="true" />
        {ROLE_LABELS[role]}
        {professionalId && onProfessionalChange ? (
          <ProPicker value={professionalId} onChange={onProfessionalChange} />
        ) : (
          user && <span className="font-normal text-white/70">· {user.name}</span>
        )}
      </p>
      {/* El contenedor ocupa el tamaño ya escalado; adentro el celular mantiene su tamaño lógico */}
      <div style={{ width: FRAME_W * scale, height: FRAME_H * scale }}>
        <div
          className={cn(
            'origin-top-left rounded-[3rem] bg-[#050f1f] shadow-2xl transition-shadow duration-300',
            glowing ? 'shadow-[0_0_0_6px_var(--color-accent),0_0_80px_20px_var(--color-accent)]' : 'ring-1 ring-white/15',
          )}
          style={{ width: FRAME_W, height: FRAME_H, padding: BEZEL, transform: `scale(${scale})` }}
        >
          <div className="h-full overflow-hidden rounded-[2.4rem] bg-card">
            <div className="relative flex items-center justify-between px-7 text-xs font-semibold text-foreground" style={{ height: STATUS_H }}>
              <span>9:41</span>
              <span className="absolute top-1.5 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-[#050f1f]" aria-hidden="true" />
              <span className="flex items-center gap-1" aria-hidden="true">
                <Signal className="size-3.5" />
                <Wifi className="size-3.5" />
                <BatteryFull className="size-4" />
              </span>
            </div>
            {/* name: cada celular guarda su propia sesión (ver store/session.ts) */}
            <iframe
              // Cambiar de profesional también recarga el celular: entra con el nuevo
              key={`${reloadKey}-${professionalId ?? ''}`}
              ref={iframeRef}
              name={role}
              src={`/ingresar?como=${role}${professionalId ? `&pro=${professionalId}` : ''}`}
              title={`Domus como ${ROLE_LABELS[role].toLowerCase()}`}
              width={SCREEN_W}
              height={SCREEN_H}
              className="block border-0 bg-card"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Vista dividida para la TV: cliente y profesional en dos celulares lado a lado.
 * Comparten los datos de la demo, así el jurado ve en vivo cómo llega cada acción a la otra parte.
 */
export function PresentacionPage() {
  const { ref, scale } = useFitScale()
  const resetDemo = useDemoStore((s) => s.resetDemo)
  const [confirmReset, setConfirmReset] = useState(false)
  // Al reiniciar se recargan los celulares: vuelven a su inicio, con los datos originales
  const [reloadKey, setReloadKey] = useState(0)
  // Carlos (plomería) por defecto; se cambia si el pedido es de otra categoría
  const [professionalId, setProfessionalId] = useState('p-1')

  const reset = () => {
    resetDemo()
    setReloadKey((k) => k + 1)
    setConfirmReset(false)
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-primary">
      <header className="flex h-16 shrink-0 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img src="/domus_isotipo.png" alt="" width={36} height={36} className="size-9 rounded-md" />
          <span className="font-heading text-lg font-bold tracking-[0.2em] text-on-primary">DOMUS</span>
          <span className="sr-only">Domus: vista dividida de la presentación</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-on-primary" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reiniciar demo
          </Button>
          <Link
            to="/ingresar"
            className="inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-on-primary"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Salir
          </Link>
        </div>
      </header>

      <main ref={ref} className="flex min-h-0 flex-1 items-start justify-center px-6 pb-6" style={{ gap: COLUMN_GAP }}>
        {PHONES.map((phone) => (
          <Phone
            key={phone.role}
            {...phone}
            scale={scale}
            reloadKey={reloadKey}
            {...(phone.role === 'profesional' ? { professionalId, onProfessionalChange: setProfessionalId } : {})}
          />
        ))}
      </main>

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="¿Reiniciar la demo?"
        description="Se borran las solicitudes, calificaciones y pagos creados, y los dos celulares vuelven al inicio."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={reset}>
              Sí, reiniciar
            </Button>
          </>
        }
      />
    </div>
  )
}
