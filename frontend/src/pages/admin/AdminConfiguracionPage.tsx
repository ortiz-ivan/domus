import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { useDemoStore } from '@/store/demo'

export function AdminConfiguracionPage() {
  const settings = useDemoStore((s) => s.settings)
  return (
    <ScreenPlaceholder
      title="Configuración"
      description={`Comisión actual de la plataforma: ${Math.round(settings.commissionRate * 100)}%`}
      planned={['Comisión de la plataforma', 'Datos de contacto de soporte', 'Categorías de servicio', 'Reiniciar datos de la demo']}
    />
  )
}
