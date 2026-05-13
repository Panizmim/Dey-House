import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  light?: boolean
}

const sizeMap = { sm: 32, md: 40, lg: 64 }

export function Logo({ size = 'md', className, light = false }: LogoProps) {
  const px = sizeMap[size]
  const bg = light ? 'rgba(255,255,255,0.1)' : '#8B1E1E'
  const fg = light ? 'rgba(255,255,255,0.88)' : '#C8C0BC'

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('flex-shrink-0', className)}
      aria-label="لوگوی خانه دی"
    >
      <circle cx="32" cy="32" r="32" fill={bg} />

      {/* چهار مستطیل — حروف خانه */}
      <rect x="8"  y="13" width="9" height="22" rx="3" fill={fg} />
      <rect x="20" y="13" width="9" height="22" rx="3" fill={fg} />
      <rect x="32" y="13" width="9" height="22" rx="3" fill={fg} />
      <rect x="44" y="13" width="9" height="22" rx="3" fill={fg} />

      {/* خط افقی پایین — دی */}
      <rect x="8" y="38" width="45" height="4" rx="2" fill={fg} />

      {/* خط عمودی وسط — ی */}
      <rect x="29.5" y="42" width="5" height="10" rx="2.5" fill={fg} />
    </svg>
  )
}
