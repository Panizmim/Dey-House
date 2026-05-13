'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Booking = {
  id:            string
  date:          string
  startTime:     string
  endTime:       string
  durationHours: number
  status:        'PENDING' | 'CONFIRMED' | 'CANCELLED'
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED'
  totalPrice:    number
  studio:        { name: string; imageUrl: string | null }
  createdAt:     string
}

const statusLabel: Record<string, string> = {
  PENDING:   'در انتظار',
  CONFIRMED: 'تأیید شده',
  CANCELLED: 'لغو شده',
}

const statusColor: Record<string, string> = {
  PENDING:   'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-neutral-100 text-neutral-500',
}

const paymentLabel: Record<string, string> = {
  UNPAID:   'پرداخت نشده',
  PAID:     'پرداخت شده',
  REFUNDED: 'برگشت داده شده',
}

export default function BookingsPage() {
  const qc = useQueryClient()
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['user-bookings'],
    queryFn:  () => fetch('/api/user/bookings').then((r) => r.json()),
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/bookings/${id}/cancel`, { method: 'PATCH' }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-bookings'] })
      setCancelingId(null)
    },
  })

  function handleCancel(id: string) {
    if (!confirm('آیا مطمئنید می‌خواهید این رزرو را لغو کنید؟')) return
    cancelMutation.mutate(id)
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">رزروهای من</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-card border border-neutral-100 p-5 animate-pulse">
              <div className="h-4 bg-neutral-100 rounded w-48 mb-3" />
              <div className="h-3 bg-neutral-50 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">رزروهای من</h1>
        <Link
          href="/booking"
          className="bg-brand hover:bg-brand-hover text-white text-sm font-medium px-4 py-2 rounded-btn transition-colors"
        >
          رزرو جدید
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-card border border-neutral-100 p-12 text-center">
          <p className="text-neutral-400 mb-4">هنوز رزروی ثبت نکرده‌اید</p>
          <Link
            href="/booking"
            className="bg-brand hover:bg-brand-hover text-white font-medium px-6 py-2.5 rounded-btn transition-colors text-sm"
          >
            اولین رزرو را ثبت کنید
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-card border border-neutral-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-bold text-neutral-900">{booking.studio.name}</h3>
                    <span className={cn('px-2.5 py-0.5 rounded-chip text-xs font-medium', statusColor[booking.status])}>
                      {statusLabel[booking.status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm text-neutral-500">
                    <span>📅 {new Date(booking.date).toLocaleDateString('fa-IR')}</span>
                    <span>🕐 {booking.startTime} — {booking.endTime}</span>
                    <span>⏱ {booking.durationHours} ساعت</span>
                    <span className={booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}>
                      {paymentLabel[booking.paymentStatus]}
                    </span>
                  </div>
                </div>

                <div className="text-left flex flex-col items-end gap-2 shrink-0">
                  <p className="font-bold text-brand">{booking.totalPrice.toLocaleString('fa-IR')} تومان</p>
                  {booking.status !== 'CANCELLED' && (
                    <button
                      onClick={() => { setCancelingId(booking.id); handleCancel(booking.id) }}
                      disabled={cancelMutation.isPending && cancelingId === booking.id}
                      className="text-xs text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {cancelMutation.isPending && cancelingId === booking.id ? 'در حال لغو...' : 'لغو رزرو'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
