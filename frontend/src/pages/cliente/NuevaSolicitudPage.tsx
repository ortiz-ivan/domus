import { useSearchParams } from 'react-router'
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { MissingResource } from '@/pages/NotFoundPage'
import { useDemoStore } from '@/store/demo'

export function NuevaSolicitudPage() {
  const [params] = useSearchParams()
  const professional = useDemoStore((s) => s.professionals.find((p) => p.id === params.get('profesional')))

  if (!professional) return <MissingResource what="el profesional elegido" backTo="/cliente/categorias" backLabel="Elegir profesional" />

  return (
    <ScreenPlaceholder
      title="Nueva solicitud"
      description={`Contale a ${professional.name} qué necesitás.`}
      planned={[
        'Resumen del profesional elegido',
        'Formulario: problema, descripción, dirección, ciudad, fecha y franja horaria',
        'Validaciones básicas con errores junto a cada campo',
        'Al enviar: se crea en estado "Pendiente" y se redirige al seguimiento',
      ]}
      links={[{ to: `/cliente/profesionales/${professional.id}`, label: 'Volver al profesional' }]}
    />
  )
}
