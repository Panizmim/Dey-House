import PageHero from '@/components/ui/PageHero'
import { MapPin } from '@/components/ui/icons'

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="تماس با ما"
        subtitle="در تماس باشید"
      />
      <div className="max-w-[860px] mx-auto px-8 py-16">
        <p className="text-[#404040]" style={{ fontSize: '15px', lineHeight: 2 }}>
          برای ارتباط با خانه دی از طریق شبکه‌های اجتماعی یا ایمیل info@deyhouse.ir با ما در تماس باشید.
        </p>

        {/* شماره‌های تماس */}
        <div className="mt-12">
          <h2 className="text-[18px] font-black text-[#171717] mb-5">شماره‌های تماس</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'کافه',   phone: '۰۹۰۲۹۲۸۲۱۳۵' },
              { label: 'پلاتو',  phone: '۰۹۰۲۰۲۸۲۱۴۵' },
              { label: 'گالری', phone: '۰۹۱۸۹۲۸۲۱۴۵' },
            ].map(({ label, phone }) => (
              <div key={label} className="flex items-center justify-between border-b border-[#F0F0F0] pb-3">
                <span style={{ fontSize: 14, color: '#404040', fontWeight: 400 }}>{label}</span>
                <a
                  href={`tel:${phone}`}
                  dir="ltr"
                  style={{ fontSize: 15, color: '#171717', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.02em' }}
                  className="hover:text-[#801A00] transition-colors"
                >
                  {phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* نقشه */}
        <div className="mt-12">
          <h2 className="text-[18px] font-black text-[#171717] mb-4">موقعیت مکانی</h2>
          <a
            href="https://nshn.ir/_bvk7KWxiB9q"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            style={{ textDecoration: 'none' }}
          >
            <div
              className="rounded-xl border border-[#E0E0E0] transition-all duration-200 hover:border-[#801A00] hover:shadow-lg"
              style={{ height: 260, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/map.png"
                alt="نقشه خانه دی"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                  <MapPin size={26} color="#801A00" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 }}>خانه دی</p>
                  <p style={{ fontSize: 12, color: '#555', fontWeight: 400 }}>برای مشاهده مسیر کلیک کنید</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#801A00', color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  <MapPin size={11} color="white" />
                  باز کردن در نشان
                </div>
              </div>
            </div>
          </a>
          <div className="flex items-start gap-3 mt-4">
            <MapPin size={18} color="#801A00" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-bold text-[#171717] mb-1">آدرس</p>
              <p className="text-[13px] text-[#717171] font-light leading-relaxed">
                خیابان سنائی، کوچه فریدون نژادکی، پلاک ۳
              </p>
              <a
                href="https://nshn.ir/_bvk7KWxiB9q"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-[12px] font-bold hover:opacity-75 transition-opacity"
                style={{ color: '#801A00' }}
              >
                مشاهده در نشان
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
