import { ScreenPlaceholder } from '@/components/ScreenPlaceholder'
import { useCurrentProfessional } from '@/store/selectors'

export function PerfilPage() {
  const professional = useCurrentProfessional()
  return (
    <ScreenPlaceholder
      title="Perfil profesional"
      description={professional?.bio ?? ''}
      planned={[
        'Datos personales y de contacto',
        'Categorías que ofrece, experiencia y precio referencial (editables)',
        'Estado de verificación',
        'Reseñas recibidas',
      ]}
    />
  )
}
