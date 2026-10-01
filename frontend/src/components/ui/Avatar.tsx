import { cn } from '@/lib/cn'
import { initials } from '@/lib/format'

const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-16 text-xl' }

interface AvatarProps {
  name: string
  /** Foto de perfil; si falta se muestran las iniciales */
  src?: string
  size?: keyof typeof sizes
  className?: string
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-heading font-semibold text-on-primary',
        sizes[size],
        className,
      )}
    >
      {src ? <img src={src} alt="" loading="lazy" decoding="async" className="size-full object-cover" /> : initials(name)}
    </span>
  )
}
