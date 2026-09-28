import { cn } from '@/lib/cn'
import { initials } from '@/lib/format'

const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-16 text-xl' }

interface AvatarProps {
  name: string
  size?: keyof typeof sizes
  className?: string
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-heading font-semibold text-on-primary',
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
