'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toJalali, PERSIAN_MONTHS, toPersian } from '@/lib/jalali'

type Gallery = {
  id:          string
  slug:        string
  title:       string
  artistName:  string
  description: string | null
  startDate:   string
  endDate:     string
  status:      string
  coverImage:  string | null
}

function formatJalali(dateStr: string) {
  try {
    const j = toJalali(new Date(dateStr))
    return `${toPersian(j.jd)} ${PERSIAN_MONTHS[j.jm - 1]} ${toPersian(j.jy)}`
  } catch { return '' }
}

const statusLabel: Record<string, string> = {
  ACTIVE:   'در حال برگزاری',
  UPCOMING: 'به زودی',
  PAST:     'برگزار شده',
}

function GalleryCard({ gallery }: { gallery: Gallery }) {
  return (
    <Link href={`/gallery/${gallery.slug}`} className="block group">
      {/* تصویر مربعی */}
      <div className="relative w-full overflow-hidden mb-4" style={{ aspectRatio: '1/1' }}>
        {gallery.coverImage ? (
          <Image
            src={gallery.coverImage}
            alt={gallery.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="w-full h-full transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ background: 'linear-gradient(135deg, #e8ddd0, #c8b89a)' }}
          />
        )}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          background: gallery.status === 'ACTIVE' ? 'rgba(47,158,68,0.85)' : 'rgba(20,20,20,0.55)',
          backdropFilter: 'blur(6px)',
          color: 'white', fontSize: 11, fontWeight: 600,
          padding: '3px 9px', borderRadius: 4,
        }}>
          {statusLabel[gallery.status] ?? gallery.status}
        </span>
      </div>

      <div className="text-center">
        <p className="font-bold text-[#171717] mb-1" style={{ fontSize: 15 }}>{gallery.artistName}</p>
        <p className="font-light text-[#404040] mb-2" style={{ fontSize: 14 }}>{gallery.title}</p>
        <p className="font-light text-[#A0A0A0]" style={{ fontSize: 13 }}>
          {formatJalali(gallery.startDate)}
          {gallery.endDate ? ` — ${formatJalali(gallery.endDate)}` : ''}
        </p>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div>
      <div className="animate-pulse" style={{ paddingTop: '100%', background: '#F3F4F6', position: 'relative' }} />
      <div style={{ paddingTop: 14, textAlign: 'center' }}>
        <div className="animate-pulse mx-auto" style={{ height: 15, background: '#F3F4F6', borderRadius: 4, marginBottom: 8, width: '60%' }} />
        <div className="animate-pulse mx-auto" style={{ height: 13, background: '#F3F4F6', borderRadius: 4, width: '45%' }} />
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    fetch('/api/galleries')
      .then((r) => r.json())
      .then((data) => setGalleries(Array.isArray(data) ? data : []))
      .catch(() => setGalleries([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main>
      {/* ─── Hero ─── */}
      <section className="flex flex-col md:flex-row items-center gap-12 max-w-[1200px] mx-auto px-8 py-20">
        <div className="w-full md:w-1/2 flex-shrink-0 relative" style={{ aspectRatio: '4/3' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a0808 0%, #3d1a1a 100%)' }} />
          <Image
            src="/images/gallery/gallery-hero.jpg"
            alt="گالری خانه دی"
            fill
            className="object-cover"
            priority
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        <div className="flex-1 text-right">
          <p className="font-light text-[#A0A0A0] mb-3" style={{ fontSize: 13, letterSpacing: '0.1em' }}>
            گالری خانه دی
          </p>
          <h1 className="font-black text-[#171717] mb-6"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            فضایی برای<br />دیده شدن هنر
          </h1>
          <p className="font-light text-[#555]" style={{ fontSize: 15, lineHeight: 2.0 }}>
            گالری خانه دی بستری است برای نمایش آثار هنرمندان معاصر ایران.
            در این فضا، نقاشی، عکاسی، مجسمه و چیدمان در کنار هم قرار می‌گیرند
            تا تجربه‌ای تازه از مواجهه با هنر را ممکن سازند.
            هر نمایشگاه، روایتی است از نگاه یک هنرمند به جهان پیرامون.
          </p>
        </div>
      </section>

      <div className="w-full h-px bg-[#EFEFEF]" />

      {/* ─── نمایشگاه‌ها ─── */}
      <section className="max-w-[1200px] mx-auto px-8 py-16">
        <h2 className="font-black text-[#171717] mb-12 text-right"
          style={{ fontSize: 28, letterSpacing: '-0.02em' }}>
          نمایشگاه‌ها
        </h2>

        {loading ? (
          <div className="grid gap-x-8 gap-y-14"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#A0A0A0]" style={{ fontSize: 15 }}>هنوز نمایشگاهی ثبت نشده است</p>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-14"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {galleries.map((g) => <GalleryCard key={g.id} gallery={g} />)}
          </div>
        )}
      </section>
    </main>
  )
}
