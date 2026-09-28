import { RotateCcw } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { CategoryIcon } from '@/components/CategoryIcon'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dialog } from '@/components/ui/Dialog'
import { Field, Input } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { useDemoStore } from '@/store/demo'
import { useSessionStore } from '@/store/session'
import { toast } from '@/store/toast'
import type { PlatformSettings } from '@/types'

function SettingsForm({ settings }: { settings: PlatformSettings }) {
  const updateSettings = useDemoStore((s) => s.updateSettings)
  const [rate, setRate] = useState(String(Math.round(settings.commissionRate * 100)))
  const [email, setEmail] = useState(settings.supportEmail)
  const [errors, setErrors] = useState<{ rate?: string; email?: string }>({})

  const save = (event: FormEvent) => {
    event.preventDefault()
    const value = Number(rate)
    const e: typeof errors = {}
    if (!Number.isFinite(value) || value < 0 || value > 30) e.rate = 'Ingresá un porcentaje entre 0 y 30.'
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Ingresá un email válido, por ejemplo soporte@domus.com.py.'
    setErrors(e)
    if (Object.keys(e).length > 0) return
    updateSettings({ commissionRate: value / 100, supportEmail: email.trim() })
    toast('Configuración guardada')
  }

  return (
    <form onSubmit={save} noValidate className="space-y-5">
      <Field label="Comisión de la plataforma (%)" required error={errors.rate} hint="Se aplica a los pagos nuevos. Los pagos anteriores no cambian.">
        {(props) => <Input {...props} type="number" inputMode="decimal" min={0} max={30} value={rate} onChange={(e) => setRate(e.target.value)} className="sm:w-40" />}
      </Field>
      <Field label="Email de soporte" required error={errors.email}>
        {(props) => <Input {...props} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
      </Field>
      <Button type="submit">Guardar cambios</Button>
    </form>
  )
}

export function AdminConfiguracionPage() {
  const settings = useDemoStore((s) => s.settings)
  const categories = useDemoStore((s) => s.categories)
  const professionals = useDemoStore((s) => s.professionals)
  const resetDemo = useDemoStore((s) => s.resetDemo)
  const logout = useSessionStore((s) => s.logout)
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)

  const reset = () => {
    resetDemo()
    logout()
    navigate('/')
  }

  return (
    <>
      <PageHeader title="Configuración" description="Parámetros generales de la plataforma." />
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card>
          <h2 className="mb-5 text-lg font-semibold">General</h2>
          <SettingsForm key={`${settings.commissionRate}-${settings.supportEmail}`} settings={settings} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Categorías de servicio</h2>
          <p className="mb-4 text-sm text-muted-foreground">Las categorías se definen en los datos de la demo.</p>
          <ul className="divide-y divide-border">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent-soft">
                  <CategoryIcon name={c.icon} className="size-4 text-accent-text" />
                </span>
                <span className="flex-1 font-medium">{c.name}</span>
                <span className="text-sm text-muted-foreground">{professionals.filter((p) => p.categoryIds.includes(c.id)).length} profesionales</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-destructive/40 lg:col-span-2">
          <h2 className="text-lg font-semibold">Reiniciar la demo</h2>
          <p className="mt-1 text-muted-foreground">Vuelve todos los datos al estado inicial: se borran las solicitudes, calificaciones y pagos creados durante la presentación.</p>
          <Button variant="destructive" className="mt-4" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reiniciar datos
          </Button>
        </Card>
      </div>

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="¿Reiniciar todos los datos?"
        description="Esta acción no se puede deshacer. Vas a volver a la portada."
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
    </>
  )
}
