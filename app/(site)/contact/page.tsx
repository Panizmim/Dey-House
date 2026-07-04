import { MapPin, Phone, Mail, ExternalLink } from '@/components/ui/icons'
import PageHero from '@/components/ui/PageHero'

const phones = [
  { label: 'کافه',  tel: '09029282135', display: '۰۹۰۲۹۲۸۲۱۳۵' },
  { label: 'پلاتو', tel: '09020282145', display: '۰۹۰۲۰۲۸۲۱۴۵' },
  { label: 'گالری', tel: '09189282145', display: '۰۹۱۸۹۲۸۲۱۴۵' },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero title="تماس با ما" />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 96px' }}>

        {/* ── نقشه ── */}
        <a
          href="https://nshn.ir/_bvk7KWxiB9q"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', textDecoration: 'none', marginBottom: 40 }}
        >
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 4 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/map.png"
              alt="نقشه خانه دی"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(30%)' }}
            />
            <div style={{
              position: 'absolute', bottom: 16, left: 16,
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'white', padding: '7px 14px', borderRadius: 100,
              fontSize: 12, fontWeight: 700, color: '#171717',
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            }}>
              <MapPin size={12} color="#801A00" />
              نشان روی نقشه
              <ExternalLink size={10} color="#999" />
            </div>
          </div>
        </a>

        {/* ── آدرس ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid #F0F0F0' }}>
          <MapPin size={18} color="#801A00" style={{ flexShrink: 0, marginTop: 3 }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: '#171717', lineHeight: 1.8, margin: 0 }}>
            خیابان سنائی، کوچه فریدون نژادکی، پلاک ۳
          </p>
        </div>

        {/* ── ایمیل ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <Mail size={17} color="#801A00" style={{ flexShrink: 0 }} />
          <a
            href="mailto:info@deyhouse.ir"
            dir="ltr"
            style={{ fontSize: 16, fontWeight: 500, color: '#171717', textDecoration: 'none', transition: 'color 150ms' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#801A00' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#171717' }}
          >
            info@deyhouse.ir
          </a>
        </div>

        {/* ── شماره‌ها ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {phones.map(({ label, tel, display }) => (
            <div key={tel} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Phone size={17} color="#801A00" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: '#A0A0A0', fontWeight: 400, minWidth: 36 }}>{label}</span>
              <a
                href={`tel:${tel}`}
                dir="ltr"
                style={{ fontSize: 16, fontWeight: 600, color: '#171717', textDecoration: 'none', transition: 'color 150ms', letterSpacing: '0.01em' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#801A00' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#171717' }}
              >
                {display}
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
