import { cn, formatPrice } from '@/lib/utils'

interface MenuCardProps {
  icon: string
  name: string
  description?: string
  price: number
  category: string
  className?: string
}

export function MenuCard({
  icon,
  name,
  description,
  price,
  className,
}: MenuCardProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-4 bg-white border border-neutral-200 rounded-card p-4',
        'hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300',
        className
      )}
    >
      <div className="flex-shrink-0 w-11 h-11 rounded-[10px] bg-neutral-100 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[15px] font-bold text-neutral-900">{name}</h4>
          <span className="text-sm font-bold text-brand shrink-0">
            {formatPrice(price)}
          </span>
        </div>
        {description && (
          <p className="text-sm font-light text-neutral-500 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
