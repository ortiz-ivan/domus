import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { useCurrentUser } from '@/store/selectors'

export function ClienteInicioPage() {
  const user = useCurrentUser()
  return (
    <ScreenPlaceholder
      title={`Hola, ${user?.name.split(' ')[0] ?? ''}`}
      description="¿Qué necesitás arreglar hoy?"
      planned={[
        'Buscador de servicios',
        'Categorías destacadas con acceso directo',
        'Solicitudes activas con su estado',
        'Profesionales mejor calificados',
      ]}
      links={[
        { to: '/cliente/categorias', label: 'Ver categorías' },
        { to: '/cliente/solicitudes', label: 'Mis solicitudes' },
      ]}
    />
  )
}
