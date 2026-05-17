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
              className="rounded-xl border border-[#E0E0E0] transition-all duration-200 hover:border-[#8B1E1E] hover:shadow-lg"
              style={{
                height: 260,
                background: 'linear-gradient(160deg, #e6ede4 0%, #d4e0d0 40%, #c2d4bc 100%)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 12,
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
                <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: 8, background: 'white', borderRadius: 4 }} />
                <div style={{ position: 'absolute', top: '60%', left: 0, right: 0, height: 5, background: 'white', borderRadius: 3 }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '40%', width: 6, background: 'white', borderRadius: 3 }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '70%', width: 4, background: 'white', borderRadius: 2 }} />
              </div>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                  <MapPin size={26} color="#8B1E1E" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 }}>خانه دی</p>
                  <p style={{ fontSize: 12, color: '#555', fontWeight: 400 }}>برای مشاهده مسیر کلیک کنید</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#8B1E1E', color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  <MapPin size={11} color="white" />
                  باز کردن در نشان
                </div>
              </div>
            </div>
          </a>
          <div className="flex items-start gap-3 mt-4">
            <MapPin size={18} color="#8B1E1E" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-bold text-[#171717] mb-1">خانه دی</p>
              <p className="text-[13px] text-[#717171] font-light leading-relaxed">
                تهران — برای مسیریابی روی نقشه کلیک کنید
              </p>
              <a
                href="https://nshn.ir/_bvk7KWxiB9q"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-[12px] font-bold hover:opacity-75 transition-opacity"
                style={{ color: '#8B1E1E' }}
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
