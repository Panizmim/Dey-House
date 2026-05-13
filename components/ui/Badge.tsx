import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'brand' | 'gray' | 'green'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  brand: 'bg-brand-light text-brand border border-brand-border',
  gray:  'bg-neutral-100 text-neutral-700 border border-neutral-200',
  green: 'bg-green-50 text-green-700 border border-green-200',
}

const sizes = {
  sm: 'text-xs px-3 py-0.5',
  md: 'text-sm px-3 py-1',
}

export function Badge({
  children,
  variant = 'brand',
  size = 'sm',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-chip font-bold',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
