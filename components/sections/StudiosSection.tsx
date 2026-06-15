'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from '@/components/ui/icons'
import { toPersianNum } from '@/lib/utils'

const studios = [
  {
    id:           'white-room',
    name:         'اتاق سفید',
    area:         '۵۰ متر مربع',
    pricePerHour: 400_000,
    floorType:    'پارکت',
    wallType:     'سفید',
    chairCount:   30,
    acoustic:     'اکوستیک',
    images: [
      '/images/studios/white-room-1.jpg',
      '/images/studios/white-room-2.jpg',
      '/images/studios/white-room-3.jpg',
    ],
    gradient: 'linear-gradient(135deg, #e8ddd0, #c8b89a)',
  },
  {
    id:           'black-room-1',
    name:         'اتاق سیاه یک',
    area:         '۲۰ متر مربع',
    pricePerHour: 300_000,
    floorType:    'سیمانی',
    wallType:     'سیاه',
    chairCount:   20,
    acoustic:     'اکوستیک',
    images: [
      '/images/studios/black-room1-1.jpg',
      '/images/studios/black-room1-2.jpg',
      '/images/studios/black-room1-3.jpg',
    ],
    gradient: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
  },
  {
    id:           'black-room-2',
    name:         'اتاق سیاه دو',
    area:         '۱۲ متر مربع',
    pricePerHour: 150_000,
    floorType:    'سیمانی',
    wallType:     'سیاه',
    chairCount:   15,
    acoustic:     'اکوستیک',
    images: [
      '/images/studios/black-room2-1.jpg',
      '/images/studios/black-room2-2.jpg',
      '/images/studios/black-room2-3.jpg',
    ],
    gradient: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
  },
]

/* ─── StudioCard ─── */
function StudioCard({ studio }: { studio: typeof studios[number] }) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + studio.images.length) % studio.images.length)
  const next = () => setCurrent((c) => (c + 1) % studio.images.length)

  return (
    <Link href={`/booking/${studio.id}`} className="block group cursor-pointer" style={{ textDecoration: 'none' }}>

      {/* ─── تصویر ─── */}
      <div className="relative w-full overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>

        {/* gradient fallback */}
        <div className="absolute inset-0" style={{ background: studio.gradient }} />

        {/* تصویر جاری */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.images[current]}
          alt={studio.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />

        {/* dots */}
        {studio.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {studio.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i) }}
                aria-label={`تصویر ${toPersianNum(i + 1)}`}
                style={{
                  width:      i === current ? 14 : 5,
                  height:     5,
                  borderRadius: 9999,
                  background: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
                  border:     'none',
                  padding:    0,
                  cursor:     'pointer',
                  transition: 'width 300ms ease, background 300ms ease',
                }}
              />
            ))}
          </div>
        )}

        {/* prev/next — فقط روی hover */}
        {studio.images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); prev() }}
              aria-label="قبلی"
              className="absolute right-3 top-1/2 -translate-y-1/2
                         w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm
                         flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         border-none cursor-pointer"
            >
              <ChevronRight size={14} className="text-[#171717]" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); next() }}
              aria-label="بعدی"
              className="absolute left-3 top-1/2 -translate-y-1/2
                         w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm
                         flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         border-none cursor-pointer"
            >
              <ChevronLeft size={14} className="text-[#171717]" />
            </button>
          </>
        )}
      </div>

      {/* ─── اطلاعات ─── */}
      <div>

        {/* نام */}
        <div className="mb-1">
          <h3 className="text-[15px] font-black text-[#171717] leading-tight">
            {studio.name}
          </h3>
        </div>

        {/* جزئیات فضا */}
        <div className="flex items-center gap-4 mt-3 mb-3">
          <span className="text-[13px] text-[#717171] font-medium">{studio.area}</span>
          <span className="text-[13px] text-[#717171] font-medium">{toPersianNum(studio.chairCount)} صندلی</span>
          <span className="text-[13px] text-[#717171] font-medium">{studio.acoustic}</span>
        </div>

        {/* separator */}
        <div className="w-full h-px bg-[#E8E8E8] mb-3" />

        {/* قیمت */}
        <div className="flex items-baseline gap-1">
          <span className="text-[13px] text-[#717171] font-medium">شروع از:</span>
          <span className="text-[15px] font-black text-[#171717]">
            {studio.pricePerHour.toLocaleString('fa-IR')}
          </span>
          <span className="text-[15px] font-black text-[#171717]">تومان</span>
          <span className="text-[13px] text-[#717171] font-medium">/ ساعت</span>
        </div>

      </div>
    </Link>
  )
}

/* ─── StudiosSection ─── */
export function StudiosSection() {
  return (
    <section className="max-w-container mx-auto px-6 md:px-8 lg:px-12 py-20">

      {/* هدر */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2
            className="font-black text-[#171717]"
            style={{ fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
          >
            رزرو فضا
          </h2>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-7">
        {studios.map((studio) => (
          <StudioCard key={studio.id} studio={studio} />
        ))}
      </div>

    </section>
  )
}
