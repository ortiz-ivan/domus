import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Avatar } from '@/components/ui/Avatar'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Textarea } from '@/components/ui/Field'
import { RatingInput } from '@/components/ui/RatingInput'
import { cn } from '@/lib/cn'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'
import { useDirectory } from '@/store/selectors'
import { toast } from '@/store/toast'
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
    addReview(request.id, rating, text)
    toast('¡Gracias por tu calificación!')
    navigate(`${base}/pago`)
  }

  return (
    <div className="mx-auto max-w-xl">
      <BackLink to={base} label="Volver al seguimiento" />
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

          <Button type="submit" size="lg" className="mt-6 w-full">
            Enviar calificación
          </Button>
        </form>
      </Card>
    </div>
  )
}
