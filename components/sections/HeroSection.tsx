'use client'

import Image from 'next/image'
import { useEffect, useState, useCallback, useRef } from 'react'

type Slide = {
  id:       string
  imageUrl: string
  showText: boolean
}

const INTERVAL_MS = 5000

export function HeroSection({ initialSlides }: { initialSlides?: Slide[] }) {
  const [slides,       setSlides]       = useState<Slide[]>(initialSlides ?? [])
  const [loaded,       setLoaded]       = useState(initialSlides != null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef<number>(0)

  useEffect(() => {
    if (initialSlides != null) return
    fetch('/api/hero-banners')
      .then((r) => r.json())
      .then((data: Slide[]) => {
        if (Array.isArray(data) && data.length > 0) setSlides(data)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [initialSlides])

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrentIndex((p) => (p - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    const timer = setInterval(next, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [next])

  const currentSlide = slides[currentIndex]

  if (!loaded) {
    return (
      <section className="relative w-full overflow-hidden h-[65vh] md:h-screen" style={{ background: '#1a0808' }}>
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center px-6 pb-10">
          <p className="text-white text-center leading-tight" style={{ fontFamily: 'Paeez, YekanBakh, Tahoma, sans-serif', fontSize: 'clamp(32px, 5vw, 72px)', maxWidth: '700px' }}>
            بَرای زندگیِ تازه‌ای کِه هَنوز نَزیستهِ‌ایم.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative w-full overflow-hidden h-[65vh] md:h-screen"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 50) { if (diff > 0) next(); else prev() }
      }}
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: index === currentIndex ? 1 : 0 }}
          >
            <Image
              src={slide.imageUrl}
              alt=""
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        {/* overlay تیره */}
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* متن — فقط وقتی اسلاید جاری showText: true داشته باشه */}
      <div
        className="absolute inset-0 z-20 flex items-center justify-center px-6 transition-opacity duration-700"
        style={{ opacity: currentSlide?.showText ? 1 : 0, pointerEvents: 'none' }}
      >
        <p
          className="text-white text-center leading-tight"
          style={{
            fontFamily: 'Paeez, YekanBakh, Tahoma, sans-serif',
            fontSize: 'clamp(32px, 5vw, 72px)',
            maxWidth: '700px',
          }}
        >
          بَرای زندگیِ تازه‌ای کِه هَنوز نَزیستهِ‌ایم.
        </p>
      </div>

      {/* dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`اسلاید ${idx + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              background: idx === currentIndex ? '#ffffff' : 'rgba(255,255,255,0.4)',
              width: idx === currentIndex ? '24px' : '8px',
              height: '8px',
            }}
          />
        ))}
      </div>
    </section>
  )
}
