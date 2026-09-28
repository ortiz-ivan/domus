import { BadgeCheck, Clock, Star } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input, Select, Textarea } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { RatingStars } from '@/components/ui/RatingStars'
import { CITIES } from '@/data/seed'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import { useDemoStore } from '@/store/demo'
import { ratingOf, useCurrentProfessional, useCurrentUser, useDirectory } from '@/store/selectors'
import { toast } from '@/store/toast'
import type { Professional } from '@/types'

type Errors = Partial<Record<'bio' | 'basePrice' | 'yearsExperience' | 'categoryIds', string>>

function ProfileForm({ professional }: { professional: Professional }) {
  const categories = useDemoStore((s) => s.categories)
  const updateProfessional = useDemoStore((s) => s.updateProfessional)
  const [bio, setBio] = useState(professional.bio)
  const [basePrice, setBasePrice] = useState(String(professional.basePrice))
  const [years, setYears] = useState(String(professional.yearsExperience))
  const [city, setCity] = useState(professional.city)
  const [categoryIds, setCategoryIds] = useState(professional.categoryIds)
  const [errors, setErrors] = useState<Errors>({})

  const toggleCategory = (id: string) =>
    setCategoryIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

  const save = (event: FormEvent) => {
    event.preventDefault()
    const e: Errors = {}
    const price = Number(basePrice)
    const exp = Number(years)
    if (bio.trim().length < 20) e.bio = 'Contá un poco más sobre vos (al menos 20 caracteres).'
    if (!Number.isFinite(price) || price < 10000) e.basePrice = 'Ingresá un precio desde Gs. 10.000.'
    if (!Number.isInteger(exp) || exp < 0 || exp > 60) e.yearsExperience = 'Ingresá los años como número entero.'
    if (categoryIds.length === 0) e.categoryIds = 'Elegí al menos una categoría.'
    setErrors(e)
    if (Object.keys(e).length > 0) return
    updateProfessional(professional.id, { bio: bio.trim(), basePrice: price, yearsExperience: exp, city, categoryIds })
    toast('Perfil actualizado')
  }

  return (
    <form onSubmit={save} noValidate className="space-y-5">
      <Field label="Sobre vos" required error={errors.bio} hint="Lo ven los clientes en tu perfil.">
        {(props) => <Textarea {...props} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} />}
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Precio por visita (Gs.)" required error={errors.basePrice}>
          {(props) => <Input {...props} type="number" inputMode="numeric" min={10000} step={5000} value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />}
        </Field>
        <Field label="Años de experiencia" required error={errors.yearsExperience}>
          {(props) => <Input {...props} type="number" inputMode="numeric" min={0} value={years} onChange={(e) => setYears(e.target.value)} />}
        </Field>
        <Field label="Zona de trabajo">
          {(props) => (
            <Select {...props} value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <fieldset aria-describedby={errors.categoryIds ? 'err-cats' : undefined}>
        <legend className="mb-2 text-sm font-medium">Servicios que ofrecés</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const selected = categoryIds.includes(c.id)
            return (
              <label
                key={c.id}
                className={cn(
                  'inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium has-focus-visible:outline-2 has-focus-visible:outline-ring',
                  selected ? 'border-primary bg-primary text-on-primary' : 'border-border hover:bg-muted',
                )}
              >
                <input type="checkbox" className="sr-only" checked={selected} onChange={() => toggleCategory(c.id)} />
                {c.name}
              </label>
            )
          })}
        </div>
        {errors.categoryIds && (
          <p id="err-cats" className="mt-2 text-sm font-medium text-destructive" role="alert">
            {errors.categoryIds}
          </p>
        )}
      </fieldset>
      <Button type="submit" size="lg">
        Guardar cambios
      </Button>
    </form>
  )
}

export function PerfilPage() {
  const professional = useCurrentProfessional()
  const user = useCurrentUser()
  const reviews = useDemoStore((s) => s.reviews)
  const dir = useDirectory()

  if (!professional || !user) return null

  const rating = ratingOf(reviews, professional)
  const own = reviews.filter((r) => r.professionalId === professional.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <>
      <PageHeader title="Perfil profesional" description="Así te ven los clientes en Domus." />
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr] lg:items-start">
        <div className="space-y-6">
          <Card className="text-center">
            <Avatar name={professional.name} size="lg" className="mx-auto size-20 text-2xl" />
            <p className="mt-3 font-heading text-xl font-bold">{professional.name}</p>
            <RatingStars value={rating.average} count={rating.count} className="mt-1 justify-center" />
            <div className="mt-3 flex justify-center">
              {professional.verified ? (
                <Badge tone="accepted">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  Verificado
                </Badge>
              ) : (
                <Badge tone="pending">
                  <Clock className="size-3.5" aria-hidden="true" />
                  Verificación en revisión
                </Badge>
              )}
            </div>
            <dl className="mt-5 space-y-2 border-t border-border pt-5 text-left text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="[overflow-wrap:anywhere]">{user.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Teléfono</dt>
                <dd>{user.phone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">En Domus desde</dt>
                <dd>{formatDate(user.createdAt)}</dd>
              </div>
            </dl>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-5 text-lg font-semibold">Datos del servicio</h2>
            {/* key: reinicia el formulario si cambian los datos (p. ej. al reiniciar la demo) */}
            <ProfileForm key={professional.id} professional={professional} />
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Reseñas recibidas</h2>
            <p className="text-sm text-muted-foreground">{rating.count} reseñas en total, {own.length} escritas en Domus.</p>
            <ul className="mt-4 divide-y divide-border">
              {own.slice(0, 5).map((r) => (
                <li key={r.id} className="py-3 first:pt-0">
                  <p className="flex items-center gap-1 text-sm font-semibold">
                    <Star className="size-4 fill-accent text-accent" aria-hidden="true" />
                    {r.rating} · {dir.user(r.clientId)?.name}
                    <span className="ml-auto font-normal text-muted-foreground">{formatDate(r.createdAt)}</span>
                  </p>
                  {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
