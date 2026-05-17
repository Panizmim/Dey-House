import Link from 'next/link'
import { CheckCircle2, CalendarDays, Clock, Building2, CreditCard, Hash } from '@/components/ui/icons'

const toFa = (s: string | number) => String(s).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])

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
    refId      = '۱۲۳۴۵۶',
    bookingId  = 'DEMO',
    studioName = 'اتاق سفید',
    date       = '۱۴۰۳/۰۳/۱۵',
    startTime  = '10:00',
    endTime    = '12:00',
    totalPrice = '800000',
  } = searchParams

  const priceFormatted = Number(totalPrice).toLocaleString('fa-IR')
  const refIdFa        = toFa(refId)
  const bookingIdShort = toFa(bookingId.slice(-6).toUpperCase())

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center px-4 py-16">
      <div style={{ maxWidth: 480, width: '100%' }}>

        {/* آیکون موفقیت */}
        <div className="flex flex-col items-center mb-8">
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#EBFBEE', display: 'flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: 20,
          }}>
            <CheckCircle2 size={40} color="#2F9E44" strokeWidth={1.8} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#171717', marginBottom: 6, textAlign: 'center' }}>
            پرداخت موفق بود
          </h1>
          <p style={{ fontSize: 14, color: '#717171', textAlign: 'center', lineHeight: 1.7 }}>
            رزرو شما با موفقیت ثبت شد.<br />
            جزئیات از طریق پیامک برای شما ارسال می‌شود.
          </p>
        </div>

        {/* کارت جزئیات رزرو */}
        <div style={{
          background: 'white', borderRadius: 16,
          border: '1px solid #EFEFEF',
          overflow: 'hidden', marginBottom: 16,
        }}>
          <div style={{ background: '#F9FFF9', borderBottom: '1px solid #EFEFEF', padding: '14px 20px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#2F9E44', letterSpacing: '0.05em' }}>جزئیات رزرو</p>
          </div>

          <div style={{ padding: '8px 0' }}>
            {[
              { icon: Building2,   label: 'پلاتو',         value: studioName },
              { icon: CalendarDays, label: 'تاریخ',         value: toFa(date) },
              { icon: Clock,        label: 'بازه زمانی',    value: `${toFa(startTime)} — ${toFa(endTime)}` },
              { icon: CreditCard,   label: 'مبلغ پرداخت',  value: `${priceFormatted} تومان` },
              { icon: Hash,         label: 'کد پیگیری',     value: refIdFa },
              { icon: Hash,         label: 'شماره رزرو',    value: `#${bookingIdShort}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 20px', borderBottom: '1px solid #F5F5F5',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={15} color="#A0A0A0" />
                  <span style={{ fontSize: 13, color: '#717171' }}>{label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#171717' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* دکمه‌ها */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/dashboard/bookings"
            style={{
              display: 'block', textAlign: 'center',
              background: '#8B1E1E', color: 'white',
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
