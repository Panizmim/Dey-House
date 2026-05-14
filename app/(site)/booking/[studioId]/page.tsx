'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Star, MapPin, Grid2x2, X, ChevronLeft, ChevronRight,
  Lightbulb, Monitor, Scan, Wind, Volume2, Square, Wifi,
  Maximize2, Armchair, Layers, PaintBucket,
} from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { faIR } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { toPersianNum, toJalali } from '@/lib/utils'

/* ─── آیکون‌ها ─── */
const iconMap: Record<string, React.ElementType> = {
  Lightbulb, Monitor, Scan, Wind, Volume2, Square, Wifi,
}

/* ─── داده‌ها ─── */
const studiosData = {
  'white-room': {
    id: 'white-room',
    name: 'اتاق سفید',
    area: '۵۰ متر مربع',
    floorType: 'کفپوش',
    wallType: 'نقاشی',
    chairCount: 20,
    pricePerHour: 400000,
    rating: 4.9,
    reviewCount: 47,
    description: `اتاق سفید خانه دی یک فضای چندمنظوره روشن و مینیمال است که برای طیف گسترده‌ای از فعالیت‌های هنری و آموزشی طراحی شده است.

دیوارهای سفید و نورپردازی حرفه‌ای این فضا را برای عکاسی، فیلمبرداری، تمرین رقص و ورکشاپ‌های خلاقانه ایده‌آل می‌کند. سیستم صوتی پیشرفته و ویدیو پروژکتور امکان برگزاری کلاس‌ها و رویدادهای فرهنگی را فراهم می‌آورد.`,
    images: [
      '/images/studios/white-room-1.jpg',
      '/images/studios/white-room-2.jpg',
      '/images/studios/white-room-3.jpg',
    ],
    gradient: 'linear-gradient(135deg, #e8ddd0, #c8b89a)',
    amenities: [
      { label: 'تجهیزات نورپردازی', icon: 'Lightbulb' },
      { label: 'ویدیو پروژکتور',   icon: 'Monitor'   },
      { label: 'آینه تمام‌قد',     icon: 'Scan'       },
      { label: 'سیستم تهویه',      icon: 'Wind'       },
      { label: 'اسپیکر حرفه‌ای',   icon: 'Volume2'    },
      { label: 'اینترنت پرسرعت',   icon: 'Wifi'       },
    ],
    reviews: [
      { id: 1, name: 'سارا محمدی',  avatar: 'س', date: 'اردیبهشت ۱۴۰۴', rating: 5, text: 'فضای خیلی خوبی بود. نورپردازی عالی و تجهیزات کامل. حتماً دوباره رزرو می‌کنم.' },
      { id: 2, name: 'علی رضایی',   avatar: 'ع', date: 'فروردین ۱۴۰۴',  rating: 5, text: 'برای ورکشاپ عکاسی استفاده کردیم. فضا بسیار حرفه‌ای و تمیز بود.' },
      { id: 3, name: 'مریم کریمی',  avatar: 'م', date: 'اسفند ۱۴۰۳',    rating: 4, text: 'کلاس رقص برگزار کردیم. آینه‌ها و کف مناسب بود. پیشنهاد می‌کنم.' },
      { id: 4, name: 'رضا احمدی',   avatar: 'ر', date: 'بهمن ۱۴۰۳',     rating: 5, text: 'برای فیلمبرداری محصول استفاده کردیم. نور طبیعی و مصنوعی هر دو عالی بود.' },
    ],
    location: 'تهران، خانه دی',
  },
  'black-room-1': {
    id: 'black-room-1',
    name: 'اتاق سیاه یک',
    area: '۲۰ متر مربع',
    floorType: 'لمینت',
    wallType: 'نقاشی',
    chairCount: 8,
    pricePerHour: 300000,
    rating: 4.8,
    reviewCount: 32,
    description: `اتاق سیاه یک یک فضای بلک‌باکس کوچک و صمیمی است که برای تمرین‌های تئاتری، اجراهای کوچک و ورکشاپ‌های بازیگری طراحی شده است.

محیط تاریک و کنترل‌شده این فضا تمرکز کامل را ممکن می‌سازد. سیستم صوتی و آینه‌های موجود این اتاق را به انتخابی ایده‌آل برای گروه‌های کوچک تبدیل کرده است.`,
    images: [
      '/images/studios/black-room1-1.jpg',
      '/images/studios/black-room1-2.jpg',
      '/images/studios/black-room1-3.jpg',
    ],
    gradient: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
    amenities: [
      { label: 'آینه تمام‌قد',   icon: 'Scan'    },
      { label: 'اسپیکر حرفه‌ای', icon: 'Volume2' },
      { label: 'بلک باکس',       icon: 'Square'  },
      { label: 'سیستم تهویه',    icon: 'Wind'    },
    ],
    reviews: [
      { id: 1, name: 'نیلوفر حسینی', avatar: 'ن', date: 'اردیبهشت ۱۴۰۴', rating: 5, text: 'برای تمرین تئاتر عالی بود. فضای بلک‌باکس دقیقاً همان چیزی بود که نیاز داشتیم.' },
      { id: 2, name: 'امیر صادقی',   avatar: 'ا', date: 'فروردین ۱۴۰۴',  rating: 4, text: 'صدای خوبی داشت و کاملاً ایزوله بود. پیشنهاد می‌کنم.' },
    ],
    location: 'تهران، خانه دی',
  },
  'black-room-2': {
    id: 'black-room-2',
    name: 'اتاق سیاه دو',
    area: '۱۲ متر مربع',
    floorType: 'لمینت',
    wallType: 'نقاشی',
    chairCount: 4,
    pricePerHour: 150000,
    rating: 4.7,
    reviewCount: 28,
    description: `اتاق سیاه دو کوچک‌ترین فضای خانه دی است که برای تمرین‌های فردی، جلسات خصوصی و ورکشاپ‌های کوچک مناسب است.

این فضای صمیمی با تجهیزات صوتی و سیستم تهویه مناسب، محیطی آرام و متمرکز برای کارهای خلاقانه فراهم می‌کند.`,
    images: [
      '/images/studios/black-room2-1.jpg',
      '/images/studios/black-room2-2.jpg',
      '/images/studios/black-room2-3.jpg',
    ],
    gradient: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
    amenities: [
      { label: 'سیستم تهویه', icon: 'Wind'    },
      { label: 'اسپیکر',      icon: 'Volume2' },
      { label: 'بلک باکس',    icon: 'Square'  },
    ],
    reviews: [
      { id: 1, name: 'فاطمه موسوی', avatar: 'ف', date: 'اردیبهشت ۱۴۰۴', rating: 5, text: 'برای تمرین انفرادی عالی بود. فضای کوچک و صمیمی.' },
    ],
    location: 'تهران، خانه دی',
  },
} as const

