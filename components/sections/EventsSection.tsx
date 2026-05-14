'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type PublicEvent = {
  id:          string
  slug:        string
  title:       string
  type:        string
  date:        string
  time:        string
  location:    string
  description: string
  imageUrl?:   string
  gradient:    string
}

function EventCard({ event }: { event: PublicEvent }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/events/${event.slug}`}
      style={{ display: 'block', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ─── پوستر مربعی ─── */}
      <div style={{
        position: 'relative', paddingTop: '125%',
        background: event.gradient, overflow: 'hidden',
        borderRadius: 2,
      }}>
        {event.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 500ms ease',
            }}
          />
        )}

        {/* badge نوع رویداد */}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(20,20,20,0.62)',
          backdropFilter: 'blur(6px)',
          color: 'white', fontSize: 11, fontWeight: 600,
          padding: '4px 10px', borderRadius: 4,
          letterSpacing: '0.02em',
        }}>
          {event.type}
        </span>
      </div>

      {/* ─── اطلاعات زیر پوستر ─── */}
      <div style={{ paddingTop: 14 }}>
        {/* عنوان */}
        <h3
          style={{
            fontSize: 18, fontWeight: 900, color: '#171717',
            lineHeight: 1.4, marginBottom: 10,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } as React.CSSProperties}
        >
          {event.title}
        </h3>

        {/* ردیف: نوع | مکان | تاریخ */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 12, color: '#909090', gap: 6,
        }}>
          <span style={{ fontWeight: 500, flexShrink: 0 }}>{event.type}</span>
          {event.location && (
            <span style={{ color: '#B8B8B8', flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
      <div className="animate-pulse" style={{ paddingTop: '125%', background: '#F0F0F0', borderRadius: 2, position: 'relative' }} />
      <div style={{ paddingTop: 14 }}>
        <div className="animate-pulse" style={{ height: 18, background: '#F0F0F0', borderRadius: 4, marginBottom: 10, width: '75%' }} />
        <div className="animate-pulse" style={{ height: 12, background: '#F0F0F0', borderRadius: 4, width: '55%' }} />
      </div>
    </div>
  )
}

export function EventsSection() {
  const [events,  setEvents]  = useState<PublicEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data: PublicEvent[]) => setEvents(data.slice(0, 8)))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && events.length === 0) return null

  return (
    <section style={{ padding: '64px 0' }}>
      <div className="max-w-container mx-auto px-6 md:px-8 lg:px-12">

        {/* ─── هدر ─── */}
        <div style={{
          display: 'flex', alignItems: 'baseline',
          justifyContent: 'space-between', marginBottom: 32,
        }}>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 32px)',
            fontWeight: 900, color: '#171717',
            letterSpacing: '-0.02em',
          }}>
            رویدادها
          </h2>
          <Link
            href="/events"
            style={{
              fontSize: 13, color: '#909090',
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 4,
              transition: 'color 200ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#171717' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#909090' }}
          >
            همه رویدادها ↗
          </Link>
        </div>

        {/* ─── گرید کارت‌ها ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : events.map((event) => <EventCard key={event.id} event={event} />)
          }
        </div>

      </div>
    </section>
  )
}
