'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, MapPin, CalendarDays, Clock, User, X, Check } from '@/components/ui/icons'
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
  zarinpalRef:   string | null
  createdAt:     string
  studio:        { name: string; images: string[] }
}

function formatPersianDate(d: Date) {
  return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
}

const typeLabel: Record<string, string> = {
  THEATER:     'تمرین تئاتر',
  WORKSHOP:    'کارگاه',
  FILMING:     'فیلمبرداری',
  YOGA:        'یوگا',
  PHOTOGRAPHY: 'عکاسی',
  OTHER:       'سایر',
}

const studioImageFallback: Record<string, string> = {
  'اتاق سفید':    '/images/studios/white-room-1.jpg',
  'اتاق سیاه یک': '/images/studios/black-room1-1.jpg',
  'اتاق سیاه دو': '/images/studios/black-room2-1.jpg',
}

export default function BookingDetailPage() {
  const { id }              = useParams<{ id: string }>()
  const { data: session }   = useSession()
  const qc                  = useQueryClient()
  const [cancelled, setCancelled] = useState(false)
  const [imgErr,    setImgErr]    = useState(false)

  const { data: booking, isLoading } = useQuery<Booking>({
    queryKey: ['booking', id],
    queryFn:  () => fetch(`/api/user/bookings/${id}`).then((r) => {
      if (!r.ok) throw new Error('not found')
      return r.json()
    }),
  })

  const cancelMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/bookings/${id}/cancel`, { method: 'PATCH' }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-bookings'] })
      qc.invalidateQueries({ queryKey: ['booking', id] })
      setCancelled(true)
    },
  })

  function handleCancel() {
    if (!confirm('آیا مطمئنید می‌خواهید این رزرو را لغو کنید؟')) return
    cancelMutation.mutate()
  }

  /* ─── صفحه موفق لغو ─── */
  if (cancelled) {
    return (
      <div style={{ background: 'white', borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 24 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#801A00',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={32} color="white" />
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: '#801A00',
                  opacity: 0.3,
                  top: '50%', left: '50%',
                  transform: `rotate(${i * 45}deg) translateY(-48px) translate(-50%, -50%)`,
                }}
              />
            ))}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#801A00', marginBottom: 12 }}>انجام شد!</h2>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#404040', marginBottom: 8 }}>
            رزرو شما با موفقیت لغو شد.
          </p>
          <p style={{ fontSize: 14, color: '#717171', textAlign: 'center', maxWidth: 400, lineHeight: 1.7 }}>
            مبلغ پرداختی در صورت واریز، ظرف ۷۲ ساعت به روش پرداخت اصلی شما عودت داده می‌شود.
          </p>
          <Link
            href="/dashboard/bookings"
            style={{
              marginTop: 32,
              padding: '12px 32px',
              background: '#801A00',
              color: 'white',
              borderRadius: 12,
              fontSize: 14, fontWeight: 700,
              textDecoration: 'none',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#A02424' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#801A00' }}
          >
            بازگشت به رزروها
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div style={{ background: 'white', borderRadius: 16, padding: 24 }} className="animate-pulse">
        <div style={{ height: 20, background: '#F3F4F6', borderRadius: 4, width: 120, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div style={{ height: 400, background: '#F3F4F6', borderRadius: 12 }} />
          <div style={{ height: 400, background: '#F3F4F6', borderRadius: 12 }} />
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div style={{ background: 'white', borderRadius: 16, padding: 24, textAlign: 'center', color: '#A0A0A0' }}>
        رزرو پیدا نشد
      </div>
    )
  }

  const imgSrc = booking.studio.images[0] ?? studioImageFallback[booking.studio.name] ?? null

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24 }}>

      {/* بازگشت */}
      <Link
        href="/dashboard/bookings"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 14, fontWeight: 700, color: '#801A00',
          textDecoration: 'none', marginBottom: 24,
          transition: 'opacity 150ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
      >
        <ArrowRight size={16} />
        بازگشت
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

        {/* ستون راست — جزئیات رزرو */}
        <div>
          <p style={{ fontSize: 18, fontWeight: 900, color: '#171717', marginBottom: 20 }}>جزئیات رزرو</p>

          <div style={{ border: '1px solid #EFEFEF', borderRadius: 12, overflow: 'hidden' }}>
            {/* تصویر */}
            <div style={{ height: 192, background: 'linear-gradient(135deg, #e8ddd0, #c8b89a)' }}>
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

            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 900, color: '#171717', marginBottom: 16 }}>
                {booking.studio.name}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: MapPin,      label: 'مکان',       value: 'تهران، خانه دی' },
                  { icon: CalendarDays, label: 'تاریخ',      value: formatPersianDate(new Date(booking.date)) },
                  { icon: Clock,       label: 'ساعت',       value: `${booking.startTime} تا ${booking.endTime}` },
                  { icon: User,        label: 'نوع کاربری', value: typeLabel[booking.type] ?? booking.type },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <Icon size={16} style={{ color: '#801A00', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#801A00', marginBottom: 2 }}>{label}</p>
                      <p style={{ fontSize: 14, color: '#404040' }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* دکمه لغو */}
          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              style={{
                marginTop: 16,
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px',
                border: '1px solid #FFCCCC',
                color: '#C92A2A',
                background: 'white',
                borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                cursor: cancelMutation.isPending ? 'not-allowed' : 'pointer',
                opacity: cancelMutation.isPending ? 0.6 : 1,
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF0F0' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white' }}
            >
              <X size={16} />
              {cancelMutation.isPending ? 'در حال لغو...' : 'لغو رزرو'}
            </button>
          )}
        </div>

        {/* ستون چپ — جزئیات سفارش */}
        <div>
          <p style={{ fontSize: 18, fontWeight: 900, color: '#171717', marginBottom: 20 }}>جزئیات سفارش</p>

          <div style={{ border: '1px solid #EFEFEF', borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'پرداخت‌کننده', value: session?.user?.name ?? '—' },
                { label: 'کد رزرو',      value: `#${booking.id.slice(-8).toUpperCase()}` },
                { label: 'تاریخ سفارش',  value: formatPersianDate(new Date(booking.createdAt)) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: 12, color: '#A0A0A0', marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#171717' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 16, fontWeight: 900, color: '#171717', marginBottom: 12 }}>پرداخت</p>
          <div style={{ border: '1px solid #EFEFEF', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 12, color: '#A0A0A0', marginBottom: 4 }}>مبلغ کل</p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: '#171717' }}>
                    {toPersianNum(booking.totalPrice.toLocaleString('fa-IR'))} تومان
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#A0A0A0', marginBottom: 4 }}>روش پرداخت</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#171717' }}>زاریپال</p>
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#A0A0A0', marginBottom: 4 }}>کد پیگیری</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#171717' }}>
                    {booking.zarinpalRef ?? '—'}
                  </p>
                </div>
              </div>

              <div>
                {booking.paymentStatus === 'PAID' ? (
                  <span style={{ padding: '6px 14px', background: '#EBFBEE', color: '#2F9E44', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                    پرداخت شده
                  </span>
                ) : (
                  <span style={{ padding: '6px 14px', background: '#FFF9DB', color: '#E67700', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                    پرداخت نشده
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
