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
  isActive:    boolean
  imageUrl?:   string
  gradient:    string
}

const toFa = (n: number | string) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])

function formatTime(time: string): string {
  const [hh, mm] = time.split(':').map(Number)
  const period = hh >= 12 ? 'بعدازظهر' : 'صبح'
  const h12 = hh % 12 || 12
  return `${toFa(h12)}:${toFa(String(mm).padStart(2, '0'))} ${period}`
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

        {/* badge اتمام یافته */}
        {!event.isActive && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(20,20,20,0.62)',
            backdropFilter: 'blur(6px)',
            color: 'white', fontSize: 11, fontWeight: 600,
            padding: '4px 10px', borderRadius: 4,
          }}>
            اتمام یافته
          </span>
        )}

      </div>

      {/* ─── اطلاعات زیر پوستر ─── */}
      <div style={{ paddingTop: 14 }}>
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

        {/* تاریخ */}
        <div style={{ fontSize: 12, color: '#909090' }}>
          <span>{event.date}</span>
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
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 900, color: '#171717',
            letterSpacing: '-0.02em', lineHeight: 1.2,
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
            همه رویدادها
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