type StudioId = keyof typeof studiosData

const TIME_SLOTS = ['۹:۰۰','۱۰:۰۰','۱۱:۰۰','۱۲:۰۰','۱۴:۰۰','۱۵:۰۰','۱۶:۰۰','۱۷:۰۰','۱۸:۰۰','۱۹:۰۰','۲۰:۰۰']

/* ─── ستاره‌ها ─── */
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={size} fill={i <= rating ? '#FFB400' : 'none'} color={i <= rating ? '#FFB400' : '#D1D5DB'} />
      ))}
    </span>
  )
}

/* ─── صفحه ─── */
export default function StudioDetailPage({ params }: { params: { studioId: string } }) {
  const studio = studiosData[params.studioId as StudioId]
  if (!studio) notFound()

  const [descExpanded, setDescExpanded] = useState(false)
  const [step, setStep]                 = useState<'idle' | 'date' | 'time'>('idle')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [startTime, setStartTime]       = useState<string | null>(null)
  const [endTime, setEndTime]           = useState<string | null>(null)
  const [lightbox, setLightbox]         = useState<{ open: boolean; index: number }>({ open: false, index: 0 })

  /* navbar همیشه scrolled */
  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'pdp')
    return () => document.documentElement.removeAttribute('data-page')
  }, [])

  /* body overflow برای lightbox */
  useEffect(() => {
    document.body.style.overflow = lightbox.open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox.open])

  /* keyboard navigation */
  useEffect(() => {
    if (!lightbox.open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && lightbox.index > 0)
        setLightbox((p) => ({ ...p, index: p.index - 1 }))
      if (e.key === 'ArrowLeft' && lightbox.index < studio.images.length - 1)
        setLightbox((p) => ({ ...p, index: p.index + 1 }))
      if (e.key === 'Escape')
        setLightbox({ open: false, index: 0 })
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, studio.images.length])

  const startIdx   = startTime ? TIME_SLOTS.indexOf(startTime) : -1
  const endIdx     = endTime   ? TIME_SLOTS.indexOf(endTime)   : -1
  const hours      = startIdx >= 0 && endIdx > startIdx ? endIdx - startIdx : 0
  const totalPrice = hours * studio.pricePerHour

  const formatDate = (d: Date) => toJalali(d)

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>

      {/* ─── breadcrumb (بالای گالری — navbar روی سفید) ─── */}
      <div className="bg-white border-b border-[#EFEFEF]" style={{ paddingTop: 68 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <nav className="flex items-center gap-1 text-sm text-[#717171] py-4">
            <Link href="/" className="hover:text-[#171717] transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
              خانه
            </Link>
            <ChevronLeft size={14} color="#C0C0C0" />
            <Link href="/#studios" className="hover:text-[#171717] transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
              رزرو فضا
            </Link>
            <ChevronLeft size={14} color="#C0C0C0" />
            <span style={{ color: '#171717', fontWeight: 600 }}>{studio.name}</span>
          </nav>
        </div>
      </div>

      {/* ─── گالری تصاویر ─── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 0' }}>
        <div style={{
          position: 'relative', display: 'grid',
          gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
          gap: 8, height: 480, borderRadius: 12, overflow: 'hidden',
        }}>
          {/* تصویر بزرگ */}
          <div
            style={{ gridRow: 'span 2', position: 'relative', background: studio.gradient, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => setLightbox({ open: true, index: 0 })}
            title="برای بزرگنمایی کلیک کنید"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={studio.images[0]} alt={studio.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
          {/* تصویر ۲ */}
          <div
            style={{ position: 'relative', background: studio.gradient, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => setLightbox({ open: true, index: 1 })}
            title="برای بزرگنمایی کلیک کنید"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={studio.images[1] ?? studio.images[0]} alt={studio.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
          {/* تصویر ۳ */}
          <div
            style={{ position: 'relative', background: studio.gradient, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => setLightbox({ open: true, index: 2 })}
            title="برای بزرگنمایی کلیک کنید"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={studio.images[2] ?? studio.images[0]} alt={studio.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>

          {/* دکمه نمایش همه */}
          <button
            onClick={() => setLightbox({ open: true, index: 0 })}
            style={{
              position: 'absolute', bottom: 16, left: 16,
              background: 'white', border: '1px solid #E5E5E5',
              borderRadius: 8, padding: '8px 16px',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Grid2x2 size={14} />
            نمایش همه تصاویر
          </button>
        </div>
      </div>

      {/* ─── layout اصلی ─── */}
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '32px 32px 80px',
        display: 'grid', gridTemplateColumns: '1fr 380px', gap: 64, alignItems: 'start',
      }}>

        {/* ══════ ستون راست — محتوا ══════ */}
        <div>

          {/* هدر */}
          <div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid #EFEFEF' }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#171717', marginBottom: 8 }}>
              {studio.name}
            </h1>

            {/* اطلاعات متراژ، صندلی، کف، دیوار */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              <span className="text-sm text-[#717171] font-light flex items-center gap-1">
                <Maximize2 size={13} />
                {studio.area}
              </span>
              <span className="text-[#D0D0D0]">·</span>
              <span className="text-sm text-[#717171] font-light flex items-center gap-1">
                <Armchair size={13} />
                {toPersianNum(studio.chairCount)} صندلی
              </span>
              <span className="text-[#D0D0D0]">·</span>
              <span className="text-sm text-[#717171] font-light flex items-center gap-1">
                <Layers size={13} />
                کف: {studio.floorType}
              </span>
              <span className="text-[#D0D0D0]">·</span>
              <span className="text-sm text-[#717171] font-light flex items-center gap-1">
                <PaintBucket size={13} />
                دیوار: {studio.wallType}
              </span>
            </div>

            {/* امتیاز */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, marginTop: 12 }}>
              <Stars rating={Math.round(studio.rating)} size={14} />
              <span style={{ fontWeight: 700, color: '#171717' }}>{studio.rating.toLocaleString('fa-IR')}</span>
              <span style={{ color: '#717171' }}>({studio.reviewCount.toLocaleString('fa-IR')} نظر)</span>
            </div>
          </div>

          {/* امکانات */}
          <div style={{ paddingBottom: 32, marginBottom: 32, borderBottom: '1px solid #EFEFEF' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#171717', marginBottom: 16 }}>امکانات فضا</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {studio.amenities.map((a, i) => {
                const Icon = iconMap[a.icon]
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid #EFEFEF', borderRadius: 8 }}>
                    {Icon && <Icon size={18} color="#404040" />}
                    <span style={{ fontSize: 14, color: '#171717' }}>{a.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* توضیحات */}
          <div style={{ paddingBottom: 32, marginBottom: 32, borderBottom: '1px solid #EFEFEF' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#171717', marginBottom: 16 }}>درباره این فضا</h2>
            <p
              style={{
                fontSize: 15, color: '#404040', lineHeight: 2, whiteSpace: 'pre-line',
                overflow: 'hidden', display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: descExpanded ? 'unset' : 4,
              } as React.CSSProperties}
            >
              {studio.description}
            </p>
            <button
              onClick={() => setDescExpanded((v) => !v)}
              style={{ marginTop: 12, color: '#8B1E1E', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              {descExpanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
            </button>
          </div>

          {/* نظرات */}
          <div style={{ paddingBottom: 32, marginBottom: 32, borderBottom: '1px solid #EFEFEF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star size={22} fill="#171717" color="#171717" />
              <span style={{ fontSize: 20, fontWeight: 900, color: '#171717' }}>
                {studio.rating.toLocaleString('fa-IR')} · {studio.reviewCount.toLocaleString('fa-IR')} نظر
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
              {studio.reviews.map((r) => (
                <div key={r.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#8B1E1E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                      {r.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#171717' }}>{r.name}</p>
                      <p style={{ fontSize: 12, color: '#717171' }}>{r.date}</p>
                    </div>
                  </div>
                  <Stars rating={r.rating} size={12} />
                  <p style={{ fontSize: 14, color: '#404040', lineHeight: 1.7, marginTop: 8, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 } as React.CSSProperties}>
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* نقشه */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#171717', marginBottom: 16 }}>موقعیت مکانی</h2>
            <div style={{ height: 300, background: '#F5F5F5', border: '1px solid #EFEFEF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <MapPin size={32} color="#8B1E1E" />
              <span style={{ fontSize: 14, color: '#717171' }}>تهران، خانه دی</span>
            </div>
            <p style={{ fontSize: 14, color: '#404040', marginTop: 12 }}>{studio.location}</p>
          </div>
        </div>

        {/* ══════ ستون چپ — کارت رزرو sticky ══════ */}
        <div style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
          <div style={{ border: '1px solid #E5E5E5', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            {/* قیمت */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#171717' }}>
                  {studio.pricePerHour.toLocaleString('fa-IR')} تومان
                </span>
                <span style={{ fontSize: 14, color: '#717171', fontWeight: 300 }}>/ ساعت</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Star size={12} fill="#FFB400" color="#FFB400" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#171717' }}>{studio.rating.toLocaleString('fa-IR')}</span>
                <span style={{ fontSize: 13, color: '#717171' }}>({studio.reviewCount.toLocaleString('fa-IR')} نظر)</span>
              </div>
            </div>

            {/* فرم تاریخ و ساعت */}
            <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
              <button
                onClick={() => setStep('date')}
                style={{ width: '100%', padding: '12px 14px', textAlign: 'right', background: 'white', border: 'none', borderBottom: '1px solid #E5E5E5', cursor: 'pointer', display: 'block' }}
              >
                <p style={{ fontSize: 10, fontWeight: 700, color: '#171717', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>تاریخ</p>
                <p style={{ fontSize: 14, color: selectedDate ? '#171717' : '#9CA3AF' }}>
                  {selectedDate ? formatDate(selectedDate) : 'انتخاب کنید'}
                </p>
              </button>
              <button
                onClick={() => {
                  if (!selectedDate) { toast.error('ابتدا تاریخ را انتخاب کنید'); return }
                  setStep('time')
                }}
                style={{ width: '100%', padding: '12px 14px', textAlign: 'right', background: 'white', border: 'none', cursor: 'pointer', display: 'block' }}
              >
                <p style={{ fontSize: 10, fontWeight: 700, color: '#171717', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>ساعت</p>
                <p style={{ fontSize: 14, color: (startTime && endTime) ? '#171717' : '#9CA3AF' }}>
                  {(startTime && endTime) ? `${startTime} تا ${endTime}` : 'انتخاب کنید'}
                </p>
              </button>
            </div>

            <button
              style={{ width: '100%', padding: 14, borderRadius: 8, border: 'none', fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer', background: (selectedDate && startTime && endTime) ? '#171717' : '#8B1E1E', transition: 'background 200ms' }}
            >
              {(selectedDate && startTime && endTime) ? 'ادامه و پرداخت' : 'رزرو فضا'}
            </button>

            <p style={{ fontSize: 12, color: '#717171', textAlign: 'center', marginTop: 12 }}>
              هزینه‌ای دریافت نمی‌شود تا تایید نهایی
            </p>

            {hours > 0 && (
              <div style={{ borderTop: '1px solid #EFEFEF', marginTop: 16, paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#404040', marginBottom: 8 }}>
                  <span>{studio.pricePerHour.toLocaleString('fa-IR')} × {hours.toLocaleString('fa-IR')} ساعت</span>
                  <span>{totalPrice.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: '#171717' }}>
                  <span>جمع کل</span>
                  <span>{totalPrice.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════ Popup تقویم ══════ */}
      {step === 'date' && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)' }} onClick={() => setStep('idle')} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', borderRadius: 16, padding: 24, width: 360, zIndex: 101, boxShadow: '0 16px 48px rgba(0,0,0,0.16)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#171717' }}>انتخاب تاریخ</h3>
              <button onClick={() => setStep('idle')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={20} color="#717171" />
              </button>
            </div>
            <div dir="rtl" style={{ display: 'flex', justifyContent: 'center' }}>
              <DayPicker
                mode="single"
                selected={selectedDate ?? undefined}
                onSelect={(d) => { if (d) { setSelectedDate(d); setStep('idle') } }}
                locale={faIR}
                disabled={{ before: new Date() }}
                modifiersStyles={{
                  selected: { background: '#8B1E1E', color: 'white', borderRadius: 8 },
                  today: { fontWeight: 700, color: '#8B1E1E' },
                }}
                style={{ fontFamily: 'YekanBakh, Tahoma, sans-serif' }}
              />
            </div>
            <button
              onClick={() => setStep('idle')}
              disabled={!selectedDate}
              style={{ width: '100%', marginTop: 12, padding: '12px', borderRadius: 8, border: 'none', cursor: selectedDate ? 'pointer' : 'not-allowed', background: selectedDate ? '#8B1E1E' : '#E5E5E5', color: selectedDate ? 'white' : '#9CA3AF', fontSize: 14, fontWeight: 700 }}
            >
              تایید تاریخ
            </button>
          </div>
        </>
      )}

      {/* ══════ Popup ساعت ══════ */}
      {step === 'time' && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)' }} onClick={() => setStep('idle')} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', borderRadius: 16, padding: 24, width: 440, zIndex: 101, boxShadow: '0 16px 48px rgba(0,0,0,0.16)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#171717' }}>انتخاب ساعت</h3>
              <button onClick={() => setStep('idle')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={20} color="#717171" />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#171717', marginBottom: 12 }}>ساعت شروع</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => { setStartTime(slot); setEndTime(null) }}
                      style={{ padding: '10px 14px', border: `1px solid ${startTime === slot ? '#8B1E1E' : '#E5E5E5'}`, borderRadius: 8, fontSize: 14, cursor: 'pointer', textAlign: 'center', background: startTime === slot ? '#8B1E1E' : 'white', color: startTime === slot ? 'white' : '#171717', transition: 'all 0.15s' }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#171717', marginBottom: 12 }}>ساعت پایان</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {TIME_SLOTS.map((slot) => {
                    const si = startTime ? TIME_SLOTS.indexOf(startTime) : -1
                    const di = TIME_SLOTS.indexOf(slot)
                    const disabled = si === -1 || di <= si
                    return (
                      <button
                        key={slot}
                        onClick={() => { if (!disabled) setEndTime(slot) }}
                        style={{ padding: '10px 14px', border: `1px solid ${endTime === slot ? '#8B1E1E' : '#E5E5E5'}`, borderRadius: 8, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'center', background: endTime === slot ? '#8B1E1E' : 'white', color: endTime === slot ? 'white' : '#171717', opacity: disabled ? 0.3 : 1, transition: 'all 0.15s' }}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <button
              onClick={() => { if (startTime && endTime) setStep('idle') }}
              disabled={!startTime || !endTime}
              style={{ width: '100%', marginTop: 20, padding: '12px', borderRadius: 8, border: 'none', cursor: (startTime && endTime) ? 'pointer' : 'not-allowed', background: (startTime && endTime) ? '#8B1E1E' : '#E5E5E5', color: (startTime && endTime) ? 'white' : '#9CA3AF', fontSize: 14, fontWeight: 700 }}
            >
              تایید ساعت
            </button>
          </div>
        </>
      )}

      {/* ══════ Lightbox ══════ */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox({ open: false, index: 0 })}
        >
          {/* دکمه بستن */}
          <button
            className="absolute top-5 left-5 text-white/70 hover:text-white bg-white/10 rounded-full p-2 transition-all"
            onClick={() => setLightbox({ open: false, index: 0 })}
          >
            <X size={24} />
          </button>

          {/* شماره تصویر */}
          <div className="absolute top-5 right-5 text-white/60 text-sm font-light">
            {toPersianNum(lightbox.index + 1)} / {toPersianNum(studio.images.length)}
          </div>

          {/* تصویر */}
          <div
            className="relative w-full max-w-5xl max-h-[85vh] mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={studio.images[lightbox.index]}
              alt={studio.name}
              className="w-full h-full object-contain max-h-[85vh] rounded-lg"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div className="absolute inset-0 -z-10 rounded-lg" style={{ background: studio.gradient }} />
          </div>

          {/* قبلی */}
          {lightbox.index > 0 && (
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all"
              onClick={(e) => { e.stopPropagation(); setLightbox((p) => ({ ...p, index: p.index - 1 })) }}
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* بعدی */}
          {lightbox.index < studio.images.length - 1 && (
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all"
              onClick={(e) => { e.stopPropagation(); setLightbox((p) => ({ ...p, index: p.index + 1 })) }}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {studio.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightbox((p) => ({ ...p, index: i })) }}
                className={`rounded-full transition-all ${i === lightbox.index ? 'bg-white w-4 h-2' : 'bg-white/40 w-2 h-2'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
