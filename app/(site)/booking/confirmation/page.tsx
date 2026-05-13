'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SiteLayout } from '@/components/layouts/SiteLayout'

type Status = 'loading' | 'success' | 'failed'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingId    = searchParams.get('bookingId')
  const authority    = searchParams.get('Authority')
  const zarinStatus  = searchParams.get('Status')

  const [status, setStatus] = useState<Status>('loading')
  const [refId, setRefId]   = useState<number | null>(null)

  useEffect(() => {
    if (!bookingId || !authority) { setStatus('failed'); return }

    const params = new URLSearchParams({ bookingId, Authority: authority, Status: zarinStatus ?? '' })
    fetch(`/api/bookings/verify-payment?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) { setStatus('success'); setRefId(data.refId ?? null) }
        else { setStatus('failed') }
      })
      .catch(() => setStatus('failed'))
  }, [bookingId, authority, zarinStatus])

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">در حال تأیید پرداخت...</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-green-600 text-4xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">رزرو شما تأیید شد</h1>
          <p className="text-neutral-600 mb-2">پرداخت با موفقیت انجام شد.</p>
          {refId && (
            <p className="text-sm text-neutral-400 mb-6">کد پیگیری: {refId}</p>
          )}
          <div className="flex gap-3 justify-center">
            <Link
              href="/dashboard/bookings"
              className="bg-brand hover:bg-brand-hover text-white font-medium px-6 py-2.5 rounded-btn transition-colors"
            >
              مشاهده رزروها
            </Link>
            <Link
              href="/"
              className="border border-neutral-200 text-neutral-700 font-medium px-6 py-2.5 rounded-btn hover:bg-neutral-50 transition-colors"
            >
              صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-red-500 text-4xl">✕</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">پرداخت ناموفق</h1>
        <p className="text-neutral-600 mb-6">متأسفانه پرداخت تأیید نشد. رزرو لغو شد.</p>
        <Link
          href="/booking"
          className="bg-brand hover:bg-brand-hover text-white font-medium px-6 py-2.5 rounded-btn transition-colors"
        >
          تلاش مجدد
        </Link>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <SiteLayout>
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="text-neutral-400">در حال بارگذاری...</div></div>}>
        <ConfirmationContent />
      </Suspense>
    </SiteLayout>
  )
}
