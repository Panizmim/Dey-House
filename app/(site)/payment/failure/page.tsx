import Image from 'next/image'
import Link from 'next/link'
import { XCircle, AlertCircle } from '@/components/ui/icons'

const REASONS: Record<string, { title: string; desc: string; refund: boolean }> = {
  cancelled: {
    title:  'پرداخت لغو شد',
    desc:   'شما پرداخت را لغو کردید. مبلغی از حساب شما کسر نشده است.',
    refund: false,
  },
  verify_failed: {
    title:  'تأیید پرداخت ناموفق بود',
    desc:   'تراکنش در درگاه بانکی تأیید نشد. در صورت کسر مبلغ، ظرف ۷۲ ساعت به حساب شما بازمی‌گردد.',
    refund: true,
  },
  invalid: {
    title:  'اطلاعات پرداخت نامعتبر',
    desc:   'اطلاعات تراکنش دریافت‌شده معتبر نیست. لطفاً دوباره تلاش کنید.',
    refund: false,
  },
  not_found: {
    title:  'رزرو یافت نشد',
    desc:   'رزروی برای این تراکنش پیدا نشد. احتمالاً منقضی شده است.',
    refund: false,
  },
}

interface Props {
  searchParams: { reason?: string; bookingId?: string }
}

export default function PaymentFailurePage({ searchParams }: Props) {
  const reason = searchParams.reason ?? 'cancelled'
  const info   = REASONS[reason] ?? {
    title:  'پرداخت ناموفق بود',
    desc:   'خطایی در فرآیند پرداخت رخ داد. لطفاً دوباره تلاش کنید.',
    refund: false,
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        background: '#F8F7F4',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      {/* لوگو */}
      <Link href="/" style={{ marginBottom: 36, display: 'block' }}>
        <Image src="/images/logo.png" alt="خانه دی" width={72} height={72} style={{ objectFit: 'contain' }} />
      </Link>

      <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>

        {/* آیکون خطا */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: '#FFF0F0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <XCircle size={36} color="#C92A2A" strokeWidth={1.8} />
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#171717', margin: '0 0 10px' }}>
          {info.title}
        </h1>
        <p style={{ fontSize: 14, color: '#717171', lineHeight: 1.8, margin: '0 0 28px' }}>
          {info.desc}
        </p>

        {/* کارت نکات */}
        {info.refund && (
          <div style={{
            background: '#FFF8F8',
            border: '1px solid #FFD8D8',
            borderRadius: 12,
            padding: '16px 20px',
            textAlign: 'right',
            marginBottom: 28,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}>
            <AlertCircle size={16} color="#C92A2A" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#C92A2A', margin: '0 0 6px' }}>
                مبلغ کسرشده برمی‌گردد؟
              </p>
              <p style={{ fontSize: 12, color: '#717171', lineHeight: 1.9, margin: 0 }}>
                در صورتی که مبلغی از حساب شما کسر شده باشد، ظرف ۷۲ ساعت به صورت خودکار بازگشت داده می‌شود.
                در صورت عدم بازگشت با پشتیبانی تماس بگیرید.
              </p>
            </div>
          </div>
        )}

        {!info.refund && (
          <div style={{
            background: '#FAFAFA',
            border: '1px solid #EFEFEF',
            borderRadius: 12,
            padding: '14px 20px',
            textAlign: 'right',
            marginBottom: 28,
          }}>
            <p style={{ fontSize: 12, color: '#717171', lineHeight: 1.9, margin: 0 }}>
              مبلغی از حساب شما کسر نشده است. می‌توانید دوباره رزرو کنید.
            </p>
          </div>
        )}

        {/* دکمه‌ها */}
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
              background: 'white', color: '#404040',
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
