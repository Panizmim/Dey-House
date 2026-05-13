import Link from 'next/link'
import { Calendar, Clock, MapPin } from '@/components/ui/icons'
import { events } from '@/lib/events-data'
import PageHero from '@/components/ui/PageHero'

/* ─── EventCard ─── */
function EventCard({ slug, title, type, date, time, location, gradient, imageUrl }: {
  slug: string; title: string; type: string; date: string;
  time: string; location: string; gradient: string; imageUrl?: string
}) {
  return (
    <Link href={`/events/${slug}`} className="block group">
      <div
        className="overflow-hidden transition-shadow duration-200 group-hover:shadow-hover"
        style={{
          border: '1px solid #EFEFEF',
          borderRadius: '8px',
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          height: '200px',
        }}
      >
        {/* تصویر */}
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ background: gradient }}
        >
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
            />
          )}
          {!imageUrl && (
            <div
              className="absolute inset-0 transition-transform duration-[400ms] group-hover:scale-[1.04]"
              style={{ background: gradient }}
            />
          )}
        </div>

        {/* اطلاعات */}
        <div className="flex flex-col justify-center px-6 py-5">
          <span
            className="self-start font-[700] mb-2.5"
            style={{
              border: '1px solid #8B1E1E',
              color: '#8B1E1E',
              borderRadius: '4px',
              padding: '3px 10px',
              fontSize: '11px',
            }}
          >
            {type}
          </span>

          <h2
            className="font-[800] text-[#171717] mb-3 leading-snug"
            style={{
              fontSize: '20px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </h2>

          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-2" style={{ fontSize: '13px', color: '#717171' }}>
              <Calendar size={14} className="text-[#8B1E1E] flex-shrink-0" />
              {date}
            </span>
            <span className="flex items-center gap-2" style={{ fontSize: '13px', color: '#717171' }}>
              <Clock size={14} className="text-[#8B1E1E] flex-shrink-0" />
              {time}
            </span>
            <span className="flex items-center gap-2" style={{ fontSize: '13px', color: '#717171' }}>
              <MapPin size={14} className="text-[#8B1E1E] flex-shrink-0" />
              {location}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Page ─── */
export default function EventsPage() {
  return (
    <>
      <PageHero
        title="رویدادها"
        subtitle="رویدادهای فرهنگی و هنری خانه دی"
      />

      {/* لیست */}
      <div
        className="mx-auto flex flex-col"
        style={{ maxWidth: '860px', padding: '48px 32px', gap: '20px' }}
      >
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </>
  )
}
