'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toJalali, PERSIAN_MONTHS, toPersian } from '@/lib/jalali'

type Gallery = {
  id:         string
  slug:       string
  title:      string
  artistName: string
  startDate:  string
  endDate:    string
  status:     string
  coverImage: string | null
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
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/gallery/${gallery.slug}`}
      style={{ display: 'block', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ─── تصویر مربعی ─── */}
      <div style={{
        position: 'relative', paddingTop: '100%',
        background: 'linear-gradient(135deg, #e8ddd0, #c8b89a)',
        overflow: 'hidden', borderRadius: 2,
      }}>
        {gallery.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gallery.coverImage}
            alt={gallery.title}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 500ms ease',
            }}
          />
        )}

        {/* badge وضعیت */}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          background: gallery.status === 'ACTIVE'
            ? 'rgba(47,158,68,0.85)'
            : 'rgba(20,20,20,0.55)',
          backdropFilter: 'blur(6px)',
          color: 'white', fontSize: 11, fontWeight: 600,
          padding: '4px 10px', borderRadius: 4,
          letterSpacing: '0.02em',
        }}>
          {statusLabel[gallery.status] ?? gallery.status}
        </span>
      </div>

      {/* ─── اطلاعات زیر تصویر ─── */}
      <div style={{ paddingTop: 14 }}>
        <h3 style={{
          fontSize: 15, fontWeight: 700, color: '#171717',
          marginBottom: 4, lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        } as React.CSSProperties}>
          {gallery.artistName}
        </h3>
        <p style={{
          fontSize: 13, fontWeight: 300, color: '#404040',
          marginBottom: 6, lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        } as React.CSSProperties}>
          {gallery.title}
        </p>
        <p style={{ fontSize: 12, color: '#909090' }}>
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
      <div className="animate-pulse" style={{ paddingTop: '100%', background: '#F0F0F0', borderRadius: 2, position: 'relative' }} />
      <div style={{ paddingTop: 14 }}>
        <div className="animate-pulse" style={{ height: 15, background: '#F0F0F0', borderRadius: 4, marginBottom: 8, width: '70%' }} />
        <div className="animate-pulse" style={{ height: 12, background: '#F0F0F0', borderRadius: 4, width: '50%' }} />
      </div>
    </div>
  )
}

export function GallerySection() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    fetch('/api/galleries')
      .then((r) => r.json())
      .then((data: Gallery[]) => setGalleries(data.slice(0, 8)))
      .catch(() => setGalleries([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && galleries.length === 0) return null

  return (
    <section style={{ padding: '64px 0' }}>
      <div className="max-w-container mx-auto px-6 md:px-8 lg:px-12">

        {/* ─── هدر ─── */}
        <div style={{
          display: 'flex', alignItems: 'baseline',
          justifyContent: 'space-between', marginBottom: 32,
        }}>
          <h2
            className="font-black text-[#171717]"
            style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
          >
            نمایشگاه‌ها
          </h2>
          <Link
            href="/gallery"
            style={{
              fontSize: 13, color: '#909090',
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 4,
              transition: 'color 200ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#171717' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#909090' }}
          >
            همه نمایشگاه‌ها
          </Link>
        </div>

        {/* ─── گرید کارت‌ها ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : galleries.map((g) => <GalleryCard key={g.id} gallery={g} />)
          }
        </div>

      </div>
    </section>
  )
}
