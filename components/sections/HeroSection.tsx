'use client'

import Image from 'next/image'
import { useEffect, useState, useCallback, useRef } from 'react'

const heroSlides = [
  { id: 1, image: '/images/hero/slide1', gradient: 'linear-gradient(135deg, #1a0808, #2d1010)' },
  { id: 2, image: '/images/hero/slide2', gradient: 'linear-gradient(135deg, #0a1a08, #1a2d10)' },
  { id: 3, image: '/images/hero/slide3', gradient: 'linear-gradient(135deg, #08081a, #10102d)' },
  { id: 4, image: '/images/hero/slide4', gradient: 'linear-gradient(135deg, #1a1208, #2d2010)' },
  { id: 5, image: '/images/hero/slide5', gradient: 'linear-gradient(135deg, #0a0a1a, #10182d)' },
  { id: 6, image: '/images/hero/slide6', gradient: 'linear-gradient(135deg, #1a0a08, #2d1810)' },
  { id: 7, image: '/images/hero/slide7', gradient: 'linear-gradient(135deg, #081a12, #102d1a)' },
  { id: 8, image: '/images/hero/slide8', gradient: 'linear-gradient(135deg, #120808, #201010)' },
]

const INTERVAL_MS = 5000

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef<number>(0)

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const prev = useCallback(() => {
    setCurrentIndex((p) => (p - 1 + heroSlides.length) % heroSlides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [next])

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
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: index === currentIndex ? 1 : 0 }}
          >
            {/* gradient همیشه نمایش داده می‌شود */}
            <div
              className="absolute inset-0"
              style={{ background: slide.gradient }}
            />
            <Image
              src={`${slide.image}.jpg`}
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

      {/* متن مرکزی */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
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
        {heroSlides.map((slide, idx) => (
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
