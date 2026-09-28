import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { useCurrentProfessional } from '@/store/selectors'
import { useProRequests } from './useProRequests'

export function ProfesionalInicioPage() {
  const professional = useCurrentProfessional()
  const pending = useProRequests().filter((r) => r.status === 'pendiente').length

  return (
    <ScreenPlaceholder
      title={`Hola, ${professional?.name.split(' ')[0] ?? ''}`}
      description={`Tenés ${pending} ${pending === 1 ? 'solicitud nueva' : 'solicitudes nuevas'}.`}
      planned={[
        'Resumen: solicitudes nuevas, trabajos en curso y ganancias del mes',
        'Próximo trabajo agendado',
        'Calificación promedio y últimas reseñas',
      ]}
      links={[
        { to: '/profesional/solicitudes', label: 'Solicitudes nuevas' },
        { to: '/profesional/trabajos', label: 'Trabajos en proceso' },
        { to: '/profesional/ganancias', label: 'Ganancias' },
      ]}
    />
  )
}
