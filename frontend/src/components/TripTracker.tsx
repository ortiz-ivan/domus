import { MapPin, Navigation } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { TripMap } from '@/components/TripMap'
import { formatKm } from '@/lib/geo'
import { locateAddress, minutesLeft, routeTo, tripProgress } from '@/lib/places'
import { useDemoStore } from '@/store/demo'
import type { Professional, ServiceRequest, Trip } from '@/types'

const clock = new Intl.DateTimeFormat('es-PY', { hour: '2-digit', minute: '2-digit' })

/** Avance del viaje, actualizado dos veces por segundo para los minutos y la barra */
function useTripProgress(trip: Trip) {
  const [progress, setProgress] = useState(() => tripProgress(trip))
  useEffect(() => {
    const update = () => setProgress(tripProgress(trip))
    update()
    if (trip.arrivedAt) return
    const timer = setInterval(update, 500)
    return () => clearInterval(timer)
  }, [trip])
  return progress
}

interface TripTrackerProps {
  request: ServiceRequest
  /** El viaje de la solicitud (aparte, ya verificado que existe) */
  trip: Trip
  professional: Professional
  /** Quién mira: cambia el texto ("Carlos llega en" / "Llegás en") */
  viewer: 'cliente' | 'profesional'
  clientName?: string
}

/**
 * Seguimiento del viaje como en las apps de transporte: minutos que faltan, distancia y el mapa
 * con el profesional acercándose. Al terminar el tiempo marca la llegada (si nadie la marcó antes).
 */
export function TripTracker({ request, trip, professional, viewer, clientName }: TripTrackerProps) {
  const arrive = useDemoStore((s) => s.arrive)
  const progress = useTripProgress(trip)
  const arrived = progress >= 1
  const minutes = minutesLeft(trip, progress)
  const firstName = professional.name.split(' ')[0]
  // Por id y ciudad, no por el objeto: al sincronizar entre pestañas llega uno nuevo y no hay que rearmar el mapa
  const { id: proId, city: proCity } = professional
  const route = useMemo(() => routeTo({ id: proId, city: proCity }, locateAddress(request.address, request.city)), [proId, proCity, request.address, request.city])

  useEffect(() => {
    if (arrived && !trip.arrivedAt) arrive(request.id)
  }, [arrived, trip.arrivedAt, arrive, request.id])

  const title = arrived
    ? viewer === 'cliente'
      ? `${firstName} llegó a tu domicilio`
      : 'Llegaste al domicilio'
    : viewer === 'cliente'
      ? `${firstName} está en camino`
      : `Vas hacia lo de ${clientName ?? 'tu cliente'}`

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-start justify-between gap-4 p-4" aria-live="polite">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-accent-text">
            {arrived ? <MapPin className="size-4" aria-hidden="true" /> : <Navigation className="size-4" aria-hidden="true" />}
            {arrived ? 'Llegada' : 'En camino'}
          </p>
          <h2 className="mt-1 text-lg leading-snug font-semibold">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {arrived
              ? viewer === 'cliente'
                ? 'Dale tu código de inicio para que empiece el trabajo.'
                : 'Pedile al cliente su código de inicio.'
              : `${formatKm(trip.distanceKm)} · llegada aprox. ${clock.format(new Date(trip.startedAt).getTime() + trip.etaMinutes * 60000)}`}
          </p>
        </div>
        {!arrived && (
          <p className="shrink-0 text-right">
            <span className="block font-heading text-4xl leading-none font-bold tabular-nums">{minutes}</span>
            <span className="text-sm text-muted-foreground">min</span>
          </p>
        )}
      </div>
      <div className="h-1 bg-muted" aria-hidden="true">
        <div className="h-full bg-accent transition-[width] duration-500 ease-linear" style={{ width: `${progress * 100}%` }} />
      </div>
      <TripMap route={route} trip={trip} photo={professional.photo} name={professional.name} className="h-64 sm:h-72" />
    </div>
  )
}
