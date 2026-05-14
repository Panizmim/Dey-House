'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { toPersianNum } from '@/lib/utils'

interface Props {
  images:         string[]
  imageGradients: string[]
  title:          string
}

export default function EventGallery({ images, imageGradients, title }: Props) {
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 })

  useEffect(() => {
    document.body.style.overflow = lightbox.open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox.open])

  useEffect(() => {
    if (!lightbox.open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' && lightbox.index > 0)
        setLightbox((p) => ({ ...p, index: p.index - 1 }))
      if (e.key === 'ArrowLeft' && lightbox.index < images.length - 1)
        setLightbox((p) => ({ ...p, index: p.index + 1 }))
      if (e.key === 'Escape')
        setLightbox({ open: false, index: 0 })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, images.length])

  return (
    <>
      {/* هدر */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#171717' }}>عکس‌های رویداد</h2>
        <button
          onClick={() => setLightbox({ open: true, index: 0 })}
          style={{
            fontSize: 13, color: '#717171',
            border: '1px solid #E5E5E5', borderRadius: 8, padding: '6px 14px',
            background: 'white', cursor: 'pointer', transition: 'all 150ms',
            fontFamily: 'YekanBakh, Tahoma, sans-serif',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8B1E1E'; e.currentTarget.style.color = '#8B1E1E' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.color = '#717171' }}
        >
          همه عکس‌ها
        </button>
      </div>

      {/* گرید عکس‌ها */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox({ open: true, index: i })}
            style={{
              position: 'relative', paddingTop: '100%',
              border: 'none', cursor: 'pointer',
              overflow: 'hidden', borderRadius: 10,
              background: imageGradients[i] ?? '#E5E5E5',
              transition: 'transform 300ms',
              display: 'block',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`${title} — تصویر ${toPersianNum(i + 1)}`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox.open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setLightbox({ open: false, index: 0 })}
        >
          {/* دکمه بستن */}
          <button
            style={{
              position: 'absolute', top: 20, left: 20,
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '50%', padding: 8, cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)', display: 'flex',
              transition: 'all 150ms',
            }}
            onClick={() => setLightbox({ open: false, index: 0 })}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          >
            <X size={24} />
          </button>

          {/* شماره */}
          <div style={{ position: 'absolute', top: 24, right: 24, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            {toPersianNum(lightbox.index + 1)} / {toPersianNum(images.length)}
          </div>

          {/* تصویر */}
          <div
            style={{ position: 'relative', maxWidth: '80vw', maxHeight: '85vh', margin: '0 80px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 12,
              background: imageGradients[lightbox.index] ?? '#333', zIndex: -1,
            }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightbox.index]}
              alt={title}
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12, display: 'block' }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>

          {/* ناوبری RTL: ArrowRight = قبلی (index - 1) */}
          {lightbox.index > 0 && (
            <button
              style={{
                position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                padding: 12, cursor: 'pointer', color: 'white', display: 'flex',
                transition: 'all 150ms',
              }}
              onClick={(e) => { e.stopPropagation(); setLightbox((p) => ({ ...p, index: p.index - 1 })) }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            >
              <ChevronRight size={24} />
            </button>
          )}

          {lightbox.index < images.length - 1 && (
            <button
              style={{
                position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                padding: 12, cursor: 'pointer', color: 'white', display: 'flex',
                transition: 'all 150ms',
              }}
              onClick={(e) => { e.stopPropagation(); setLightbox((p) => ({ ...p, index: p.index + 1 })) }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* dots */}
          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 8,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightbox((p) => ({ ...p, index: i })) }}
                style={{
                  width: i === lightbox.index ? 16 : 8, height: 8,
                  borderRadius: 4,
                  background: i === lightbox.index ? 'white' : 'rgba(255,255,255,0.4)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 200ms',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
