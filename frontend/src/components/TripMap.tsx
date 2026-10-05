import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { routeUntil } from '@/lib/geo'
import { tripProgress } from '@/lib/places'
import type { LatLng, Trip } from '@/types'

// Mapa base de OpenStreetMap: gratis y sin clave para uso liviano, citando la fuente.
// (CARTO pasó a pedir clave: en lugar del mapa devolvía una imagen "API key required".)
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// Respaldo si OpenStreetMap no responde: el mapa de calles de Esri, también sin clave
const FALLBACK_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
const FALLBACK_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap'
/** Imágenes del mapa que pueden fallar antes de pasar al respaldo */
const MAX_TILE_ERRORS = 3

// Colores de la marca (los mismos tokens de index.css; Leaflet dibuja en SVG y necesita valores)
const css = (name: string, fallback: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback

const escape = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

interface TripMapProps {
  route: LatLng[]
  trip: Trip
  /** Foto y nombre del profesional para su marcador */
  photo?: string
  name: string
  className?: string
}

/**
 * Mapa del viaje: la ruta, lo ya recorrido y el profesional acercándose al domicilio.
 * El marcador se mueve cuadro a cuadro según el tiempo transcurrido del viaje simulado.
 */
export function TripMap({ route, trip, photo, name, className }: TripMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // El viaje cambia (p. ej. al avisar que llegó) sin rearmar el mapa: el bucle de animación lee la última versión
  const tripRef = useRef(trip)
  useEffect(() => {
    tripRef.current = trip
  }, [trip])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const primary = css('--color-primary', '#0b1f3a')
    const accent = css('--color-accent', '#c9a227')

    const map = L.map(container, { zoomControl: false, scrollWheelZoom: false, attributionControl: true })
    const tiles = L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map)
    let tileErrors = 0
    tiles.on('tileerror', () => {
      if (++tileErrors !== MAX_TILE_ERRORS) return
      tiles.remove()
      L.tileLayer(FALLBACK_TILES, { attribution: FALLBACK_ATTRIBUTION, maxZoom: 19 }).addTo(map)
    })
    map.fitBounds(L.latLngBounds(route), { padding: [36, 36] })

    L.polyline(route, { color: primary, opacity: 0.25, weight: 6, lineCap: 'round', lineJoin: 'round' }).addTo(map)
    const traveled = L.polyline([], { color: primary, weight: 6, lineCap: 'round', lineJoin: 'round' }).addTo(map)

    const home = L.divIcon({
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      html: `<span style="display:flex;width:36px;height:36px;align-items:center;justify-content:center;border-radius:9999px;background:${primary};border:3px solid #fff;box-shadow:0 2px 8px rgb(0 0 0 / .3)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg></span>`,
    })
    L.marker(route[route.length - 1], { icon: home, keyboard: false, title: 'Domicilio' }).addTo(map)

    const initials = escape(name.split(' ').map((w) => w[0]).slice(0, 2).join(''))
    const face = photo
      ? `<img src="${escape(photo)}" alt="" style="width:100%;height:100%;object-fit:cover" />`
      : `<span style="font-weight:700;color:${primary}">${initials}</span>`
    const pro = L.divIcon({
      className: '',
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      html: `<span style="display:flex;width:48px;height:48px;align-items:center;justify-content:center;overflow:hidden;border-radius:9999px;background:#fff;border:4px solid ${accent};box-shadow:0 4px 14px rgb(0 0 0 / .35)">${face}</span>`,
    })
    const proMarker = L.marker(route[0], { icon: pro, keyboard: false, title: name, zIndexOffset: 1000 }).addTo(map)

    let frame = 0
    const tick = () => {
      const progress = tripProgress(tripRef.current)
      const done = routeUntil(route, progress)
      traveled.setLatLngs(done)
      proMarker.setLatLng(done[done.length - 1])
      // Al llegar, el marcador queda en el domicilio y la animación se detiene
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(frame)
      map.remove()
    }
  }, [route, photo, name])

  // isolate: los paneles de Leaflet usan z-index altos; así no tapan la barra superior ni los diálogos
  return <div ref={containerRef} role="img" aria-label={`Mapa con el recorrido de ${name} hasta el domicilio`} className={cn('isolate bg-muted', className)} />
}
