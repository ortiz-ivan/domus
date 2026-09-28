import { ArrowLeft, Pencil } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Avatar } from '@/components/ui/Avatar'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { CITIES } from '@/data/seed'
import { cn } from '@/lib/cn'
import { formatDate, formatGs, TIME_SLOT_LABELS } from '@/lib/format'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { useCurrentUser, useDirectory } from '@/store/selectors'
import { toast } from '@/store/toast'
import type { TimeSlot } from '@/types'

const OTHER = '__otro__'
type When = 'urgente' | 'semana' | 'fecha'

interface FormState {
  service: string
  categoryId: string
  customTitle: string
  description: string
  when: When | ''
  date: string
  timeSlot: TimeSlot | ''
  address: string
  city: string
}

type Errors = Partial<Record<keyof FormState, string>>

const STEPS = ['¿Qué necesitás?', 'Contanos más', '¿Para cuándo lo necesitás?', '¿Dónde es el trabajo?', 'Revisá tu solicitud']

const isoIn = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10)

const WHEN_OPTIONS: { value: When; title: string; hint: string }[] = [
  { value: 'urgente', title: 'Lo necesito ya', hint: 'Dentro de las próximas 48 horas' },
  { value: 'semana', title: 'Esta semana', hint: 'No es urgente' },
  { value: 'fecha', title: 'Elegir una fecha', hint: 'Tengo un día en mente' },
]

