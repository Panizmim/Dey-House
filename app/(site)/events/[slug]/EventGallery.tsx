'use client'

import { useState } from 'react'
import { Lightbox } from '@/components/ui/Lightbox'
import { toPersianNum } from '@/lib/utils'

interface Props {
  images:         string[]
  imageGradients: string[]
  title:          string
}

export default function EventGallery({ images, imageGradients, title }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      {/* هدر */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#171717' }}>گالری رویداد</h2>
        <span style={{ fontSize: 13, color: '#A0A0A0' }}>{toPersianNum(images.length)} تصویر</span>
      </div>

      {/* گرید */}
      <div className="grid gap-1 grid-cols-3 sm:grid-cols-5">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            style={{
              position: 'relative', paddingTop: '100%',
              border: 'none', cursor: 'pointer',
              overflow: 'hidden', borderRadius: 0,
              background: imageGradients[i] ?? '#E5E5E5',
              transition: 'transform 300ms',
              display: 'block',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
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

      <Lightbox
        images={images}
        index={lightboxIndex}
        onChange={setLightboxIndex}
        alt={title}
        gradient={lightboxIndex !== null ? imageGradients[lightboxIndex] : undefined}
      />
    </>
  )
}
