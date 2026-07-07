'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin, Grid2x2, X, ChevronLeft, ChevronRight,
  Lightbulb, Monitor, Scan, Wind, Volume2, Square, Wifi,
  Maximize2, Armchair, Layers, PaintBucket, Calendar,
  MessageCircle, CheckCircle, ExternalLink,
} from '@/components/ui/icons'
import toast from 'react-hot-toast'
import DateTimePickerModal from '@/components/ui/DateTimePickerModal'
import { toPersianNum } from '@/lib/utils'
import { PERSIAN_MONTHS, toJalali, toPersian, TIME_SLOTS } from '@/lib/jalali'

/* ─── آیکون‌ها ─── */
const iconMap: Record<string, React.ElementType> = {
  Lightbulb, Monitor, Scan, Wind, Volume2, Square, Wifi,
}

const THEATER_BOOKING_URL = 'https://pelatoo.com/center/%D8%AE%D8%A7%D9%86%D9%87-%D8%AF%DB%8C'

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
    description: `این فضا یک وایت باکس چند منظوره برای کاربرد هایی همچون تمرین تئاتر، برگزاری کلاس های یوگا و مدیتیشن، نمایشگاه آثار هنری و تجسمی، تمرین موسیقی و آواز و رقص می باشد.`,
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
      { label: 'اکوستیک',           icon: 'Volume2'    },
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
    description: `این فضا یک بلک باکس ۲۰ متر مربعی با کاربرد هایی همچون تمرین تئاتر، برگزاری کلاس رقص و موسیقی می باشد.`,
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
      { label: 'اکوستیک',        icon: 'Volume2' },
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
    description: `این فضا یک بلک باکس ۱۲ متر مربعی با کاربرد هایی همچون تمرین تئاتر، نمایشنامه خوانی و تمرین موسیقی می باشد.`,
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
      { label: 'اکوستیک',     icon: 'Volume2' },
    ],
    location: 'تهران، خانه دی',
  },
} as const

type StudioId = keyof typeof studiosData


