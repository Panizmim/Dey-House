'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from '@/components/ui/icons'
import { toPersianNum } from '@/lib/utils'

type Payment = {
  id:            string
  date:          string
  startTime:     string
  endTime:       string
  totalPrice:    number
  status:        string
  paymentStatus: string
  createdAt:     string
  studio:        { name: string; images: string[] }
}

function formatPersianDate(d: Date) {
  return d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
}

const studioImageFallback: Record<string, string> = {
  'اتاق سفید':    '/images/studios/white-room-1.jpg',
  'اتاق سیاه یک': '/images/studios/black-room1-1.jpg',
  'اتاق سیاه دو': '/images/studios/black-room2-1.jpg',
}

function PaymentRow({ payment }: { payment: Payment }) {
  const imgSrc = payment.studio.images[0] ?? studioImageFallback[payment.studio.name] ?? null
  const [imgErr, setImgErr] = useState(false)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: 16, border: '1px solid #F0F0F0', borderRadius: 12,
      transition: 'border-color 150ms',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E0E0E0' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#F0F0F0' }}
    >
      <div style={{
        width: 80, height: 64, borderRadius: 10, overflow: 'hidden',
        flexShrink: 0, background: 'linear-gradient(135deg, #e8ddd0, #c8b89a)',
      }}>
        {imgSrc && !imgErr && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imgSrc} alt={payment.studio.name}
            onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#171717', marginBottom: 2 }}>
          {payment.studio.name}
        </p>
        <p style={{ fontSize: 12, color: '#A0A0A0', marginBottom: 8 }}>
          #{toPersianNum(payment.id.slice(-5).toUpperCase())}
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#717171' }}>
            تاریخ: {formatPersianDate(new Date(payment.date))}
          </span>
          <span style={{ fontSize: 12, color: '#717171' }}>
            مبلغ: {toPersianNum(payment.totalPrice.toLocaleString('fa-IR'))} تومان
          </span>
        </div>
      </div>

      <span style={{ padding: '4px 12px', background: '#EBFBEE', color: '#2F9E44', borderRadius: 999, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
        پرداخت شده
      </span>

      <Link
        href={`/dashboard/bookings/${payment.id}`}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 14, fontWeight: 700, color: '#801A00',
          flexShrink: 0, textDecoration: 'none', transition: 'opacity 150ms',
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

export default function PaymentsPage() {
  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ['user-payments'],
    queryFn:  () => fetch('/api/user/payments').then((r) => r.json()),
  })

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24 }}>
      <p style={{ fontSize: 18, fontWeight: 900, color: '#171717', marginBottom: 20 }}>سوابق مالی</p>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: 96, border: '1px solid #F0F0F0', borderRadius: 12, background: '#FAFAFA' }} className="animate-pulse" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#A0A0A0', fontSize: 14 }}>
          هنوز پرداختی ثبت نشده است
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {payments.map((p) => <PaymentRow key={p.id} payment={p} />)}
        </div>
      )}
    </div>
  )
}
