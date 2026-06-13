'use client'

import { useEffect } from 'react'
import { X, ChevronRight, ChevronLeft } from '@/components/ui/icons'
import { toPersianNum } from '@/lib/utils'

interface Props {
  images:    string[]
  index:     number | null
  onChange:  (index: number | null) => void
  alt?:      string
  gradient?: string
}

export function Lightbox({ images, index, onChange, alt = '', gradient }: Props) {
  const open  = index !== null
  const total = images.length

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

  if (!open || index === null) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={() => onChange(null)}
    >
      {/* دکمه بستن */}
      <button
        className="absolute top-5 left-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
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
        className="relative w-full max-w-5xl max-h-[85vh] mx-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]}
          alt={alt}
          className="w-full h-full object-contain max-h-[85vh] rounded-lg"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        {gradient && (
          <div className="absolute inset-0 -z-10 rounded-lg" style={{ background: gradient }} />
        )}
      </div>

      {/* قبلی — RTL: دکمه سمت راست */}
      {index > 0 && (
        <button
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all"
          onClick={(e) => { e.stopPropagation(); onChange(index - 1) }}
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* بعدی — RTL: دکمه سمت چپ */}
      {index < total - 1 && (
        <button
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all"
          onClick={(e) => { e.stopPropagation(); onChange(index + 1) }}
        >
          <ChevronLeft size={24} />
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
