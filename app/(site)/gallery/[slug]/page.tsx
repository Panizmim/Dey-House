'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft } from '@/components/ui/icons'
import { toJalali, PERSIAN_MONTHS, toPersian } from '@/lib/jalali'
import { Lightbox } from '@/components/ui/Lightbox'

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

function formatJalali(dateStr: string, withYear = true) {
  try {
    const j = toJalali(new Date(dateStr))
    return withYear
      ? `${toPersian(j.jd)} ${PERSIAN_MONTHS[j.jm - 1]} ${toPersian(j.jy)}`
      : `${toPersian(j.jd)} ${PERSIAN_MONTHS[j.jm - 1]}`
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
      <div className="w-8 h-8 rounded-full border-2 border-[#801A00] border-t-transparent animate-spin" />
    </div>
  )

  if (notFound || !gallery) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-[#A0A0A0]" style={{ fontSize: 15 }}>نمایشگاه پیدا نشد</p>
      <Link href="/gallery" className="text-[#801A00] hover:underline" style={{ fontSize: 14 }}>
        بازگشت به گالری
      </Link>
    </div>
  )

  const artworks:    string[] = JSON.parse(gallery.images || '[]')
  const venueImages: string[] = JSON.parse(gallery.venueImages || '[]')

  return (
    <main className="max-w-[900px] mx-auto px-8 md:px-4 py-16" dir="rtl">


      {/* ─── header + cover ─── */}
      <div className="flex gap-6 mb-8 items-start">
        {/* کاور — سمت راست در RTL (اول در DOM) */}
        {gallery.coverImage && (
          <div className="relative flex-shrink-0 w-[190px] h-[190px] md:w-[300px] md:h-[300px]">
            <Image
              src={gallery.coverImage}
              alt={gallery.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* متن — سمت چپ در RTL (دوم در DOM) */}
        <div className="flex-1 text-right pt-1">
          <h1 className="font-black text-[#171717] mb-2"
            style={{ fontSize: 'clamp(20px, 3.5vw, 30px)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            {gallery.title}
          </h1>
          <p className="font-light mb-3" style={{ fontSize: 15, color: '#555555' }}>{gallery.artistName}</p>
          <p className="font-light" style={{ fontSize: 15, color: '#555555' }}>
            {formatJalali(gallery.startDate, false)} — {formatJalali(gallery.endDate)}
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-[#EFEFEF] my-8" />

      {/* ─── گزاره ─── */}
      {gallery.description && (
        <div className="mb-12">
          <h2 className="font-black text-[#171717] mb-5" style={{ fontSize: 20 }}>گزاره</h2>
          <div>
            {gallery.description.split('\n').map((line, i) => (
              <p key={i} dir="auto" className="font-light text-[#1a1a1a]" style={{ fontSize: 15, lineHeight: 2.2, textAlign: 'justify', minHeight: '1em' }}>
                {line || ' '}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ─── گزیده آثار ─── */}
      {artworks.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-[#171717]" style={{ fontSize: 20 }}>گزیده آثار</h2>
            <span className="text-[#A0A0A0]" style={{ fontSize: 13 }}>{toPersian(artworks.length)} اثر</span>
          </div>

          <div className="grid gap-1 grid-cols-3 sm:grid-cols-5">
            {artworks.map((img, i) => (
              <div
                key={i}
                className="relative cursor-pointer overflow-hidden"
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

          {/* full-bleed: از max-w-[900px] بیرون میاد و کل viewport رو می‌گیره */}
          <div style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw', overflow: 'hidden' }}>
            <div className="flex items-center" style={{ padding: '0 20px', gap: 12 }}>
              {/* ChevronRight سمت راست = بعدی در RTL */}
              {venueImages.length > 1 && (
                <button
                  onClick={() => setVenueSlide((s) => s < venueImages.length - 1 ? s + 1 : 0)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0, color: '#404040', display: 'flex', alignItems: 'center' }}
                >
                  <ChevronLeft size={24} style={{ transform: 'rotate(180deg)' }} />
                </button>
              )}

              {/* تصویر — نسبت ۱۴۶۹×۳۶۹ */}
              <div className="flex-1 overflow-hidden">
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
              </div>

              {/* ChevronLeft سمت چپ = قبلی در RTL */}
              {venueImages.length > 1 && (
                <button
                  onClick={() => setVenueSlide((s) => s > 0 ? s - 1 : venueImages.length - 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0, color: '#404040', display: 'flex', alignItems: 'center' }}
                >
                  <ChevronLeft size={24} />
                </button>
              )}
            </div>
          </div>

          {/* dots */}
          {venueImages.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {venueImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setVenueSlide(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === venueSlide ? 20 : 6,
                    height: 6,
                    background: i === venueSlide ? '#404040' : '#D0D0D0',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Lightbox
        images={artworks}
        index={lightboxIndex}
        onChange={setLightboxIndex}
        alt={gallery.title}
      />
    </main>
  )
}
