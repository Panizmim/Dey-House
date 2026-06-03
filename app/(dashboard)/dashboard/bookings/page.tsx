'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SlidersHorizontal, ChevronLeft, X, AlertCircle } from '@/components/ui/icons'
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

function BookingRow({ booking, onCancelled }: { booking: Booking; onCancelled: () => void }) {
  const imgSrc     = booking.studio.imageUrl ?? studioImageFallback[booking.studio.name] ?? null
  const [imgErr,       setImgErr]      = useState(false)
  const [confirming,   setConfirming]  = useState(false)
  const [cancelling,   setCancelling]  = useState(false)

  const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED'

  async function doCancel() {
    setCancelling(true)
    const res = await fetch(`/api/bookings/${booking.id}/cancel`, { method: 'PATCH' })
    setCancelling(false)
    if (res.ok) { setConfirming(false); onCancelled() }
  }

  return (
    <div style={{
      border: '1px solid #F0F0F0', borderRadius: 12, overflow: 'hidden',
      transition: 'border-color 150ms',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E0E0E0' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#F0F0F0' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
        <Link
          href={`/dashboard/bookings/${booking.id}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 14, fontWeight: 700, color: '#801A00',
            textDecoration: 'none', transition: 'opacity 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          جزئیات
          <ChevronLeft size={16} />
        </Link>

        {canCancel && (
          <button
            onClick={() => setConfirming(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: 12, fontWeight: 600, color: '#C92A2A',
              fontFamily: 'YekanBakh, Tahoma, sans-serif',
              transition: 'opacity 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.65' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            <X size={13} />
            لغو رزرو
          </button>
        )}
      </div>

      </div>{/* end row */}

      {/* ── تأییدیه لغو ── */}
      {confirming && (
        <div style={{
          borderTop: '1px solid #FEE2E2', background: '#FFF8F8',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} color="#C92A2A" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#C92A2A', fontWeight: 600 }}>
              آیا مطمئنید می‌خواهید این رزرو را لغو کنید؟
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setConfirming(false)}
              disabled={cancelling}
              style={{
                padding: '6px 14px', borderRadius: 8,
                border: '1px solid #E5E5E5', background: 'white',
                fontSize: 13, fontWeight: 600, color: '#404040',
                cursor: 'pointer', fontFamily: 'YekanBakh, Tahoma, sans-serif',
              }}
            >
              خیر
            </button>
            <button
              onClick={doCancel}
              disabled={cancelling}
              style={{
                padding: '6px 14px', borderRadius: 8,
                border: 'none', background: '#C92A2A',
                fontSize: 13, fontWeight: 700, color: 'white',
                cursor: cancelling ? 'not-allowed' : 'pointer',
                opacity: cancelling ? 0.6 : 1,
                fontFamily: 'YekanBakh, Tahoma, sans-serif',
              }}
            >
              {cancelling ? 'در حال لغو...' : 'بله، لغو شود'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const tabs = ['همه', 'در انتظار', 'لغو شده', 'تکمیل شده']

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState(0)
  const qc = useQueryClient()

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['user-bookings'],
    queryFn:  () => fetch('/api/user/bookings').then((r) => r.json()),
  })

  function handleCancelled() {
    qc.invalidateQueries({ queryKey: ['user-bookings'] })
  }

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
              background: activeTab === i ? '#801A00' : 'white',
              borderColor: activeTab === i ? '#801A00' : '#E5E5E5',
              color: activeTab === i ? 'white' : '#404040',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== i) e.currentTarget.style.borderColor = '#801A00'
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
          {filtered.map((b) => <BookingRow key={b.id} booking={b} onCancelled={handleCancelled} />)}
        </div>
      )}
    </div>
  )
}
