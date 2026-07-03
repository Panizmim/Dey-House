'use client'

import { useEffect, useRef } from 'react'
import { X, ChevronRight, ChevronLeft } from '@/components/ui/icons'
import { toPersianNum } from '@/lib/utils'

interface Props {
  images:       string[]
  index:        number | null
  onChange:     (index: number | null) => void
  alt?:         string
  gradient?:    string
  naturalSize?: boolean
}

export function Lightbox({ images, index, onChange, alt = '', gradient, naturalSize }: Props) {
  const open      = index !== null
  const total     = images.length
  const touchX    = useRef<number | null>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open || index === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')                              onChange(null)
      if (e.key === 'ArrowRight' && index! > 0)           onChange(index! - 1)
      if (e.key === 'ArrowLeft'  && index! < total - 1)   onChange(index! + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, total, onChange])

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null || index === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) < 40) return
    // RTL: swipe right → قبلی (index-1)، swipe left → بعدی (index+1)
    if (dx > 0 && index > 0)           onChange(index - 1)
    if (dx < 0 && index < total - 1)   onChange(index + 1)
  }

  if (!open || index === null) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={() => onChange(null)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* دکمه بستن */}
      <button
        className="absolute top-5 left-5 text-white/70 hover:text-white transition-all p-2"
        onClick={() => onChange(null)}
      >
        <X size={24} />
      </button>

      {/* شماره تصویر */}
      <div className="absolute top-5 right-5 text-white/60 text-sm font-light">
        {toPersianNum(index + 1)} / {toPersianNum(total)}
      </div>

      {/* تصویر */}
      <div
        style={naturalSize
          ? { flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }
          : { position: 'relative', aspectRatio: '1 / 1', width: 'min(85vh, 85vw)', flexShrink: 0 }
        }
        onClick={(e) => e.stopPropagation()}
      >
        {gradient && !naturalSize && (
          <div className="absolute inset-0 -z-10" style={{ background: gradient }} />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={alt}
          style={naturalSize
            ? { maxWidth: '90vw', maxHeight: '85vh', width: 'auto', height: 'auto', display: 'block' }
            : { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
          }
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      {/* قبلی — RTL: دکمه سمت راست */}
      {index > 0 && (
        <button
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all p-2"
          onClick={(e) => { e.stopPropagation(); onChange(index - 1) }}
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* بعدی — RTL: دکمه سمت چپ */}
      {index < total - 1 && (
        <button
          className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all p-2"
          onClick={(e) => { e.stopPropagation(); onChange(index + 1) }}
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); onChange(i) }}
            className={`rounded-full transition-all ${i === index ? 'bg-white w-4 h-2' : 'bg-white/40 w-2 h-2'}`}
          />
        ))}
      </div>
    </div>
  )
}
