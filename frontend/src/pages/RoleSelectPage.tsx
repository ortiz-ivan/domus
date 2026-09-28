import { ArrowLeft, ArrowRight, HardHat, RotateCcw, ShieldCheck, UserRound, type LucideIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ROLE_HOME, ROLE_LABELS } from '@/app/navigation'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { DEMO_USER_IDS } from '@/data/seed'
import { cn } from '@/lib/cn'
import { useDemoStore } from '@/store/demo'
import { useSessionStore } from '@/store/session'
import type { Role } from '@/types'

const ROLE_CARDS: { role: Role; icon: LucideIcon; description: string }[] = [
  { role: 'cliente', icon: UserRound, description: 'Buscá profesionales, pedí un servicio y seguí su avance.' },
  { role: 'profesional', icon: HardHat, description: 'Recibí solicitudes, gestioná trabajos y consultá tus ganancias.' },
  { role: 'admin', icon: ShieldCheck, description: 'Supervisá usuarios, solicitudes y finanzas de la plataforma.' },
]

const isRole = (value: string | null): value is Role => value === 'cliente' || value === 'profesional' || value === 'admin'

/** Ingreso simulado: se elige con qué rol entrar a la demo */
export function RoleSelectPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const login = useSessionStore((s) => s.login)
  const users = useDemoStore((s) => s.users)
  const resetDemo = useDemoStore((s) => s.resetDemo)

  const suggested = isRole(params.get('rol')) ? (params.get('rol') as Role) : null
  const next = params.get('next')
  const auto = params.get('como')

  const enter = (role: Role) => {
    login(DEMO_USER_IDS[role])
    // Solo se respeta "next" si pertenece a la sección del rol elegido
    navigate(next?.startsWith(ROLE_HOME[role]) ? next : ROLE_HOME[role])
  }

  // /ingresar?como=profesional entra directo: lo usan los controles del presentador al abrir otra pestaña
  useEffect(() => {
    if (!isRole(auto)) return
    login(DEMO_USER_IDS[auto])
    navigate(ROLE_HOME[auto], { replace: true })
  }, [auto, login, navigate])

  const reset = () => {
    if (window.confirm('¿Reiniciar la demo? Se pierden las solicitudes, calificaciones y pagos creados.')) resetDemo()
  }

  if (isRole(auto)) return null

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="rounded-lg" aria-label="Domus, volver al inicio">
            <Logo />
          </Link>
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <h1 className="text-center text-2xl font-bold text-balance sm:text-3xl">¿Con qué rol querés ingresar?</h1>
        <p className="mt-2 max-w-md text-center text-muted-foreground">
          Demo interactiva. Tip: abrí cada rol en una pestaña distinta para ver cómo se conectan en tiempo real.
        </p>

        <ul className="mt-8 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {ROLE_CARDS.map(({ role, icon: Icon, description }) => {
            const user = users.find((u) => u.id === DEMO_USER_IDS[role])
            const highlighted = role === suggested
            return (
              <li key={role}>
                <button
                  type="button"
                  onClick={() => enter(role)}
                  className={cn(
                    'group flex h-full w-full flex-col items-start rounded-xl border bg-card p-6 text-left transition-colors duration-150 hover:border-accent',
                    highlighted ? 'border-primary ring-2 ring-primary/15' : 'border-border',
                  )}
                >
                  <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-accent-soft">
                    <Icon className="size-6 text-accent-text" aria-hidden="true" />
                  </span>
                  <span className="font-heading text-lg font-semibold">{ROLE_LABELS[role]}</span>
                  <span className="mt-1 flex-1 text-sm text-muted-foreground">{description}</span>
                  {user && <span className="mt-4 text-xs text-muted-foreground">Entrás como {user.name}</span>}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Ingresar
                    <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <Button variant="ghost" size="sm" className="mt-8 text-muted-foreground" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reiniciar datos de la demo
        </Button>
      </main>
    </div>
  )
}
