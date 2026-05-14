import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, MapPin, Calendar, Clock } from 'lucide-react'
import { db } from '@/lib/db'
import EventGallery from './EventGallery'
import EventDescriptionExpand from './EventDescriptionExpand'
import EventShareButton from './EventShareButton'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

const typeGradients: Record<string, string> = {
  'نمایشگاه': 'linear-gradient(135deg, #1a3a2a, #2d5a3a)',
  'تئاتر':    'linear-gradient(135deg, #1a0a2a, #2d1a4a)',
  'ادبی':     'linear-gradient(135deg, #0a1a2a, #1a2d4a)',
  'ورکشاپ':   'linear-gradient(135deg, #2a1a0a, #4a2d1a)',
  'موسیقی':   'linear-gradient(135deg, #2a2a0a, #4a4a1a)',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug  = decodeURIComponent(params.slug)
  const event = await db.event.findUnique({ where: { slug } })
  if (!event) return { title: 'رویداد یافت نشد | خانه دی' }
  return {
    title:       `${event.title} | خانه دی`,
    description: (event.description ?? '').replace(/\n/g, ' ').slice(0, 120),
  }
}

export default async function EventDetailPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug)
  const [event, related] = await Promise.all([
    db.event.findUnique({ where: { slug } }),
    db.event.findMany({
      where:   { isArchived: false, NOT: { slug: params.slug } },
      orderBy: { date: 'desc' },
      take:    3,
    }),
  ])

  if (!event) notFound()

  const gradient = typeGradients[event.type] ?? 'linear-gradient(135deg, #1a1a2a, #2d2d4a)'
  const dateStr  = new Date(event.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
  const desc     = event.description ?? ''

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 32px 80px' }}>

      {/* ─── breadcrumb ─── */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#A0A0A0', marginBottom: 32 }}>
        <Link href="/" className="hover:text-[#8B1E1E] transition-colors">خانه</Link>
        <ChevronLeft size={13} style={{ color: '#C0C0C0' }} />
        <Link href="/events" className="hover:text-[#8B1E1E] transition-colors">رویدادها</Link>
        <ChevronLeft size={13} style={{ color: '#C0C0C0' }} />
        <span style={{ color: '#171717' }}>{event.title}</span>
      </nav>

      {/* ─── پوستر + اطلاعات ─── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 mb-16">

        {/* پوستر ۴:۵ */}
        <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '4/5', background: gradient }}>
          {event.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.imageUrl}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>

        {/* اطلاعات */}
        <div>
          {/* عنوان */}
          <h1 style={{
            fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900,
            color: '#171717', marginBottom: 16, lineHeight: 1.15,
          }}>
            {event.title}
          </h1>

          {/* badge + اشتراک‌گذاری */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              background: '#FDF0F0', border: '1px solid #F0D5D5',
              borderRadius: 6, padding: '5px 14px',
              fontSize: 13, fontWeight: 700, color: '#8B1E1E',
            }}>
              {event.type}
            </span>
            <EventShareButton title={event.title} />
          </div>

          {/* مکان */}
          {event.location && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
              <MapPin size={16} style={{ color: '#8B1E1E', marginTop: 3, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#8B1E1E', letterSpacing: '0.06em', marginBottom: 2 }}>مکان</p>
                <p style={{ fontSize: 14, color: '#404040' }}>{event.location}</p>
              </div>
            </div>
          )}

          {/* تاریخ */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
            <Calendar size={16} style={{ color: '#8B1E1E', marginTop: 3, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8B1E1E', letterSpacing: '0.06em', marginBottom: 2 }}>تاریخ</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#171717' }}>{dateStr}</p>
            </div>
          </div>

          {/* ساعت */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
            <Clock size={16} style={{ color: '#8B1E1E', marginTop: 3, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8B1E1E', letterSpacing: '0.06em', marginBottom: 2 }}>ساعت</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#171717' }}>{event.time}</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #EFEFEF', margin: '20px 0' }} />

          {/* توضیحات */}
          {desc && <EventDescriptionExpand description={desc} />}
        </div>
      </div>

      {/* ─── گالری (از galleryImages دیتابیس) ─── */}
      {(() => {
        let galleryImages: string[] = []
        try { galleryImages = JSON.parse((event as { galleryImages?: string }).galleryImages ?? '[]') } catch {}
        if (galleryImages.length === 0) return null
        return (
          <div style={{ marginTop: 64 }}>
            <EventGallery
              images={galleryImages}
              imageGradients={galleryImages.map(() => gradient)}
              title={event.title}
            />
          </div>
        )
      })()}

      {/* ─── رویدادهای دیگر ─── */}
      {related.length > 0 && (
        <div style={{ marginTop: 72 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#171717', marginBottom: 24 }}>رویدادهای دیگر</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((e) => {
              const relGradient = typeGradients[e.type] ?? 'linear-gradient(135deg, #1a1a2a, #2d2d4a)'
              const relDate     = new Date(e.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
              return (
                <Link
                  key={e.id}
                  href={`/events/${e.slug}`}
                  className="block transition-shadow hover:shadow-md"
                  style={{ textDecoration: 'none', border: '1px solid #EFEFEF', borderRadius: 12, overflow: 'hidden', background: 'white' }}
                >
                  <div style={{ position: 'relative', paddingTop: '125%', background: relGradient }}>
                    {e.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.imageUrl} alt={e.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }} />
                    <span
                      className="absolute top-3 right-3 text-white font-bold"
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', borderRadius: 6, padding: '3px 10px', fontSize: 11 }}
                    >
                      {e.type}
                    </span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 className="font-[800] text-[#171717] line-clamp-2" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
                      {e.title}
                    </h3>
                    <p style={{ fontSize: 12, color: '#A0A0A0' }}>{relDate}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
