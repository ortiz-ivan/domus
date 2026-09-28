import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { STATUS_META } from '@/lib/status'
import type { RequestStatus } from '@/types'
import { useProRequests } from './useProRequests'

const WORKING: RequestStatus[] = ['aceptada', 'en_proceso', 'terminada']

export function TrabajosPage() {
  const jobs = useProRequests().filter((r) => WORKING.includes(r.status))
  return (
    <ScreenPlaceholder
      title="Trabajos en proceso"
      description="Trabajos aceptados y en curso."
      planned={['Lista agrupada por estado', 'Fecha, cliente y dirección de cada trabajo', 'Acceso al detalle para actualizar el estado']}
      links={jobs.map((r) => ({ to: `/profesional/trabajos/${r.id}`, label: `${r.title} · ${STATUS_META[r.status].label}` }))}
    />
  )
}
