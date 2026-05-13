import { cn } from '@/lib/utils'

interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <span
      className={cn(
        'block animate-spin rounded-full border-2 border-current border-t-transparent',
        sizes[size],
        className
      )}
      aria-label="در حال بارگذاری"
    />
  )
}
