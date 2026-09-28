import { Wrench, type LucideProps } from 'lucide-react'
import { CATEGORY_ICONS } from '@/lib/icons'

/** Ícono de una categoría por su nombre (Category.icon). Decorativo por defecto. */
export function CategoryIcon({ name, ...props }: LucideProps & { name: string }) {
  const Icon = CATEGORY_ICONS[name] ?? Wrench
  return <Icon aria-hidden="true" {...props} />
}
