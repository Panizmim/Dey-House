import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, CalendarDays, Clock, Building2, CreditCard, Hash } from '@/components/ui/icons'

const toFa = (s: string | number) =>
  String(s).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])

interface Props {
  searchParams: {
    refId?:      string
    bookingId?:  string
    studioName?: string
    date?:       string
    startTime?:  string
    endTime?:    string
    totalPrice?: string
  }
}

export default function PaymentSuccessPage({ searchParams }: Props) {
  const {
    refId      = '',
    bookingId  = '',
    studioName = '—',
    date       = '—',
    startTime  = '—',
    endTime    = '—',
    totalPrice = '0',
  } = searchParams

  const price          = Number(totalPrice).toLocaleString('fa-IR')
  const bookingIdShort = bookingId ? `#${toFa(bookingId.slice(-6).toUpperCase())}` : '—'

  const rows = [
    { icon: Building2,    label: 'پلاتو',        value: studioName },
    { icon: CalendarDays, label: 'تاریخ',         value: toFa(date) },
    { icon: Clock,        label: 'بازه زمانی',   value: `${toFa(startTime)} تا ${toFa(endTime)}` },
    { icon: CreditCard,   label: 'مبلغ پرداختی', value: `${price} تومان` },
    ...(refId     ? [{ icon: Hash, label: 'کد پیگیری',  value: toFa(refId) }]       : []),
    ...(bookingId ? [{ icon: Hash, label: 'شماره رزرو', value: bookingIdShort }]     : []),
  ]

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

      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* هدر */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#EBFBEE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <CheckCircle2 size={36} color="#2F9E44" strokeWidth={1.8} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#171717', margin: '0 0 8px' }}>
            پرداخت موفق بود
          </h1>
          <p style={{ fontSize: 14, color: '#717171', lineHeight: 1.8, margin: 0 }}>
            رزرو شما با موفقیت ثبت شد.<br />
            جزئیات از طریق پیامک ارسال می‌شود.
          </p>
        </div>

        {/* کارت رسید */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid #EFEFEF',
          overflow: 'hidden',
          marginBottom: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            background: '#F4FFF6',
            borderBottom: '1px solid #DFFAE5',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2F9E44' }} />
            <p style={{ fontSize: 12, fontWeight: 700, color: '#2F9E44', margin: 0, letterSpacing: '0.04em' }}>
              جزئیات رزرو
            </p>
          </div>

          {rows.map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 20px',
                borderBottom: i < rows.length - 1 ? '1px solid #F5F5F5' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon size={14} color="#B0B0B0" />
                <span style={{ fontSize: 13, color: '#717171' }}>{label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#171717' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* دکمه‌ها */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/dashboard/bookings"
            style={{
              display: 'block', textAlign: 'center',
              background: '#801A00', color: 'white',
              borderRadius: 12, padding: '14px',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
            }}
          >
            مشاهده رزروهای من
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
