'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, ChevronLeft } from 'lucide-react'
import { toPersianNum } from '@/lib/utils'

type Booking = {
  id:            string
  date:          string
  startTime:     string
  endTime:       string
  status:        'PENDING' | 'CONFIRMED' | 'CANCELLED'
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED'
  totalPrice:    number
  type:          string
  createdAt:     string
  studio:        { name: string; imageUrl: string | null }
}

function formatPersianDate(d: Date) {
  return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
}

const studioImageFallback: Record<string, string> = {
  'اتاق سفید':    '/images/studios/white-room-1.jpg',
  'اتاق سیاه یک': '/images/studios/black-room1-1.jpg',
  'اتاق سیاه دو': '/images/studios/black-room2-1.jpg',
}

function BookingRow({ booking }: { booking: Booking }) {
  const imgSrc = booking.studio.imageUrl ?? studioImageFallback[booking.studio.name] ?? null
  const [imgErr, setImgErr] = useState(false)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: 16,
      border: '1px solid #F0F0F0',
      borderRadius: 12,
      transition: 'border-color 150ms',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E0E0E0' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#F0F0F0' }}
    >
      {/* تصویر */}
      <div style={{
        width: 80, height: 64,
        borderRadius: 10, overflow: 'hidden',
        flexShrink: 0,
        background: 'linear-gradient(135deg, #e8ddd0, #c8b89a)',
      }}>
        {imgSrc && !imgErr && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imgSrc}
            alt={booking.studio.name}
            onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      {/* اطلاعات */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#171717', marginBottom: 2 }}>
          {booking.studio.name}
        </p>
        <p style={{ fontSize: 12, color: '#A0A0A0', marginBottom: 8 }}>
          #{toPersianNum(booking.id.slice(-5).toUpperCase())}
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#717171' }}>
            تاریخ سفارش: {formatPersianDate(new Date(booking.createdAt))}
          </span>
          <span style={{ fontSize: 12, color: '#717171' }}>
            مبلغ: {toPersianNum(booking.totalPrice.toLocaleString('fa-IR'))} تومان
          </span>
        </div>
      </div>

      {/* badge وضعیت */}
      <div style={{ flexShrink: 0 }}>
        {booking.status === 'CONFIRMED' && (
          <span style={{ padding: '4px 12px', background: '#EBFBEE', color: '#2F9E44', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
            تکمیل شده
          </span>
        )}
        {booking.status === 'PENDING' && (
          <span style={{ padding: '4px 12px', background: '#FFF9DB', color: '#E67700', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
            در انتظار
          </span>
        )}
        {booking.status === 'CANCELLED' && (
          <span style={{ padding: '4px 12px', background: '#FFF0F0', color: '#C92A2A', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
            لغو شده
          </span>
        )}
      </div>

      {/* جزئیات */}
      <Link
        href={`/dashboard/bookings/${booking.id}`}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 14, fontWeight: 700, color: '#8B1E1E',
          flexShrink: 0, textDecoration: 'none',
          transition: 'opacity 150ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
      >
        جزئیات
        <ChevronLeft size={16} />
      </Link>
    </div>
  )
}

const tabs = ['همه', 'در انتظار', 'لغو شده', 'تکمیل شده']

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState(0)

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['user-bookings'],
    queryFn:  () => fetch('/api/user/bookings').then((r) => r.json()),
  })

  const pending   = bookings.filter((b) => b.status === 'PENDING').length
  const cancelled = bookings.filter((b) => b.status === 'CANCELLED').length
  const completed = bookings.filter((b) => b.status === 'CONFIRMED').length

  const counts = [bookings.length, pending, cancelled, completed]
  const filters: Array<Booking['status'] | null> = [null, 'PENDING', 'CANCELLED', 'CONFIRMED']

  const filtered = filters[activeTab]
    ? bookings.filter((b) => b.status === filters[activeTab])
    : bookings

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24 }}>

      {/* filter tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#717171', marginLeft: 8 }}>
          <SlidersHorizontal size={16} />
          مرتب‌سازی
        </div>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              border: '1px solid',
              cursor: 'pointer',
              transition: 'all 150ms',
              background: activeTab === i ? '#8B1E1E' : 'white',
              borderColor: activeTab === i ? '#8B1E1E' : '#E5E5E5',
              color: activeTab === i ? 'white' : '#404040',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== i) e.currentTarget.style.borderColor = '#8B1E1E'
            }}
            onMouseLeave={(e) => {
              if (activeTab !== i) e.currentTarget.style.borderColor = '#E5E5E5'
            }}
          >
            {tab} ({toPersianNum(counts[i])})
          </button>
        ))}
      </div>

      {/* لیست */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              height: 96, border: '1px solid #F0F0F0',
              borderRadius: 12, background: '#FAFAFA',
            }} className="animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#A0A0A0', fontSize: 14 }}>
          رزروی در این دسته‌بندی وجود ندارد
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((b) => <BookingRow key={b.id} booking={b} />)}
        </div>
      )}
    </div>
  )
}
