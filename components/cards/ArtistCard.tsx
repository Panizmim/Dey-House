import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ArtistCardProps {
  name: string
  field: string
  status: 'active' | 'alumni'
  imageUrl?: string | null
  className?: string
}

export function ArtistCard({
  name,
  field,
  status,
  imageUrl,
  className,
}: ArtistCardProps) {
  return (
    <article
      className={cn(
        'bg-neutral-50 border border-neutral-200 rounded-card overflow-hidden',
        'hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300',
        className
      )}
    >
      {/* تصویر — بالای کارت */}
      <div className="relative aspect-square bg-neutral-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-brand font-[900] text-4xl">{name.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* اطلاعات */}
      <div className="p-4">
        <h4 className="text-[15px] font-bold text-neutral-900">{name}</h4>
        <p className="text-sm font-light text-neutral-500 mt-1">{field}</p>
        <p className="text-sm text-brand mt-2">
          {status === 'active' ? 'هنرمند فعال' : 'هنرمند سابق'}
        </p>
      </div>
    </article>
  )
}
