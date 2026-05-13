'use client'

import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

type Booking = {
  id:            string
  date:          string
  startTime:     string
  endTime:       string
  status:        'PENDING' | 'CONFIRMED' | 'CANCELLED'
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED'
  totalPrice:    number
  studio:        { name: string }
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

export default function DashboardPage() {
  const { data: session } = useSession()

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['user-bookings'],
    queryFn:  () => fetch('/api/user/bookings').then((r) => r.json()),
  })

  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length
  const pending   = bookings.filter((b) => b.status === 'PENDING').length
  const last      = bookings[0]

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">
        خوش آمدید، {session?.user?.name}
      </h1>
      <p className="text-neutral-500 text-sm mb-8">خلاصه فعالیت‌های شما در خانه دی</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'کل رزروها',       value: bookings.length },
          { label: 'رزروهای تأیید شده', value: confirmed     },
          { label: 'در انتظار پرداخت', value: pending        },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-card border border-neutral-100 px-5 py-4">
            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
            <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Last booking */}
      {last && (
        <div className="bg-white rounded-card border border-neutral-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-neutral-900">آخرین رزرو</h2>
            <Link href="/dashboard/bookings" className="text-sm text-brand hover:underline">
              مشاهده همه
            </Link>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-neutral-900">{last.studio.name}</p>
              <p className="text-sm text-neutral-500 mt-1">
                {new Date(last.date).toLocaleDateString('fa-IR')} | {last.startTime} — {last.endTime}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-chip text-xs font-medium ${statusColor[last.status]}`}>
              {statusLabel[last.status]}
            </span>
          </div>
        </div>
      )}

      {bookings.length === 0 && (
        <div className="bg-white rounded-card border border-neutral-100 p-10 text-center">
          <p className="text-neutral-400 mb-4">هنوز رزروی ندارید</p>
          <Link
            href="/booking"
            className="bg-brand hover:bg-brand-hover text-white font-medium px-6 py-2.5 rounded-btn transition-colors text-sm"
          >
            رزرو پلاتو
          </Link>
        </div>
      )}
    </div>
  )
}
