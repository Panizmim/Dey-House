import Link from 'next/link'
import Image from 'next/image'
import { SiteLayout } from '@/components/layouts/SiteLayout'

export default function NotFound() {
  return (
    <SiteLayout>
      <div
        className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center"
        dir="rtl"
      >
        {/* عدد ۴۰۴ */}
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <span
            style={{
              fontSize: 'clamp(120px, 20vw, 200px)',
              fontWeight: 900,
              color: '#F5EEEE',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              display: 'block',
              userSelect: 'none',
            }}
          >
            ۴۰۴
          </span>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/images/logo.primary color.png"
              alt="خانه دی"
              width={100}
              height={40}
              className="object-contain"
              style={{ mixBlendMode: 'multiply', opacity: 0.5 }}
            />
          </div>
        </div>

        {/* متن */}
        <h1
          className="font-black text-[#171717]"
          style={{ fontSize: 'clamp(22px, 4vw, 32px)', letterSpacing: '-0.02em', marginBottom: 12 }}
        >
          صفحه‌ای یافت نشد
        </h1>
        <p
          className="font-light text-[#888]"
          style={{ fontSize: 15, lineHeight: 2, maxWidth: 400, marginBottom: 40 }}
        >
          صفحه‌ای که دنبالش می‌گردید وجود ندارد یا جابه‌جا شده.
          <br />
          از منوی بالا یا دکمه زیر می‌توانید ادامه دهید.
        </p>

        {/* دکمه‌ها */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              background: '#801A00',
              color: 'white',
              borderRadius: 12,
              padding: '14px 32px',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'opacity 150ms',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            بازگشت به خانه
          </Link>
          <Link
            href="/events"
            style={{
              display: 'inline-block',
              border: '1px solid #E5E5E5',
              color: '#404040',
              borderRadius: 12,
              padding: '14px 32px',
              fontSize: 15,
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'border-color 150ms',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#801A00'; (e.currentTarget as HTMLElement).style.color = '#801A00' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E5E5'; (e.currentTarget as HTMLElement).style.color = '#404040' }}
          >
            رویدادها
          </Link>
        </div>
      </div>
    </SiteLayout>
  )
}