/** Opción grande tipo tarjeta sobre un radio nativo */
function OptionCard({ name, checked, onChange, title, hint }: { name: string; checked: boolean; onChange: () => void; title: string; hint?: string }) {
  return (
    <label
      className={cn(
        'flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-ring',
        checked ? 'border-primary bg-accent-soft' : 'border-border bg-card hover:bg-muted',
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="size-5 shrink-0 cursor-pointer accent-primary" />
      <span>
        <span className="block font-semibold">{title}</span>
        {hint && <span className="block text-sm text-muted-foreground">{hint}</span>}
      </span>
    </label>
  )
}

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null
  return (
    <p id={id} className="mt-2 text-sm font-medium text-destructive" role="alert">
      {children}
    </p>
  )
}

export function NuevaSolicitudPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const user = useCurrentUser()
  const dir = useDirectory()
  const professional = useDemoStore((s) => s.professionals.find((p) => p.id === params.get('profesional')))
  const createRequest = useDemoStore((s) => s.createRequest)

  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [form, setForm] = useState<FormState>({
    service: '',
    categoryId: professional?.categoryIds[0] ?? '',
    customTitle: '',
    description: '',
    when: '',
    date: '',
    timeSlot: '',
    address: '',
    city: user?.city ?? CITIES[0],
  })
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  // Al cambiar de paso, el foco va al título de la nueva pregunta
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [step])

  if (!professional || !user) {
    return <MissingResource what="el profesional elegido" backTo="/cliente/categorias" backLabel="Elegir profesional" />
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const title = form.service === OTHER ? form.customTitle.trim() : form.service
  const date = form.when === 'urgente' ? isoIn(1) : form.when === 'semana' ? isoIn(4) : form.date

  const validate = (current: number): Errors => {
    const e: Errors = {}
    if (current === 0 && !form.service) e.service = 'Elegí el tipo de trabajo.'
    if (current === 1) {
      if (form.service === OTHER && form.customTitle.trim().length < 4) e.customTitle = 'Escribí un título corto, por ejemplo "Arreglar persiana".'
      if (form.description.trim().length < 15) e.description = 'Contanos un poco más (al menos 15 caracteres) para que el profesional sepa qué llevar.'
    }
    if (current === 2) {
      if (!form.when) e.when = 'Elegí para cuándo lo necesitás.'
      if (form.when === 'fecha' && !form.date) e.date = 'Elegí la fecha.'
      if (form.when === 'fecha' && form.date && form.date < isoIn(1)) e.date = 'La fecha tiene que ser a partir de mañana.'
      if (!form.timeSlot) e.timeSlot = 'Elegí una franja horaria.'
    }
    if (current === 3 && form.address.trim().length < 5) e.address = 'Ingresá la dirección con calle y número.'
    return e
  }

  const next = (event: FormEvent) => {
    event.preventDefault()
    const e = validate(step)
    if (Object.keys(e).length > 0) {
      setErrors(e)
      // Foco en el primer campo con error
      const target = document.querySelector<HTMLElement>(`[data-field="${Object.keys(e)[0]}"]`)
      ;(target?.querySelector<HTMLElement>('input, select, textarea') ?? target)?.focus()
      return
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      return
    }
    const id = createRequest({
      clientId: user.id,
      professionalId: professional.id,
      categoryId: form.categoryId,
      title,
      description: form.description.trim(),
      address: form.address.trim(),
      city: form.city,
      date,
      timeSlot: form.timeSlot as TimeSlot,
      price: professional.basePrice,
    })
    toast(`Solicitud enviada a ${professional.name}`)
    navigate(`/cliente/solicitudes/${id}`)
  }

  const services = professional.categoryIds.flatMap((categoryId) =>
    (dir.category(categoryId)?.services ?? []).map((service) => ({ service, categoryId })),
  )

  const summary: { label: string; value: ReactNode; step: number }[] = [
    { label: 'Trabajo', value: title, step: 0 },
    { label: 'Detalle', value: form.description, step: 1 },
    { label: 'Fecha', value: date ? `${formatDate(date)} · ${form.timeSlot ? TIME_SLOT_LABELS[form.timeSlot] : ''}` : '', step: 2 },
    { label: 'Dirección', value: `${form.address}, ${form.city}`, step: 3 },
  ]

  return (
    <div className="mx-auto max-w-xl">
      <BackLink to={`/cliente/profesionales/${professional.id}`} label="Volver al profesional" />

      <div className="mb-4 flex items-center gap-3">
        <Avatar name={professional.name} size="sm" />
        <p className="text-sm">
          Solicitud para <span className="font-semibold">{professional.name}</span>
        </p>
      </div>

      {/* Progreso */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Paso {step + 1} de {STEPS.length}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s} className={cn('h-1.5 flex-1 rounded-full transition-colors duration-200', i <= step ? 'bg-primary' : 'bg-border')} />
          ))}
        </div>
      </div>

      <Card>
        <form onSubmit={next} noValidate>
          <h1 ref={headingRef} tabIndex={-1} className="mb-5 text-2xl font-bold outline-none">
            {STEPS[step]}
          </h1>

          {step === 0 && (
            <fieldset aria-describedby={errors.service ? 'err-service' : undefined}>
              <legend className="sr-only">Tipo de trabajo</legend>
              <div className="space-y-3">
                {services.map(({ service, categoryId }, i) => (
                  <div key={service} data-field={i === 0 ? 'service' : undefined}>
                    <OptionCard
                      name="service"
                      title={service}
                      hint={professional.categoryIds.length > 1 ? dir.category(categoryId)?.name : undefined}
                      checked={form.service === service}
                      onChange={() => {
                        update('service', service)
                        update('categoryId', categoryId)
                      }}
                    />
                  </div>
                ))}
                <OptionCard
                  name="service"
                  title="Otro problema"
                  hint="Lo describís en el siguiente paso"
                  checked={form.service === OTHER}
                  onChange={() => update('service', OTHER)}
                />
              </div>
              <ErrorText id="err-service">{errors.service}</ErrorText>
            </fieldset>
          )}

          {step === 1 && (
            <div className="space-y-5">
              {form.service === OTHER && (
                <Field label="Título" required error={errors.customTitle} hint="En pocas palabras, qué hay que hacer.">
                  {(props) => (
                    <Input {...props} data-field="customTitle" value={form.customTitle} onChange={(e) => update('customTitle', e.target.value)} maxLength={60} />
                  )}
                </Field>
              )}
              <Field label="Describí el problema" required error={errors.description} hint="Qué pasa, desde cuándo, y cualquier dato útil (marca, medidas…).">
                {(props) => (
                  <Textarea
                    {...props}
                    data-field="description"
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    placeholder="Ej.: gotea la cañería debajo de la pileta de la cocina desde ayer."
                    maxLength={500}
                  />
                )}
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <fieldset aria-describedby={errors.when ? 'err-when' : undefined}>
                <legend className="sr-only">Cuándo</legend>
                <div className="space-y-3">
                  {WHEN_OPTIONS.map((option, i) => (
                    <div key={option.value} data-field={i === 0 ? 'when' : undefined}>
                      <OptionCard name="when" title={option.title} hint={option.hint} checked={form.when === option.value} onChange={() => update('when', option.value)} />
                    </div>
                  ))}
                </div>
                <ErrorText id="err-when">{errors.when}</ErrorText>
              </fieldset>

              {form.when === 'fecha' && (
                <Field label="Fecha" required error={errors.date}>
                  {(props) => <Input {...props} data-field="date" type="date" min={isoIn(1)} value={form.date} onChange={(e) => update('date', e.target.value)} />}
                </Field>
              )}

              <fieldset aria-describedby={errors.timeSlot ? 'err-slot' : undefined}>
                <legend className="mb-3 font-semibold">Franja horaria</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(Object.keys(TIME_SLOT_LABELS) as TimeSlot[]).map((slot, i) => {
                    const [label, hours] = TIME_SLOT_LABELS[slot].split(' (')
                    return (
                      <div key={slot} data-field={i === 0 ? 'timeSlot' : undefined}>
                        <OptionCard name="slot" title={label} hint={hours.replace(')', '')} checked={form.timeSlot === slot} onChange={() => update('timeSlot', slot)} />
                      </div>
                    )
                  })}
                </div>
                <ErrorText id="err-slot">{errors.timeSlot}</ErrorText>
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <Field label="Dirección" required error={errors.address} hint="Calle, número y alguna referencia.">
                {(props) => (
                  <Input
                    {...props}
                    data-field="address"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder="Ej.: Av. España 1234, casi Brasil"
                  />
                )}
              </Field>
              <Field label="Ciudad" required>
                {(props) => (
                  <Select {...props} value={form.city} onChange={(e) => update('city', e.target.value)}>
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>
          )}

          {step === 4 && (
            <>
              <dl className="divide-y divide-border">
                {summary.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 py-3 first:pt-0">
                    <div className="min-w-0">
                      <dt className="text-sm text-muted-foreground">{item.label}</dt>
                      <dd className="mt-0.5 [overflow-wrap:anywhere]">{item.value}</dd>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(item.step)}
                      className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-primary hover:bg-muted"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Editar<span className="sr-only"> {item.label.toLowerCase()}</span>
                    </button>
                  </div>
                ))}
              </dl>
              <div className="mt-4 rounded-xl bg-accent-soft p-4">
                <p className="text-sm text-muted-foreground">Precio referencial de la visita</p>
                <p className="font-heading text-2xl font-bold tabular-nums">{formatGs(professional.basePrice)}</p>
                <p className="mt-1 text-sm text-muted-foreground">No pagás nada ahora. Se paga cuando confirmás que el trabajo quedó bien.</p>
              </div>
            </>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Atrás
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" size="lg">
              {step === STEPS.length - 1 ? 'Enviar solicitud' : 'Continuar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
