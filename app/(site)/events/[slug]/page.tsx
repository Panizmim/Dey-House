import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ChevronLeft, Info } from '@/components/ui/icons'
import { events } from '@/lib/events-data'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }))
}

export default function EventDetailPage({ params }: Props) {
  const event = events.find((e) => e.slug === params.slug)
  if (!event) notFound()

  const metaRows = [
    { icon: <Calendar size={20} className="text-[#8B1E1E]" />, label: 'تاریخ', value: event.date },
    { icon: <Clock    size={20} className="text-[#8B1E1E]" />, label: 'ساعت',  value: event.time },
    { icon: <MapPin   size={20} className="text-[#8B1E1E]" />, label: 'مکان',  value: event.location },
  ]

  return (
    <>
      {/* Hero تصویر */}
      <div
        className="relative overflow-hidden w-full"
        style={{ height: '480px' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: event.gradient }}
        />
        {event.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* overlay gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }}
        />
        {/* متن روی overlay */}
        <div className="absolute bottom-0 right-0 left-0" style={{ padding: '40px 48px' }}>
          <span
            className="inline-block font-[700] text-white mb-3"
            style={{
              border: '1px solid rgba(255,255,255,0.7)',
              borderRadius: '4px',
              padding: '4px 12px',
              fontSize: '12px',
            }}
          >
            {event.type}
          </span>
          <h1
            className="font-[900] text-white leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            {event.title}
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div
        className="mx-auto flex items-center gap-1"
        style={{ maxWidth: '860px', padding: '20px 32px 0', fontSize: '13px', color: '#717171' }}
      >
        <Link href="/" className="hover:text-[#8B1E1E] transition-colors">خانه</Link>
        <ChevronLeft size={14} />
        <Link href="/events" className="hover:text-[#8B1E1E] transition-colors">رویدادها</Link>
        <ChevronLeft size={14} />
        <span className="text-[#171717]">{event.title}</span>
      </div>

      {/* محتوا */}
      <div
        className="mx-auto"
        style={{ maxWidth: '860px', padding: '32px 32px 80px' }}
      >
        <div
          className="grid gap-12"
          style={{ gridTemplateColumns: '1fr 300px' }}
        >
          {/* ستون راست — اطلاعات */}
          <div>
            {metaRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center gap-3"
                style={{ borderBottom: '1px solid #EFEFEF', padding: '16px 0' }}
              >
                {row.icon}
                <div>
                  <p
                    className="font-[700] uppercase tracking-wide"
                    style={{ fontSize: '11px', color: '#8B1E1E', letterSpacing: '0.08em' }}
                  >
                    {row.label}
                  </p>
                  <p style={{ fontSize: '15px', color: '#171717', marginTop: '2px' }}>
                    {row.value}
                  </p>
                </div>
              </div>
            ))}

            <h2
              className="font-[800] text-[#171717]"
              style={{ fontSize: '18px', margin: '32px 0 16px' }}
            >
              درباره این رویداد
            </h2>
            <p
              className="text-[#404040] whitespace-pre-line"
              style={{ fontSize: '15px', lineHeight: 2 }}
            >
              {event.description}
            </p>
          </div>

          {/* ستون چپ — sidebar */}
          <div style={{ position: 'sticky', top: '88px', alignSelf: 'start' }}>
            <div
              className="rounded-lg"
              style={{ border: '1px solid #EFEFEF', padding: '24px' }}
            >
              <h3
                className="font-[800] text-[#171717]"
                style={{ fontSize: '14px', marginBottom: '20px' }}
              >
                اطلاعات رویداد
              </h3>

              {[
                { label: 'نوع رویداد', value: event.type },
                { label: 'تاریخ', value: event.date },
                { label: 'ساعت شروع', value: event.time },
                { label: 'مکان', value: event.location },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center"
                  style={{ padding: '10px 0', borderBottom: '1px solid #FAFAFA' }}
                >
                  <span style={{ fontSize: '13px', color: '#717171' }}>{row.label}</span>
                  <span style={{ fontSize: '13px', color: '#171717', fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}

              <hr style={{ margin: '16px 0', borderColor: '#EFEFEF' }} />

              {/* notice */}
              <div
                className="rounded-lg"
                style={{
                  background: '#FDF5F5',
                  border: '1px solid #F0D5D5',
                  padding: '14px',
                }}
              >
                <Info size={16} className="text-[#8B1E1E] mb-2" />
                <p style={{ fontSize: '13px', color: '#8B1E1E', lineHeight: '1.7' }}>
                  این رویداد صرفاً جنبه اطلاع‌رسانی دارد. برای اطلاعات بیشتر با خانه دی تماس بگیرید.
                </p>
              </div>

              <Link
                href="/contact"
                className="block text-center font-[700] transition-colors duration-200 hover:bg-[#FDF5F5]"
                style={{
                  width: '100%',
                  marginTop: '16px',
                  border: '1px solid #8B1E1E',
                  color: '#8B1E1E',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '14px',
                  fontFamily: 'YekanBakh, Tahoma, sans-serif',
                }}
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