/* ─── صفحه ─── */
export default function StudioDetailPage({ params }: { params: { studioId: string } }) {
  const studioStatic = studiosData[params.studioId as StudioId]
  if (!studioStatic) notFound()

  type LiveStudio = { id: string; name: string; capacity: number; pricePerHour: number; images: string[] }
  const [liveRows, setLiveRows] = useState<LiveStudio[] | null>(null)

  useEffect(() => {
    fetch('/api/studios')
      .then((res) => res.json())
      .then((rows: LiveStudio[]) => { if (Array.isArray(rows)) setLiveRows(rows) })
      .catch(() => {})
  }, [])

  const liveData = liveRows?.find((s) => s.id === studioStatic.id)
  const studio = liveData ? {
    ...studioStatic,
    name:         liveData.name,
    pricePerHour: liveData.pricePerHour,
    chairCount:   liveData.capacity,
    images:       liveData.images.length > 0 ? liveData.images : studioStatic.images,
  } : studioStatic

  const [showPicker, setShowPicker]               = useState(false)
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedEndDate, setSelectedEndDate]     = useState<Date | null>(null)
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null)
  const [selectedEndTime, setSelectedEndTime]     = useState<string | null>(null)
  const [isMultiDay, setIsMultiDay]               = useState(false)
  const [lightbox, setLightbox]                   = useState<{ open: boolean; index: number }>({ open: false, index: 0 })
  const [usageType, setUsageType]                 = useState<'theater' | 'other' | null>(null)
  const [loading, setLoading]                     = useState(false)
  const [showSuccess, setShowSuccess]             = useState(false)
  const [showUsageSheet, setShowUsageSheet]       = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const galleryScrollRef = useRef<HTMLDivElement>(null)

  const resetSelection = () => {
    setSelectedStartDate(null)
    setSelectedEndDate(null)
    setSelectedStartTime(null)
    setSelectedEndTime(null)
    setIsMultiDay(false)
  }

  const handleBooking = () => {
    if (!selectedStartDate || !selectedStartTime || !selectedEndTime) return
    toast.success('در حال انتقال به درگاه پرداخت...')
  }

  const handleContactRequest = async () => {
    if (!selectedStartDate) return
    setLoading(true)
    try {
      const j = toJalali(selectedStartDate)
      const dateStr = `${toPersian(j.jd)} ${PERSIAN_MONTHS[j.jm - 1]} ${toPersian(j.jy)}`
      const endPart = selectedEndDate
        ? (() => { const je = toJalali(selectedEndDate); return ` تا ${toPersian(je.jd)} ${PERSIAN_MONTHS[je.jm - 1]}` })()
        : ''

      const res = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'کاربر مهمان',
          email: '',
          phone: '',
          usageType: 'سایر موارد',
          message: `درخواست رزرو ${studio.name} — تاریخ: ${dateStr}${endPart}`,
        }),
      })
      if (!res.ok) throw new Error()
      setShowSuccess(true)
    } catch {
      toast.error('خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.')
    } finally {
      setLoading(false)
    }
  }

  function handleGalleryScroll() {
    const el = galleryScrollRef.current
    if (!el || el.clientWidth === 0) return
    const scrolled = Math.abs(el.scrollLeft)
    const index = Math.round(scrolled / el.clientWidth)
    setCurrentImageIndex(Math.min(index, studio.images.length - 1))
  }

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

  const startIdx   = selectedStartTime ? TIME_SLOTS.indexOf(selectedStartTime) : -1
  const endIdx     = selectedEndTime   ? TIME_SLOTS.indexOf(selectedEndTime)   : -1
  const hours      = !isMultiDay && startIdx >= 0 && endIdx > startIdx ? endIdx - startIdx : 0
  const totalPrice = hours * studio.pricePerHour

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>

      {/* ══════ موبایل ══════ */}
      <div className="md:hidden">

        {/* ─── گالری ─── */}
        <div className="relative w-full overflow-hidden" style={{ height: '70vw' }}>
          <div
            ref={galleryScrollRef}
            dir="ltr"
            className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' } as React.CSSProperties}
            onScroll={handleGalleryScroll}
          >
            {studio.images.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-full h-full snap-center relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={studio.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                <div className="absolute inset-0 -z-10" style={{ background: studio.gradient }} />
              </div>
            ))}
          </div>
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white font-bold" style={{ fontSize: 12, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
            {toPersian(currentImageIndex + 1)} / {toPersian(studio.images.length)}
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {studio.images.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300" style={{ width: i === currentImageIndex ? '16px' : '6px', height: '6px', background: i === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)' }} />
            ))}
          </div>
        </div>

        {/* نام + متراژ */}
        <div className="px-4 pt-5 pb-4 border-b border-[#F0F0F0] text-center">
          <h1 className="text-[24px] font-black text-[#171717] mb-2">{studio.name}</h1>
          <p className="text-[15px] text-[#717171] font-light">{studio.area}</p>
        </div>

        {/* ─── تغییر ۴: مشخصات کلی با آیکون ─── */}
        <div className="px-4 py-5 border-b border-[#F0F0F0]">
          <h2 className="text-[19px] font-black text-[#171717] mb-4">مشخصات کلی فضا</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Armchair size={20} color="#717171" style={{ flexShrink: 0 }} />
              <span className="text-[16px] text-[#404040] font-light">{toPersian(studio.chairCount)} صندلی</span>
            </div>
            <div className="flex items-center gap-3">
              <Layers size={20} color="#717171" style={{ flexShrink: 0 }} />
              <span className="text-[16px] text-[#404040] font-light">جنس کف: {studio.floorType}</span>
            </div>
            <div className="flex items-center gap-3">
              <PaintBucket size={20} color="#717171" style={{ flexShrink: 0 }} />
              <span className="text-[16px] text-[#404040] font-light">جنس دیوار: {studio.wallType}</span>
            </div>
          </div>
        </div>

        {/* ─── توضیحات ─── */}
        <div className="px-4 py-5 border-b border-[#F0F0F0]">
          <h2 className="text-[19px] font-black text-[#171717] mb-3">توضیحات</h2>
          <p className="text-[16px] text-[#404040] font-light leading-loose" style={{ whiteSpace: 'pre-line' }}>
            {studio.description}
          </p>
        </div>

        {/* ─── تغییر ۲: امکانات زیر هم بدون استروک ─── */}
        <div className="px-4 py-5 border-b border-[#F0F0F0]">
          <h2 className="text-[19px] font-black text-[#171717] mb-4">امکانات</h2>
          <div className="flex flex-col gap-4">
            {studio.amenities.map((amenity, i) => {
              const AmenityIcon = iconMap[amenity.icon]
              return (
                <div key={i} className="flex items-center gap-3">
                  {AmenityIcon && <AmenityIcon size={20} color="#717171" style={{ flexShrink: 0 }} />}
                  <span className="text-[16px] text-[#404040] font-light">{amenity.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ─── تاریخ رزرو ─── */}
        <div className="px-4 py-5 border-b border-[#F0F0F0]">
          <h2 className="text-[19px] font-black text-[#171717] mb-3">تاریخ رزرو</h2>
          <button
            onClick={() => { if (!usageType) setShowUsageSheet(true); else setShowPicker(true) }}
            className="w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all active:scale-[0.99]"
            style={{ border: '1.5px solid #E5E5E5', background: 'white' }}
            onTouchStart={(e) => { e.currentTarget.style.borderColor = '#801A00' }}
            onTouchEnd={(e) => { e.currentTarget.style.borderColor = '#E5E5E5' }}
          >
            <div className="text-right">
              {selectedStartDate ? (
                <>
                  <p className="text-[13px] font-bold text-[#801A00] mb-0.5">تاریخ انتخاب‌شده</p>
                  <p className="text-[16px] font-bold text-[#171717]">
                    {(() => { const j = toJalali(selectedStartDate); return `${toPersian(j.jd)} ${PERSIAN_MONTHS[j.jm - 1]}` })()}
                    {selectedStartTime && ` — ${selectedStartTime}`}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[13px] font-bold text-[#B0B0B0] mb-0.5 uppercase tracking-wide">تاریخ و ساعت</p>
                  <p className="text-[16px] text-[#B0B0B0]">انتخاب کنید</p>
                </>
              )}
            </div>
            <Calendar size={20} color={selectedStartDate ? '#801A00' : '#C0C0C0'} style={{ flexShrink: 0 }} />
          </button>
        </div>

        {/* ─── موقعیت مکانی ─── */}
        <div className="px-4 py-5 border-b border-[#F0F0F0]">
          <h2 className="text-[19px] font-black text-[#171717] mb-3">موقعیت مکانی</h2>
          <a href="https://nshn.ir/_bvk7KWxiB9q" target="_blank" rel="noopener noreferrer" className="block group" style={{ textDecoration: 'none', borderRadius: 12, overflow: 'hidden', height: 180 }}>
            <div style={{ height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/map.png" alt="نقشه خانه دی" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, background: '#801A00', color: 'white', padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                <MapPin size={12} color="white" />
                باز کردن در نشان
              </div>
            </div>
          </a>
        </div>

        {/* ─── قوانین کنسلی (موبایل) ─── */}
        <div className="px-4 py-5 border-b border-[#F0F0F0]">
          <h2 className="text-[19px] font-black text-[#171717] mb-4">قوانین کنسلی</h2>
          <div className="flex flex-col gap-3">
            {[
              { range: 'بیش از ۴۸ ساعت قبل از رزرو', refund: 'استرداد کامل', color: '#2F9E44', bg: '#EBFBEE' },
              { range: '۲۴ تا ۴۸ ساعت قبل از رزرو',  refund: 'استرداد ۵۰٪',  color: '#E67700', bg: '#FFF9DB' },
              { range: 'کمتر از ۲۴ ساعت قبل از رزرو', refund: 'بدون استرداد', color: '#C92A2A', bg: '#FFF0F0' },
            ].map(({ range, refund, color, bg }) => (
              <div key={range} className="flex items-center justify-between gap-3 p-3 rounded-xl" style={{ background: bg }}>
                <p className="text-[14px] text-[#404040] font-light leading-snug">{range}</p>
                <span className="text-[13px] font-bold flex-shrink-0" style={{ color }}>{refund}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-[#A0A0A0] font-light mt-4 leading-relaxed">
            استرداد وجه ظرف ۷۲ ساعت کاری از طریق روش پرداخت اولیه انجام می‌شود.
          </p>
        </div>

        {/* ─── تغییر ۵: فضاهای دیگر — دو کارت کنار هم ─── */}
        <div className="px-4 py-5 mb-28">
          <h2 className="text-[19px] font-black text-[#171717] mb-4">فضاهای دیگر</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(studiosData).filter(s => s.id !== studio.id).map((otherStatic) => {
              const otherLive = liveRows?.find((s) => s.id === otherStatic.id)
              const other = otherLive ? {
                ...otherStatic,
                name:         otherLive.name,
                pricePerHour: otherLive.pricePerHour,
                chairCount:   otherLive.capacity,
                images:       otherLive.images.length > 0 ? otherLive.images : otherStatic.images,
              } : otherStatic
              return (
              <Link key={other.id} href={`/booking/${other.id}`} style={{ textDecoration: 'none' }}>
                <div className="border border-[#EFEFEF] rounded-xl overflow-hidden" style={{ transition: 'box-shadow 200ms' }}>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={other.images[0]} alt={other.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    <div className="absolute inset-0 -z-10" style={{ background: other.gradient }} />
                  </div>
                  <div className="p-3">
                    <p className="text-[15px] font-black text-[#171717] mb-1 leading-tight" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                      {other.name}
                    </p>
                    <p className="text-[12px] text-[#717171] font-light mb-2">
                      {other.area} · {toPersian(other.chairCount)} صندلی
                    </p>
                    <p className="text-[13px] font-bold text-[#801A00]">
                      {toPersian(other.pricePerHour.toLocaleString('fa-IR'))}
                      <span className="text-[11px] font-light text-[#A0A0A0] mr-1">ت/ساعت</span>
                    </p>
                  </div>
                </div>
              </Link>
              )
            })}
          </div>
        </div>

        {/* ─── sticky bar ─── */}
        <div
          className="fixed bottom-0 right-0 left-0 z-50 bg-white border-t border-[#EFEFEF] px-4 flex items-center justify-between gap-3"
          style={{ paddingTop: 14, paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
        >
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[13px] text-[#404040] font-light">شروع از:</span>
              <span className="text-[19px] font-black text-[#171717]">
                {toPersian(studio.pricePerHour.toLocaleString('fa-IR'))}
              </span>
              <span className="text-[19px] font-black text-[#171717]">تومان</span>
              <span className="text-[12px] text-[#404040] font-light">/ساعت</span>
            </div>
            {selectedStartDate && (
              <button onClick={() => setShowPicker(true)} className="text-[12px] text-[#801A00] font-bold">
                ویرایش تاریخ ←
              </button>
            )}
          </div>
          <button
            onClick={() => {
              if (!usageType) setShowUsageSheet(true)
              else if (!selectedStartDate) setShowPicker(true)
              else if (usageType === 'theater') handleBooking()
              else handleContactRequest()
            }}
            className="px-7 py-3 rounded-xl text-white font-bold text-[16px] transition-all active:scale-[0.97] flex-shrink-0"
            style={{ background: '#801A00' }}
          >
            {!usageType ? 'رزرو' : !selectedStartDate ? 'انتخاب تاریخ' : usageType === 'theater' ? 'پرداخت' : 'ثبت درخواست'}
          </button>
        </div>

        {/* ─── bottom sheet انتخاب نوع ─── */}
        {showUsageSheet && (
          <>
            <div className="fixed inset-0 z-[90] bg-black/40" onClick={() => setShowUsageSheet(false)} />
            <div className="fixed bottom-0 right-0 left-0 z-[100] bg-white rounded-t-2xl px-5 pt-5" style={{ paddingBottom: 'env(safe-area-inset-bottom, 32px)' }}>
              <div className="w-10 h-1 bg-[#E0E0E0] rounded-full mx-auto mb-5" />
              <h3 className="text-[19px] font-black text-[#171717] mb-4 text-right">نوع کاربری را انتخاب کنید</h3>
              <div className="flex flex-col gap-2 mb-4">
                <a
                  href={THEATER_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-[#EFEFEF] bg-white transition-all duration-200 text-right"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex-1 text-right">
                    <p className="text-[16px] font-bold text-[#171717]">تمرین تئاتر</p>
                    <p className="text-[14px] text-[#A0A0A0] font-light mt-0.5">رزرو آنلاین با پرداخت مستقیم</p>
                  </div>
                  <ExternalLink size={18} className="flex-shrink-0 mr-3" style={{ color: '#A0A0A0' }} />
                </a>
                <button
                  onClick={() => { setUsageType('other'); resetSelection() }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-right ${usageType === 'other' ? 'border-[#801A00] bg-[#FDF8F8]' : 'border-[#EFEFEF] bg-white'}`}
                >
                  <div className="flex-1 text-right">
                    <p className={`text-[16px] font-bold ${usageType === 'other' ? 'text-[#801A00]' : 'text-[#171717]'}`}>سایر موارد</p>
                    <p className="text-[14px] text-[#A0A0A0] font-light mt-0.5">ورکشاپ، عکاسی، فیلمبرداری، یوگا و...</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-3 transition-all ${usageType === 'other' ? 'border-[#801A00] bg-[#801A00]' : 'border-[#D0D0D0] bg-white'}`}>
                    {usageType === 'other' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              </div>
              <button
                onClick={() => { setShowUsageSheet(false); if (usageType) setShowPicker(true) }}
                disabled={!usageType}
                className="w-full py-3.5 rounded-xl text-white font-bold text-[16px] disabled:opacity-40 mb-4"
                style={{ background: '#801A00' }}
              >
                ادامه
              </button>
            </div>
          </>
        )}

      </div>
      {/* ══════ END موبایل ══════ */}

      {/* ══════ دسکتاپ ══════ */}
      <div className="hidden md:block">

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
                } as React.CSSProperties}
              >
                {studio.description}
              </p>
            </div>

            {/* نقشه */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#171717', marginBottom: 16 }}>موقعیت مکانی</h2>
              <a
                href="https://nshn.ir/_bvk7KWxiB9q"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textDecoration: 'none' }}
              >
                <div className="group" style={{
                  height: 260, borderRadius: 12, border: '1px solid #E0E0E0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  transition: 'border-color 200ms, box-shadow 200ms',
                }}
                  onMouseEnter={(e) => {
                    const t = e.currentTarget as HTMLDivElement
                    t.style.borderColor = '#801A00'
                    t.style.boxShadow = '0 4px 20px rgba(139,30,30,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    const t = e.currentTarget as HTMLDivElement
                    t.style.borderColor = '#E0E0E0'
                    t.style.boxShadow = 'none'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/map.png" alt="نقشه خانه دی" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, background: '#801A00', color: 'white', padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                    <MapPin size={12} color="white" />
                    باز کردن در نشان
                  </div>
                </div>
              </a>

              <div className="flex items-start gap-3 mt-4">
                <MapPin size={18} color="#801A00" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="text-[13px] font-bold text-[#171717] mb-1">خانه دی</p>
                  <p className="text-[13px] text-[#717171] font-light leading-relaxed">
                    تهران — برای مسیریابی روی نقشه کلیک کنید
                  </p>
                  <a
                    href="https://nshn.ir/_bvk7KWxiB9q"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-[12px] font-bold hover:opacity-75 transition-opacity"
                    style={{ color: '#801A00' }}
                  >
                    مشاهده در نشان
                    <ChevronLeft size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ══════ ستون چپ — کارت رزرو sticky ══════ */}
          <div style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
            <div style={{ border: '1px solid #E5E5E5', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

              {/* قیمت */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#171717' }}>
                    {studio.pricePerHour.toLocaleString('fa-IR')}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#171717' }}>تومان</span>
                  <span style={{ fontSize: 14, color: '#717171', fontWeight: 300 }}>/ ساعت</span>
                </div>
              </div>

              {/* ── انتخاب نوع کاربری ── */}
              <div className="mb-5">
                <p className="text-[12px] font-bold text-[#717171] uppercase tracking-wide mb-3 text-right">
                  نوع کاربری
                </p>
                <div className="flex flex-col gap-2">

                  {/* تمرین تئاتر */}
                  <a
                    href={THEATER_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-[#EFEFEF] bg-white hover:border-[#D0D0D0] transition-all duration-200 text-right"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="flex-1 text-right">
                      <p className="text-[14px] font-bold text-[#171717]">
                        تمرین تئاتر
                      </p>
                      <p className="text-[12px] text-[#A0A0A0] font-light mt-0.5">
                        رزرو آنلاین با پرداخت مستقیم
                      </p>
                    </div>
                    <ExternalLink size={18} className="flex-shrink-0 mr-3" style={{ color: '#A0A0A0' }} />
                  </a>

                  {/* سایر موارد */}
                  <button
                    onClick={() => { setUsageType('other'); resetSelection() }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-right ${usageType === 'other' ? 'border-[#801A00] bg-[#FDF8F8]' : 'border-[#EFEFEF] bg-white hover:border-[#D0D0D0]'}`}
                  >
                    <div className="flex-1 text-right">
                      <p className={`text-[14px] font-bold ${usageType === 'other' ? 'text-[#801A00]' : 'text-[#171717]'}`}>
                        سایر موارد
                      </p>
                      <p className="text-[12px] text-[#A0A0A0] font-light mt-0.5">
                        ورکشاپ، عکاسی، فیلمبرداری، یوگا و...
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-3 transition-all ${usageType === 'other' ? 'border-[#801A00] bg-[#801A00]' : 'border-[#D0D0D0] bg-white'}`}>
                      {usageType === 'other' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>

                </div>
              </div>

              {/* ── دکمه انتخاب تاریخ (فقط بعد از انتخاب نوع) ── */}
              {usageType && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowPicker(true)}
                    style={{
                      width: '100%', border: '1px solid #E5E5E5', borderRadius: 12,
                      padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', textAlign: 'right', background: 'white',
                      transition: 'border-color 200ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#801A00' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5' }}
                  >
                    <div>
                      {selectedStartDate ? (
                        <>
                          <p style={{ fontSize: 11, fontWeight: 700, color: '#801A00', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                            {isMultiDay ? 'بازه تاریخی' : 'تاریخ و ساعت'}
                          </p>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#171717' }}>
                            {(() => {
                              const j = toJalali(selectedStartDate)
                              let text = `${toPersian(j.jd)} ${PERSIAN_MONTHS[j.jm - 1]}`
                              if (selectedEndDate && isMultiDay) {
                                const je = toJalali(selectedEndDate)
                                text += ` تا ${toPersian(je.jd)} ${PERSIAN_MONTHS[je.jm - 1]}`
                              }
                              if (!isMultiDay && selectedStartTime) {
                                text += ` — ${selectedStartTime} تا ${selectedEndTime}`
                              }
                              return text
                            })()}
                          </p>
                        </>
                      ) : (
                        <>
                          <p style={{ fontSize: 11, fontWeight: 700, color: '#B0B0B0', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                            {usageType === 'theater' ? 'تاریخ و ساعت' : 'تاریخ درخواستی'}
                          </p>
                          <p style={{ fontSize: 14, color: '#B0B0B0' }}>انتخاب کنید</p>
                        </>
                      )}
                    </div>
                    <Calendar size={18} color="#A0A0A0" />
                  </button>
                </div>
              )}

              {/* ── پیام توضیحی برای سایر موارد بعد از انتخاب تاریخ ── */}
              {usageType === 'other' && selectedStartDate && (
                <div className="p-4 rounded-xl mb-4 text-right" style={{ background: '#FFF9F0', border: '1px solid #FFE4B5' }}>
                  <div className="flex items-start gap-3">
                    <MessageCircle size={18} color="#E67700" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p className="text-[13px] font-bold mb-1" style={{ color: '#E67700' }}>قیمت‌گذاری بر اساس نوع استفاده</p>
                      <p className="text-[13px] text-[#717171] font-light leading-relaxed">
                        برای این نوع کاربری، قیمت نهایی بستگی به جزئیات پروژه شما دارد.
                        پس از ثبت درخواست، تیم خانه دی ظرف ۲۴ ساعت با شما تماس گرفته و هزینه دقیق را هماهنگ خواهد کرد.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── خلاصه قیمت — فقط برای تئاتر ── */}
              {usageType === 'theater' && hours > 0 && !isMultiDay && (
                <div className="border-t border-[#F0F0F0] pt-4 mb-4">
                  <div className="flex justify-between text-[13px] mb-2">
                    <span className="text-[#717171]">{toPersian(hours)} ساعت × {studio.pricePerHour.toLocaleString('fa-IR')} <span className="font-bold">تومان</span></span>
                    <span className="font-bold text-[#171717]">{totalPrice.toLocaleString('fa-IR')} <span>تومان</span></span>
                  </div>
                  <div className="flex justify-between text-[14px] font-bold text-[#171717] border-t border-[#F0F0F0] pt-2 mt-2">
                    <span>جمع کل</span>
                    <span>{totalPrice.toLocaleString('fa-IR')} تومان</span>
                  </div>
                </div>
              )}

              {usageType === 'theater' && isMultiDay && selectedStartDate && (
                <div style={{ borderTop: '1px solid #EFEFEF', marginTop: 0, paddingTop: 12, marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: '#801A00', textAlign: 'right' }}>
                    قیمت رزرو چند روزه پس از هماهنگی تیم خانه دی اعلام می‌شود.
                  </p>
                </div>
              )}

              {/* ── دکمه اصلی ── */}
              {!usageType && (
                <button disabled className="w-full py-3.5 rounded-xl text-[15px] font-bold bg-[#F0F0F0] text-[#A0A0A0] cursor-not-allowed">
                  ابتدا نوع کاربری را انتخاب کنید
                </button>
              )}

              {usageType === 'theater' && (
                <button
                  onClick={handleBooking}
                  disabled={!selectedStartDate || !selectedStartTime || !selectedEndTime}
                  className="w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: '#801A00' }}
                >
                  {!selectedStartDate
                    ? 'تاریخ و ساعت را انتخاب کنید'
                    : (!selectedStartTime || !selectedEndTime)
                    ? 'ساعت را انتخاب کنید'
                    : 'تایید و پرداخت'}
                </button>
              )}

              {usageType === 'other' && (
                <>
                  <button
                    onClick={handleContactRequest}
                    disabled={!selectedStartDate || loading}
                    className="w-full py-3.5 rounded-xl text-[15px] font-bold transition-all disabled:cursor-not-allowed"
                    style={{
                      background: !selectedStartDate ? '#F0F0F0' : 'white',
                      color: !selectedStartDate ? '#A0A0A0' : '#801A00',
                      border: !selectedStartDate ? 'none' : '2px solid #801A00',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? 'در حال ثبت...' : !selectedStartDate ? 'تاریخ را انتخاب کنید' : 'ثبت درخواست رزرو رایگان'}
                  </button>
                  <p className="text-[11px] text-[#A0A0A0] text-center mt-2 font-light">
                    بدون پرداخت — تیم ما با شما تماس می‌گیرد
                  </p>
                </>
              )}

            </div>

            {/* ─── قوانین کنسلی (دسکتاپ) ─── */}
            <div style={{ marginTop: 16, padding: '16px 20px', border: '1px solid #EFEFEF', borderRadius: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#171717', marginBottom: 12 }}>قوانین کنسلی</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { range: 'بیش از ۴۸ ساعت قبل', refund: 'استرداد کامل', color: '#2F9E44' },
                  { range: '۲۴ تا ۴۸ ساعت قبل',  refund: 'استرداد ۵۰٪',  color: '#E67700' },
                  { range: 'کمتر از ۲۴ ساعت قبل', refund: 'بدون استرداد', color: '#C92A2A' },
                ].map(({ range, refund, color }) => (
                  <div key={range} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#717171' }}>{range}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{refund}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: '#B0B0B0', marginTop: 10, lineHeight: 1.6 }}>
                استرداد ظرف ۷۲ ساعت کاری از طریق روش پرداخت اولیه
              </p>
            </div>

          </div>
        </div>

      </div>
      {/* ══════ END دسکتاپ ══════ */}

      {/* ══════ مشترک: مودال انتخاب تاریخ و ساعت ══════ */}
      <DateTimePickerModal
        open={showPicker}
        onClose={() => setShowPicker(false)}
        studioId={params.studioId}
        mode={usageType === 'theater' ? 'single' : 'range'}
        onConfirm={({ startDate, endDate, startTime, endTime }) => {
          setSelectedStartDate(startDate)
          setSelectedEndDate(endDate)
          setSelectedStartTime(startTime)
          setSelectedEndTime(endTime)
          setIsMultiDay(!!(endDate && endDate.getTime() !== startDate.getTime()))
        }}
      />

      {/* ══════ پاپ‌اپ موفقیت سایر موارد ══════ */}
      {showSuccess && usageType === 'other' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-5" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="relative bg-white rounded-2xl px-8 py-10 w-full max-w-sm text-center shadow-xl">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-[#A0A0A0] hover:text-[#171717] hover:bg-[#F5F5F5] transition-all"
            >
              <X size={20} />
            </button>
            <div className="flex justify-center mb-5">
              <CheckCircle size={48} color="#16a34a" />
            </div>
            <h2 className="text-[22px] font-black text-[#171717] mb-3">درخواست ثبت شد!</h2>
            <p className="text-[14px] text-[#717171] font-light leading-relaxed mb-2">
              تیم خانه دی درخواست رزرو شما را دریافت کرد.
            </p>
            <p className="text-[13px] text-[#404040] font-medium leading-relaxed">
              ظرف ۲۴ ساعت آینده با شما تماس گرفته می‌شود تا جزئیات رزرو و هزینه نهایی هماهنگ شود.
            </p>
          </div>
        </div>
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
