import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { db } from '@/lib/db'
import EventGallery from './EventGallery'
import EventShareButton from './EventShareButton'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

const toFa = (n: number | string) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])

function formatTime(time: string): string {
  if (!time) return ''
  const [hh, mm] = time.split(':')
  return `${toFa(hh.padStart(2, '0'))}:${toFa(mm.padStart(2, '0'))}`
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

  const gradient     = typeGradients[event.type] ?? 'linear-gradient(135deg, #1a1a2a, #2d2d4a)'
  const dateStr      = new Date(event.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
  const desc         = event.description ?? ''
  let galleryImages: string[] = []
  try { galleryImages = JSON.parse((event as { galleryImages?: string }).galleryImages ?? '[]') } catch {}

  return (
    <main className="max-w-[900px] mx-auto px-8 md:px-4 py-16" dir="rtl">

      {/* ─── پوستر ۱۶:۹ ─── */}
      {event.imageUrl ? (
        <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden', borderRadius: 10, marginBottom: 28, background: gradient }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 10, marginBottom: 28, background: gradient }} />
      )}

      {/* ─── اطلاعات رویداد ─── */}
      <div className="mb-8 text-right">
        <h1 className="font-black text-[#171717] mb-3"
          style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          {event.title}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: 14, color: '#555555' }}>
          <span className="font-light">{event.type}</span>
          <span className="font-light">{dateStr}</span>
          {event.time && <span className="font-light">{formatTime(event.time)}</span>}
          {event.location && <span className="font-light">{event.location}</span>}
        </div>
        <div style={{ marginTop: 16 }}>
          <EventShareButton title={event.title} />
        </div>
      </div>

      <div className="w-full h-px bg-[#EFEFEF] my-8" />

      {/* ─── توضیحات ─── */}
      {desc && (
        <div className="mb-12">
          <h2 className="font-black text-[#171717] mb-5" style={{ fontSize: 20 }}>توضیحات</h2>
          <div>
            {desc.split('\n').map((line, i) => (
              <p key={i} dir="auto" className="font-light text-[#1a1a1a]"
                style={{ fontSize: 15, lineHeight: 2.2, textAlign: 'justify', minHeight: '1em' }}>
                {line || ' '}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ─── گالری رویداد ─── */}
      {galleryImages.length > 0 && (
        <div className="mb-16">
          <EventGallery
            images={galleryImages}
            imageGradients={galleryImages.map(() => gradient)}
            title={event.title}
          />
        </div>
      )}

      {/* ─── رویدادهای دیگر ─── */}
      {related.length > 0 && (
        <div style={{ marginTop: 64 }}>
          <h2 className="font-black text-[#171717]" style={{ fontSize: 20, marginBottom: 24 }}>رویدادهای دیگر</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((e) => {
              const relGradient = typeGradients[e.type] ?? 'linear-gradient(135deg, #1a1a2a, #2d2d4a)'
              const relDate     = new Date(e.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
              return (
                <a
                  key={e.id}
                  href={`/events/${e.slug}`}
                  className="block transition-shadow hover:shadow-md"
                  style={{ textDecoration: 'none', border: '1px solid #EFEFEF', borderRadius: 12, overflow: 'hidden', background: 'white' }}
                >
                  <div style={{ position: 'relative', paddingTop: '56.25%', background: relGradient }}>
                    {e.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.imageUrl} alt={e.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 className="font-[800] text-[#171717] line-clamp-2" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
                      {e.title}
                    </h3>
                    <p style={{ fontSize: 12, color: '#A0A0A0' }}>{relDate}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}

    </main>
  )
}
