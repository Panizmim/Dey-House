import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-hover border border-transparent',
  outline: 'bg-transparent text-brand border border-brand hover:bg-brand-light',
  ghost:   'bg-transparent text-neutral-500 border border-transparent hover:text-neutral-900',
}

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-6 py-2.5',
  lg: 'text-body px-8 py-3',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-btn font-bold',
        'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
