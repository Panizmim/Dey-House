import Link from 'next/link'
import { SiteLayout } from '@/components/layouts/SiteLayout'

export default function NotFound() {
  return (
    <SiteLayout>
      <div
        className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center"
        dir="rtl"
      >
        <h1
          className="font-black text-[#171717]"
          style={{ fontSize: 'clamp(28px, 5vw, 42px)', letterSpacing: '-0.02em', marginBottom: 16 }}
        >
          صفحه یافت نشد!
        </h1>

        <p
          className="font-light text-[#888]"
          style={{ fontSize: 15, lineHeight: 2, marginBottom: 40 }}
        >
          صفحه‌ای که دنبالش می‌گردید وجود ندارد یا جابه‌جا شده.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: '#801A00',
            color: 'white',
            borderRadius: 12,
            padding: '14px 36px',
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          رفتن به صفحه‌ی اصلی خانه دی
        </Link>
      </div>
    </SiteLayout>
  )
}
