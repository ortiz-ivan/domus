import { ArrowLeft, ArrowRight, Clock, Columns2, HardHat, RotateCcw, ShieldCheck, UserRound, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { IS_EMBEDDED, isRoleEnabled, PRESENTER_TOOLS } from '@/app/config'
import { ROLE_HOME, ROLE_LABELS } from '@/app/navigation'
import { Logo } from '@/components/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { DEMO_USER_IDS } from '@/data/seed'
import { cn } from '@/lib/cn'
import { useDemoStore } from '@/store/demo'
import { useDemoProfessionals } from '@/store/selectors'
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

  const demoPros = useDemoProfessionals()
  const [pickPro, setPickPro] = useState(false)

  const suggested = isRole(params.get('rol')) ? (params.get('rol') as Role) : null
  const next = params.get('next')
  const auto = params.get('como')

  const enterAs = (role: Role, userId: string) => {
    login(userId)
    // Solo se respeta "next" si pertenece a la sección del rol elegido
    navigate(next?.startsWith(ROLE_HOME[role]) ? next : ROLE_HOME[role])
  }

  const enter = (role: Role) => {
    if (!isRoleEnabled(role)) return
    // Hay un profesional por categoría: primero se elige con cuál entrar
    if (role === 'profesional' && demoPros.length > 1) setPickPro(true)
    else enterAs(role, DEMO_USER_IDS[role])
  }

  // /ingresar?como=profesional entra directo (con Carlos, o con otro: &pro=p-3). Lo usan los controles
  // del presentador al abrir otra pestaña y los celulares de la vista dividida.
  const autoRole = isRole(auto) && isRoleEnabled(auto) ? auto : null
  const autoPro = params.get('pro')
  const autoUserId = (autoRole === 'profesional' && demoPros.find((d) => d.professional.id === autoPro)?.professional.userId) || (autoRole && DEMO_USER_IDS[autoRole])
  useEffect(() => {
    if (!autoRole || !autoUserId) return
    login(autoUserId)
    navigate(ROLE_HOME[autoRole], { replace: true })
  }, [autoRole, autoUserId, login, navigate])

  const reset = () => {
    if (window.confirm('¿Reiniciar la demo? Se pierden las solicitudes, calificaciones y pagos creados.')) resetDemo()
  }

  if (autoRole) return null

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
          {PRESENTER_TOOLS
            ? 'Demo interactiva. Tip: abrí cada rol en una pestaña distinta para ver cómo se conectan en tiempo real.'
            : isRoleEnabled('profesional')
              ? 'Vista previa: podés recorrer Domus como cliente o como profesional. Tip: abrí cada uno en una pestaña distinta y pedí un servicio para ver cómo se conectan.'
              : 'Vista previa: por ahora podés recorrer Domus como cliente.'}
        </p>

        <ul className="mt-8 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {ROLE_CARDS.map(({ role, icon: Icon, description }) => {
            const user = users.find((u) => u.id === DEMO_USER_IDS[role])
            const enabled = isRoleEnabled(role)
            const highlighted = enabled && role === suggested
            return (
              <li key={role}>
                <button
                  type="button"
                  onClick={() => enter(role)}
                  // Rol no publicado en esta vista previa: se muestra, pero no se puede entrar
                  disabled={!enabled}
                  className={cn(
                    'group flex h-full w-full flex-col items-start rounded-xl border bg-card p-6 text-left transition-colors duration-150 hover:border-accent',
                    highlighted ? 'border-primary ring-2 ring-primary/15' : 'border-border',
                    !enabled && 'cursor-not-allowed opacity-60 hover:border-border',
                  )}
                >
                  <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-accent-soft">
                    <Icon className="size-6 text-accent-text" aria-hidden="true" />
                  </span>
                  <span className="font-heading text-lg font-semibold">{ROLE_LABELS[role]}</span>
                  <span className="mt-1 flex-1 text-sm text-muted-foreground">{description}</span>
                  {enabled ? (
                    <>
                      {role === 'profesional' && demoPros.length > 1 ? (
                        <span className="mt-4 text-xs text-muted-foreground">Elegís uno de cada categoría: {demoPros.length} oficios</span>
                      ) : (
                        user && <span className="mt-4 text-xs text-muted-foreground">Entrás como {user.name}</span>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        Ingresar
                        <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </>
                  ) : (
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                      <Clock className="size-3.5" aria-hidden="true" />
                      Próximamente
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        {PRESENTER_TOOLS && !IS_EMBEDDED && (
          <Link
            to="/presentacion"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-primary hover:bg-muted"
          >
            <Columns2 className="size-4" aria-hidden="true" />
            Vista dividida para la TV: cliente y profesional lado a lado
          </Link>
        )}

        <Dialog
          open={pickPro}
          onClose={() => setPickPro(false)}
          title="¿Con qué profesional entrás?"
          description="Uno por categoría: así recibís los pedidos que el cliente haga en ese oficio."
        >
          <ul className="space-y-2">
            {demoPros.map(({ category, professional }) => (
              <li key={professional.id}>
                <button
                  type="button"
                  onClick={() => enterAs('profesional', professional.userId)}
                  className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 text-left transition-colors duration-150 hover:border-accent hover:bg-muted"
                >
                  <Avatar name={professional.name} src={professional.photo} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{professional.name}</span>
                    <span className="block text-sm text-muted-foreground">{category.name}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </Dialog>

        <Button variant="ghost" size="sm" className={cn(PRESENTER_TOOLS ? 'mt-4' : 'mt-8', 'text-muted-foreground')} onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reiniciar datos de la demo
        </Button>
      </main>
    </div>
  )
}
