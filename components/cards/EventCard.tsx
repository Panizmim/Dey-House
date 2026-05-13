import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface EventCardProps {
  title: string
  date: string
  time: string
  location: string
  type: string
  imageUrl?: string | null
  slug: string
  className?: string
}

export function EventCard({
  title,
  date,
  time,
  location,
  type,
  imageUrl,
  slug,
  className,
}: EventCardProps) {
  const [day, ...monthParts] = date.split(' ')
  const month = monthParts.join(' ')

  return (
    <Link href={`/events/${slug}`} className="group block">
      <article
        className={cn(
          'bg-neutral-50 border border-neutral-200 rounded-card overflow-hidden',
          'transition-all duration-300 cubic-bezier(0.4,0,0.2,1)',
          'hover:shadow-hover hover:-translate-y-0.5',
          className
        )}
      >
        {/* تصویر */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200" />
          )}

          {/* badge نوع — گوشه بالا راست */}
          <div className="absolute right-2.5 top-2.5">
            <span className="bg-brand text-white text-[11px] font-bold px-2.5 py-[3px] rounded-chip">
              {type}
            </span>
          </div>

          {/* badge تاریخ — گوشه بالا چپ */}
          <div className="absolute left-2.5 top-2.5 bg-white rounded-[10px] px-2.5 py-1.5 text-center min-w-[44px] shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
            <div className="text-brand text-lg font-[900] leading-none">{day}</div>
            <div className="text-neutral-500 text-[10px] leading-tight mt-0.5">{month}</div>
          </div>
        </div>

        {/* بدنه کارت */}
        <div className="p-4">
          <h3 className="text-[15px] font-bold text-neutral-900 mb-2 line-clamp-2 leading-snug">
            {title}
          </h3>

          <div className="flex flex-col gap-1 mb-3.5">
            <div className="flex items-center gap-1.5 text-neutral-500 font-light">
              <span className="text-xs">📍</span>
              <span className="text-sm">{location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-500 font-light">
              <span className="text-xs">🕐</span>
              <span className="text-sm">{time}</span>
            </div>
          </div>

          {/* footer کارت */}
          <div className="border-t border-neutral-200 pt-3 mt-3 flex items-center justify-between">
            <span className="text-sm font-bold text-brand">
              ثبت‌نام ←
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-chip bg-brand-light text-brand border border-brand-border">
              {type}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
