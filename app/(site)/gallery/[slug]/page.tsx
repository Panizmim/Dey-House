'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toJalali, PERSIAN_MONTHS, toPersian } from '@/lib/jalali'

type GalleryDetail = {
  id:          string
  slug:        string
  title:       string
  artistName:  string
  description: string | null
  startDate:   string
  endDate:     string
  status:      string
  coverImage:  string | null
  images:      string
  venueImages: string
}

function formatJalali(dateStr: string) {
  try {
    const j = toJalali(new Date(dateStr))
    return `${toPersian(j.jd)} ${PERSIAN_MONTHS[j.jm - 1]} ${toPersian(j.jy)}`
  } catch { return '' }
}

export default function GalleryDetailPage() {
  const params = useParams()
  const [gallery,       setGallery]       = useState<GalleryDetail | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [notFound,      setNotFound]      = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [venueSlide,    setVenueSlide]    = useState(0)

  useEffect(() => {
    fetch(`/api/galleries/${params.slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setNotFound(true)
        else setGallery(data)
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [params.slug])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-[#8B1E1E] border-t-transparent animate-spin" />
    </div>
  )

  if (notFound || !gallery) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-[#A0A0A0]" style={{ fontSize: 15 }}>نمایشگاه پیدا نشد</p>
      <Link href="/gallery" className="text-[#8B1E1E] hover:underline" style={{ fontSize: 14 }}>
        بازگشت به گالری
      </Link>
    </div>
  )

  const artworks:    string[] = JSON.parse(gallery.images || '[]')
  const venueImages: string[] = JSON.parse(gallery.venueImages || '[]')

  return (
    <main className="max-w-[900px] mx-auto px-8 py-16" dir="rtl">

      {/* breadcrumb */}
      <nav className="flex items-center gap-2 text-[#A0A0A0] mb-10" style={{ fontSize: 13 }}>
        <Link href="/" className="hover:text-[#8B1E1E] transition-colors">خانه</Link>
        <span>/</span>
        <Link href="/gallery" className="hover:text-[#8B1E1E] transition-colors">گالری</Link>
        <span>/</span>
        <span className="text-[#171717]">{gallery.title}</span>
      </nav>

      {/* ─── header ─── */}
      <div className="text-right mb-2">
        <p className="text-[#A0A0A0] font-light mb-1" style={{ fontSize: 13 }}>{gallery.artistName}</p>
        <h1 className="font-black text-[#171717] mb-1"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)', letterSpacing: '-0.02em' }}>
          {gallery.title}
        </h1>
        <p className="text-[#A0A0A0] font-light" style={{ fontSize: 14 }}>
          {formatJalali(gallery.startDate)} — {formatJalali(gallery.endDate)}
        </p>
      </div>

      <div className="w-full h-px bg-[#EFEFEF] my-8" />

      {/* ─── گزاره ─── */}
      {gallery.description && (
        <div className="mb-12">
          <h2 className="font-black text-[#171717] mb-5" style={{ fontSize: 20 }}>گزاره</h2>
          <p className="font-light text-[#404040] text-right" style={{ fontSize: 15, lineHeight: 2.0 }}>
            {gallery.description}
          </p>
        </div>
      )}

      {/* ─── گزیده آثار ─── */}
      {artworks.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-[#171717]" style={{ fontSize: 20 }}>گزیده آثار</h2>
            <span className="text-[#A0A0A0]" style={{ fontSize: 13 }}>{toPersian(artworks.length)} اثر</span>
          </div>

          {/* ۶ ستون دسکتاپ، ۳ ستون موبایل */}
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
          >
            <style>{`@media (min-width: 640px) { .artworks-grid { grid-template-columns: repeat(6, 1fr) !important; } }`}</style>
            {artworks.map((img, i) => (
              <div
                key={i}
                className="relative cursor-pointer overflow-hidden artworks-grid"
                style={{ aspectRatio: '1/1' }}
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={img}
                  alt={`اثر ${toPersian(i + 1)}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-[1.05]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── فضای نمایش ─── */}
      {venueImages.length > 0 && (
        <div className="mb-16">
          <h2 className="font-black text-[#171717] mb-6 text-right" style={{ fontSize: 20 }}>فضای نمایش</h2>

          <div className="relative overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(${venueSlide * 100}%)` }}
            >
              {venueImages.map((img, i) => (
                <div key={i} className="flex-shrink-0 w-full relative" style={{ aspectRatio: '16/9' }}>
                  <Image src={img} alt={`فضای نمایش ${toPersian(i + 1)}`} fill className="object-cover" />
                </div>
              ))}
            </div>

            {venueImages.length > 1 && (
              <>
                <button
                  onClick={() => setVenueSlide((s) => s > 0 ? s - 1 : venueImages.length - 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                  style={{ fontSize: 20 }}
                >
                  ›
                </button>
                <button
                  onClick={() => setVenueSlide((s) => s < venueImages.length - 1 ? s + 1 : 0)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
                  style={{ fontSize: 20 }}
                >
                  ‹
                </button>

                {/* dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {venueImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setVenueSlide(i)}
                      className="rounded-full transition-all"
                      style={{
                        width: i === venueSlide ? 20 : 6,
                        height: 6,
                        background: i === venueSlide ? 'white' : 'rgba(255,255,255,0.5)',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* بازگشت */}
      <div className="text-right">
        <Link href="/gallery" className="text-[#8B1E1E] hover:underline font-medium" style={{ fontSize: 14 }}>
          ← بازگشت به گالری
        </Link>
      </div>

      {/* ─── Lightbox ─── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={artworks[lightboxIndex]}
              alt=""
              width={1200}
              height={800}
              className="object-contain max-h-[85vh] w-full"
            />

            {/* شماره */}
            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {toPersian(lightboxIndex + 1)} / {toPersian(artworks.length)}
            </div>

            {/* بستن */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
              style={{ fontSize: 18 }}
            >
              ×
            </button>

            {/* قبلی */}
            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex((i) => i! - 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full text-white hover:bg-white/40 transition-all flex items-center justify-center"
                style={{ fontSize: 22 }}
              >
                ›
              </button>
            )}

            {/* بعدی */}
            {lightboxIndex < artworks.length - 1 && (
              <button
                onClick={() => setLightboxIndex((i) => i! + 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full text-white hover:bg-white/40 transition-all flex items-center justify-center"
                style={{ fontSize: 22 }}
              >
                ‹
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
