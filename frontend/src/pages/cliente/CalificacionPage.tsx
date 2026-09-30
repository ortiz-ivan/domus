import { ImagePlus, Loader2, X } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Avatar } from '@/components/ui/Avatar'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Textarea } from '@/components/ui/Field'
import { RatingInput } from '@/components/ui/RatingInput'
import { cn } from '@/lib/cn'
import { compressImage, MAX_REVIEW_PHOTOS } from '@/lib/images'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { useDirectory } from '@/store/selectors'
import { toast } from '@/store/toast'
import { ClosingSteps } from './ClosingSteps'
import { useClientRequest } from './useClientRequest'

const QUICK_TAGS = ['Puntual', 'Prolijo', 'Buen precio', 'Buena atención', 'Resolvió rápido']

export function CalificacionPage() {
  const request = useClientRequest()
  const hasReview = useDemoStore((s) => s.reviews.some((rv) => rv.requestId === request?.id))
  const addReview = useDemoStore((s) => s.addReview)
  const dir = useDirectory()
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [tags, setTags] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)
  const [photoError, setPhotoError] = useState('')

  if (!request) return <MissingResource what="esa solicitud" backTo="/cliente/solicitudes" backLabel="Mis solicitudes" />
  const base = `/cliente/solicitudes/${request.id}`
  // Se califica después de confirmar, y una sola vez
  if (request.status !== 'confirmada' && request.status !== 'pagada') return <Navigate to={base} replace />
  if (hasReview) return <Navigate to={request.status === 'pagada' ? base : `${base}/pago`} replace />

  const professional = dir.professional(request.professionalId)

  const toggleTag = (tag: string) => setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (rating === 0) {
      setError('Elegí de 1 a 5 estrellas.')
      return
    }
    const text = [tags.join(', '), comment.trim()].filter(Boolean).join('. ')
    addReview(request.id, rating, text, photos)
    toast('¡Gracias por tu calificación!')
    navigate(`${base}/pago`)
  }

  const addPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? [])
    // Vaciar el input permite volver a elegir la misma foto después de quitarla
    event.target.value = ''
    const room = MAX_REVIEW_PHOTOS - photos.length
    if (selected.length === 0 || room <= 0) return
    setPhotoError(selected.length > room ? `Podés subir hasta ${MAX_REVIEW_PHOTOS} fotos: agregamos las primeras ${room}.` : '')
    setProcessing(true)
    try {
      const compressed = await Promise.all(selected.slice(0, room).map(compressImage))
      setPhotos((current) => [...current, ...compressed].slice(0, MAX_REVIEW_PHOTOS))
    } catch {
      setPhotoError('No pudimos leer una de las fotos. Probá con otra imagen (JPG, PNG o WebP).')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <BackLink to={base} label="Volver al seguimiento" />
      <ClosingSteps current={1} />
      <Card>
        <form onSubmit={submit} noValidate className="text-center">
          {professional && <Avatar name={professional.name} size="lg" className="mx-auto" />}
          <h1 className="mt-4 text-2xl font-bold">¿Cómo fue tu experiencia con {professional?.name.split(' ')[0]}?</h1>
          <p className="mt-1 text-muted-foreground">{request.title}</p>

          <div className="mt-6">
            <RatingInput
              value={rating}
              onChange={(v) => {
                setRating(v)
                setError('')
              }}
              error={error}
            />
          </div>

          <fieldset className="mt-6">
            <legend className="mb-3 text-sm font-semibold">¿Qué destacarías? (opcional)</legend>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_TAGS.map((tag) => {
                const selected = tags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'min-h-10 rounded-full border px-4 text-sm font-medium transition-colors duration-150',
                      selected ? 'border-primary bg-primary text-on-primary' : 'border-border hover:bg-muted',
                    )}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-6 text-left">
            <Field label="Comentario (opcional)" hint="Tu reseña es pública y ayuda a otros clientes.">
              {(props) => <Textarea {...props} value={comment} onChange={(e) => setComment(e.target.value)} maxLength={300} />}
            </Field>
          </div>

          <fieldset className="mt-6 text-left">
            <legend className="text-sm font-medium">Fotos del trabajo (opcional)</legend>
            <p className="text-sm text-muted-foreground">Hasta {MAX_REVIEW_PHOTOS}. Se ven en el perfil del profesional y ayudan a otros clientes.</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {photos.map((src, i) => (
                <li key={i} className="relative">
                  <img src={src} alt={`Foto ${i + 1} que vas a subir`} className="size-20 rounded-lg border border-border object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((current) => current.filter((_, j) => j !== i))}
                    className="absolute -top-2 -right-2 inline-flex size-7 items-center justify-center rounded-full bg-primary text-on-primary shadow hover:bg-primary-hover"
                    aria-label={`Quitar foto ${i + 1}`}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
              {photos.length < MAX_REVIEW_PHOTOS && (
                <li>
                  <label
                    className={cn(
                      'flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted has-focus-visible:outline-2 has-focus-visible:outline-ring',
                      processing && 'cursor-wait',
                    )}
                  >
                    {processing ? <Loader2 className="size-6 animate-spin" aria-hidden="true" /> : <ImagePlus className="size-6" aria-hidden="true" />}
                    {processing ? 'Procesando…' : 'Agregar'}
                    <span className="sr-only"> fotos del trabajo</span>
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={addPhotos} disabled={processing} />
                  </label>
                </li>
              )}
            </ul>
            {photoError && (
              <p className="mt-2 text-sm font-medium text-destructive" role="alert">
                {photoError}
              </p>
            )}
          </fieldset>

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={processing}>
            Enviar calificación
          </Button>
        </form>
      </Card>
    </div>
  )
}
