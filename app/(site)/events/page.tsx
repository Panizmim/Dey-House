'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ChevronDown } from 'lucide-react'

type PublicEvent = {
  id:          string
  slug:        string
  title:       string
  type:        string
  date:        string
  time:        string
  location:    string
  description: string
  isActive:    boolean
  isFeatured:  boolean
  imageUrl?:   string
  gradient:    string
}

const EVENT_TYPES = ['تئاتر', 'نمایشگاه', 'موسیقی', 'ادبی', 'ورکشاپ']

function EventCard({ event }: { event: PublicEvent }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={`/events/${event.slug}`}
      style={{ display: 'block', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* پوستر ۴:۵ */}
      <div style={{ position: 'relative', paddingTop: '125%', background: event.gradient, overflow: 'hidden', borderRadius: 2 }}>
        {event.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 500ms ease',
            }}
          />
        )}
        {/* badge نوع */}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(20,20,20,0.62)', backdropFilter: 'blur(6px)',
          color: 'white', fontSize: 11, fontWeight: 600,
          padding: '4px 10px', borderRadius: 4,
        }}>
          {event.type}
        </span>
        {/* badge وضعیت */}
        <span style={{
          position: 'absolute', top: 10, left: 10,
          background: event.isActive ? 'rgba(47,158,68,0.85)' : 'rgba(0,0,0,0.45)',
          color: 'white', fontSize: 11, fontWeight: 600,
          padding: '4px 10px', borderRadius: 4,
        }}>
          {event.isActive ? 'فعال' : 'آرشیو'}
        </span>
      </div>

      {/* اطلاعات */}
      <div style={{ paddingTop: 14 }}>
        <h3 style={{
          fontSize: 17, fontWeight: 900, color: '#171717',
          lineHeight: 1.4, marginBottom: 9,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        } as React.CSSProperties}>
          {event.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#909090', gap: 6 }}>
          <span style={{ fontWeight: 500, flexShrink: 0 }}>{event.type}</span>
          {event.location && (
            <span style={{ color: '#B8B8B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.location}
            </span>
          )}
          <span style={{ flexShrink: 0 }}>{event.date}</span>
        </div>
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div>
      <div className="animate-pulse" style={{ paddingTop: '125%', background: '#F3F4F6', borderRadius: 2, position: 'relative' }} />
      <div style={{ paddingTop: 14 }}>
        <div className="animate-pulse" style={{ height: 17, background: '#F3F4F6', borderRadius: 4, marginBottom: 9, width: '75%' }} />
        <div className="animate-pulse" style={{ height: 12, background: '#F3F4F6', borderRadius: 4, width: '55%' }} />
      </div>
    </div>
  )
}

export default function EventsPage() {
  const [allEvents,     setAllEvents]     = useState<PublicEvent[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [activeOnly,    setActiveOnly]    = useState(false)
  const [typeOpen,      setTypeOpen]      = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data: PublicEvent[]) => setAllEvents(data))
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false))
  }, [])

  function toggleType(t: string) {
    setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  }

  const filtered = allEvents.filter((e) => {
    if (search && !e.title.includes(search) && !e.description.includes(search)) return false
    if (selectedTypes.length > 0 && !selectedTypes.includes(e.type)) return false
    if (activeOnly && !e.isActive) return false
    return true
  })

  const hasFilters = search || selectedTypes.length > 0 || activeOnly

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px 80px' }}>

      {/* عنوان */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#171717', marginBottom: 6 }}>رویدادها</h1>
        <p style={{ fontSize: 14, color: '#717171' }}>رویدادهای فرهنگی و هنری خانه دی</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40, alignItems: 'start' }}>

        {/* ─── Sidebar ─── */}
        <aside style={{ position: 'sticky', top: 96 }}>

          {/* جستجو */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                border: '1px solid #E5E5E5', borderRadius: 10,
                padding: '10px 14px', background: 'white', transition: 'border-color 150ms',
              }}
              onFocusCapture={(e) => { e.currentTarget.style.borderColor = '#8B1E1E' }}
              onBlurCapture={(e)  => { e.currentTarget.style.borderColor = '#E5E5E5' }}
            >
              <Search size={15} style={{ color: '#A0A0A0', flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو..."
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: 13, color: '#171717', background: 'transparent',
                  fontFamily: 'YekanBakh, Tahoma, sans-serif',
                }}
              />
            </div>
          </div>

          <div style={{ height: 1, background: '#F0F0F0', marginBottom: 20 }} />

          {/* نوع رویداد */}
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => setTypeOpen(!typeOpen)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: 13, fontWeight: 700, color: '#171717',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '0 0 14px', fontFamily: 'YekanBakh, Tahoma, sans-serif',
              }}
            >
              نوع رویداد
              <ChevronDown size={15} style={{
                color: '#717171', transition: 'transform 200ms',
                transform: typeOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }} />
            </button>

            {typeOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {EVENT_TYPES.map((t) => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(t)}
                      onChange={() => toggleType(t)}
                      style={{ accentColor: '#8B1E1E', width: 15, height: 15, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 13, color: '#404040' }}>{t}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div style={{ height: 1, background: '#F0F0F0', marginBottom: 20 }} />

          {/* فقط رویدادهای فعال */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#171717' }}>فقط رویدادهای فعال</span>
            <button
              onClick={() => setActiveOnly(!activeOnly)}
              role="switch"
              aria-checked={activeOnly}
              style={{
                width: 42, height: 24, borderRadius: 12,
                background: activeOnly ? '#8B1E1E' : '#D0D0D0',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 200ms', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 4,
                right: activeOnly ? 4 : undefined,
                left:  activeOnly ? undefined : 4,
                width: 16, height: 16, borderRadius: '50%', background: 'white',
                transition: 'right 200ms, left 200ms',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>

          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setSelectedTypes([]); setActiveOnly(false) }}
              style={{
                marginTop: 20, width: '100%', padding: '9px',
                border: '1px solid #E5E5E5', borderRadius: 8, background: 'white',
                fontSize: 12, color: '#717171', cursor: 'pointer', transition: 'all 150ms',
                fontFamily: 'YekanBakh, Tahoma, sans-serif',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8B1E1E'; e.currentTarget.style.color = '#8B1E1E' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.color = '#717171' }}
            >
              پاک‌کردن فیلترها
            </button>
          )}
        </aside>

        {/* ─── محتوا ─── */}
        <main>
          {loading ? (
            <>
              <div style={{ height: 16, background: '#F3F4F6', borderRadius: 4, width: 100, marginBottom: 20 }} className="animate-pulse" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13, color: '#A0A0A0', marginBottom: 20 }}>
                {filtered.length} رویداد یافت شد
              </p>

              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#A0A0A0', fontSize: 14 }}>
                  رویدادی با این فیلترها یافت نشد
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px 20px' }}>
                  {filtered.map((event) => <EventCard key={event.id} event={event} />)}
                </div>
              )}
            </>
          )}
        </main>

      </div>
    </div>
  )
}
