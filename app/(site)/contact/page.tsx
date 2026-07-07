import { MapPin, Phone, Mail, ExternalLink } from '@/components/ui/icons'
import PageHero from '@/components/ui/PageHero'

const phones = [
  { label: 'کافه',  tel: '09029282135', display: '۰۹۰۲۹۲۸۲۱۳۵' },
  { label: 'پلاتو', tel: '09020282145', display: '۰۹۰۲۰۲۸۲۱۴۵' },
  { label: 'گالری', tel: '09189282145', display: '۰۹۱۸۹۲۸۲۱۴۵' },
]

function InfoIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center flex-shrink-0">
      {children}
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      <PageHero title="تماس با ما" subtitle="هر سوالی دارید، خوشحال می‌شویم پاسخ‌گو باشیم" />

      <div className="max-w-container mx-auto px-6 md:px-8 lg:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">

          {/* ── ستون اطلاعات تماس ── */}
          <div className="flex flex-col gap-4">

            {/* آدرس */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-card p-6 flex items-start gap-4">
              <InfoIcon>
                <MapPin size={22} className="text-brand" />
              </InfoIcon>
              <div>
                <p className="text-sm text-neutral-500 mb-1">آدرس</p>
                <p className="text-lg font-bold text-neutral-900 leading-relaxed">
                  خیابان سنائی، کوچه فریدون نژادکی، پلاک ۳
                </p>
              </div>
            </div>

            {/* ایمیل */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-card p-6 flex items-center gap-4">
              <InfoIcon>
                <Mail size={21} className="text-brand" />
              </InfoIcon>
              <div>
                <p className="text-sm text-neutral-500 mb-1">ایمیل</p>
                <a
                  href="mailto:info@deyhouse.ir"
                  dir="ltr"
                  className="text-lg font-bold text-neutral-900 hover:text-brand transition-colors duration-150"
                  style={{ display: 'inline-block' }}
                >
                  info@deyhouse.ir
                </a>
              </div>
            </div>

            {/* شماره‌های تماس */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-card p-6 flex-1">
              <div className="flex items-center gap-4 mb-5">
                <InfoIcon>
                  <Phone size={21} className="text-brand" />
                </InfoIcon>
                <p className="text-sm text-neutral-500">تماس تلفنی</p>
              </div>
              <div className="flex flex-col gap-4">
                {phones.map(({ label, tel, display }, i) => (
                  <div
                    key={tel}
                    className={`flex items-center justify-between ${i !== phones.length - 1 ? 'pb-4 border-b border-neutral-200' : ''}`}
                  >
                    <span className="text-base text-neutral-500 font-medium">{label}</span>
                    <a
                      href={`tel:${tel}`}
                      dir="ltr"
                      className="text-lg font-bold text-neutral-900 hover:text-brand transition-colors duration-150"
                      style={{ letterSpacing: '0.01em' }}
                    >
                      {display}
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── نقشه ── */}
          <a
            href="https://nshn.ir/_bvk7KWxiB9q"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
            style={{ textDecoration: 'none' }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-card border border-neutral-200" style={{ minHeight: 280 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/map.png"
                alt="نقشه خانه دی"
                className="group-hover:scale-[1.03] transition-transform duration-500"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white rounded-chip px-3.5 py-2 text-xs font-bold text-neutral-900 shadow-card">
                <MapPin size={13} className="text-brand" />
                نشان روی نقشه
                <ExternalLink size={11} className="text-neutral-500" />
              </div>
            </div>
          </a>

        </div>
      </div>
    </>
  )
}
