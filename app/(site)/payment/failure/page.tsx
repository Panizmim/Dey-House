import Link from 'next/link'
import { XCircle } from '@/components/ui/icons'

const REASONS: Record<string, string> = {
  cancelled:     'پرداخت توسط شما لغو شد.',
  verify_failed: 'تأیید پرداخت با خطا مواجه شد. در صورت کسر مبلغ، تا ۷۲ ساعت بازگشت داده می‌شود.',
  invalid:       'اطلاعات پرداخت معتبر نیست.',
  not_found:     'رزروی برای این تراکنش یافت نشد.',
}

interface Props {
  searchParams: { reason?: string; bookingId?: string }
}

export default function PaymentFailurePage({ searchParams }: Props) {
  const { reason = 'cancelled' } = searchParams
  const message = REASONS[reason] ?? 'پرداخت ناموفق بود.'

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center px-4 py-16">
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>

        {/* آیکون خطا */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: '#FFF0F0', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <XCircle size={40} color="#C92A2A" strokeWidth={1.8} />
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#171717', marginBottom: 10 }}>
          پرداخت ناموفق
        </h1>

        <p style={{ fontSize: 14, color: '#717171', lineHeight: 1.8, marginBottom: 32 }}>
          {message}
        </p>

        {/* کارت راهنما */}
        <div style={{
          background: '#FFF8F8', border: '1px solid #FFD8D8',
          borderRadius: 12, padding: '16px 20px',
          textAlign: 'right', marginBottom: 28,
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#C92A2A', marginBottom: 8 }}>نکات مهم</p>
          <ul style={{ fontSize: 12, color: '#717171', lineHeight: 2, paddingRight: 16, listStyleType: 'disc' }}>
            <li>مبلغی از حساب شما کسر نشده است.</li>
            <li>در صورت کسر اشتباه، ظرف ۷۲ ساعت بازگشت داده می‌شود.</li>
            <li>می‌توانید دوباره رزرو کنید.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/booking"
            style={{
              display: 'block', textAlign: 'center',
              background: '#8B1E1E', color: 'white',
              borderRadius: 12, padding: '14px',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
            }}
          >
            تلاش مجدد برای رزرو
          </Link>
          <Link
            href="/"
            style={{
              display: 'block', textAlign: 'center',
              background: 'transparent', color: '#404040',
              borderRadius: 12, padding: '14px',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              border: '1px solid #E5E5E5',
            }}
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>

      </div>
    </div>
  )
}
