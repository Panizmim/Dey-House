'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Star,
  Lightbulb, Monitor, Scan, Wind, Volume2, Square,
  Users, Maximize2, Wifi, AirVent,
  ChevronLeft, ChevronRight,
} from 'lucide-react'

/* ─── داده‌ها ─── */
type Amenity = { label: string; icon: string }

const iconMap: Record<string, React.ElementType> = {
  Lightbulb, Monitor, Scan, Wind, Volume2, Square,
  Users, Maximize2, Wifi, AirVent,
}

const studios = [
  {
    id: 'white-room',
    name: 'اتاق سفید',
    area: '۵۰ متر مربع',
    price: '۴۰۰٬۰۰۰',
    rating: '۴.۹',
    reviewCount: '۴۷',
    images: [
      '/images/studios/white-room-1.jpg',
      '/images/studios/white-room-2.jpg',
      '/images/studios/white-room-3.jpg',
    ],
    gradient: 'linear-gradient(135deg, #e8ddd0, #c8b89a)',
    amenities: [
      { label: 'تجهیزات نورپردازی', icon: 'Lightbulb' },
      { label: 'ویدیو پروژکتور',   icon: 'Monitor'   },
      { label: 'آینه',             icon: 'Scan'       },
      { label: 'سیستم تهویه',      icon: 'Wind'       },
      { label: 'اسپیکر',           icon: 'Volume2'    },
    ] as Amenity[],
  },
  {
    id: 'black-room-1',
    name: 'اتاق سیاه یک',
    area: '۲۰ متر مربع',
    price: '۳۰۰٬۰۰۰',
    rating: '۴.۸',
    reviewCount: '۳۲',
    images: [
      '/images/studios/black-room1-1.jpg',
      '/images/studios/black-room1-2.jpg',
      '/images/studios/black-room1-3.jpg',
    ],
    gradient: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
    amenities: [
      { label: 'آینه',        icon: 'Scan'    },
      { label: 'اسپیکر',     icon: 'Volume2' },
      { label: 'بلک باکس',   icon: 'Square'  },
      { label: 'سیستم تهویه', icon: 'Wind'   },
    ] as Amenity[],
  },
  {
    id: 'black-room-2',
    name: 'اتاق سیاه دو',
    area: '۱۲ متر مربع',
    price: '۱۵۰٬۰۰۰',
    rating: '۴.۷',
    reviewCount: '۲۸',
    images: [
      '/images/studios/black-room2-1.jpg',
      '/images/studios/black-room2-2.jpg',
      '/images/studios/black-room2-3.jpg',
    ],
    gradient: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
    amenities: [
      { label: 'سیستم تهویه', icon: 'Wind'   },
      { label: 'اسپیکر',     icon: 'Volume2' },
      { label: 'بلک باکس',   icon: 'Square'  },
    ] as Amenity[],
  },
]

/* ─── StudioCard ─── */
function StudioCard({ studio }: { studio: typeof studios[number] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const prev = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentIndex((i) => (i === 0 ? studio.images.length - 1 : i - 1))
  }
  const next = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentIndex((i) => (i === studio.images.length - 1 ? 0 : i + 1))
  }

  return (
    <div
      className="group overflow-hidden transition-shadow duration-200 hover:shadow-lg"
      style={{ border: '1px solid #EFEFEF', borderRadius: '8px', background: '#fff' }}
    >
      {/* ─── Slideshow ─── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <div style={{ background: studio.gradient }} className="absolute inset-0" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.images[currentIndex]}
          alt={studio.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />

        {/* دکمه‌های ناوبری */}
        {studio.images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center
                         bg-white/80 hover:bg-white transition-colors duration-150 rounded-full
                         opacity-0 group-hover:opacity-100"
              style={{ width: '28px', height: '28px' }}
              aria-label="قبلی"
            >
              <ChevronRight size={16} className="text-[#171717]" />
            </button>
            <button
              onClick={next}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center
                         bg-white/80 hover:bg-white transition-colors duration-150 rounded-full
                         opacity-0 group-hover:opacity-100"
              style={{ width: '28px', height: '28px' }}
              aria-label="بعدی"
            >
              <ChevronLeft size={16} className="text-[#171717]" />
            </button>
          </>
        )}

        {/* dots */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {studio.images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); setCurrentIndex(i) }}
              className="rounded-full transition-all duration-150"
              style={{
                width: i === currentIndex ? '16px' : '6px',
                height: '6px',
                background: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.55)',
              }}
              aria-label={`تصویر ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ─── اطلاعات ─── */}
      <div style={{ padding: '16px' }}>

        {/* ۱. نام */}
        <p style={{ fontSize: '16px', fontWeight: 800, color: '#171717' }}>
          {studio.name}
        </p>

        {/* ۲. متراژ */}
        <p className="mt-0.5 font-light" style={{ fontSize: '13px', color: '#717171' }}>
          {studio.area}
        </p>

        {/* ۳. قیمت + امتیاز */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1" style={{ fontSize: '13px', color: '#404040' }}>
            <Star size={13} fill="#FFB400" stroke="#FFB400" />
            <span>{studio.rating}</span>
            <span className="text-[#999]">({studio.reviewCount} نظر)</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-black text-[#8B1E1E]" style={{ fontSize: '15px' }}>
              {studio.price}
            </span>
            <span className="font-light text-[#999]" style={{ fontSize: '11px' }}>تومان/ساعت</span>
          </div>
        </div>

        {/* ۴. divider */}
        <hr style={{ borderColor: '#EFEFEF', margin: '12px 0' }} />

        {/* ۵. امکانات */}
        <div className="flex flex-wrap gap-2 mb-4">
          {studio.amenities.map((amenity, idx) => {
            const Icon = iconMap[amenity.icon]
            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#EFEFEF] bg-[#FAFAFA]"
              >
                {Icon && <Icon size={12} className="text-[#8B1E1E] flex-shrink-0" />}
                <span className="text-xs font-light text-[#555] whitespace-nowrap">
                  {amenity.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* ۶. divider */}
        <hr style={{ borderColor: '#EFEFEF', margin: '12px 0' }} />

        {/* ۷. دکمه رزرو */}
        <Link
          href="/booking"
          className="block w-full text-center text-white font-[700] transition-colors duration-200"
          style={{
            background: '#8B1E1E',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#A82828' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#8B1E1E' }}
        >
          رزرو این پلاتو
        </Link>
      </div>
    </div>
  )
}

/* ─── StudiosSection ─── */
export function StudiosSection() {
  return (
    <section className="max-w-container mx-auto px-6 md:px-8 lg:px-12 py-20">
      <div className="mb-10">
        <h2 className="text-xl font-[800] text-neutral-900 mb-2">رزرو پلاتو</h2>
        <p className="text-neutral-500 text-sm">فضاهای مجهز خانه دی برای تمرین، اجرا و کارگاه</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {studios.map((studio) => (
          <StudioCard key={studio.id} studio={studio} />
        ))}
      </div>
    </section>
  )
}
