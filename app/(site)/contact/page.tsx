'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, ExternalLink } from '@/components/ui/icons'

const phones = [
  { label: 'کافه',  tel: '09029282135', display: '۰۹۰۲۹۲۸۲۱۳۵' },
  { label: 'پلاتو', tel: '09020282145', display: '۰۹۰۲۰۲۸۲۱۴۵' },
  { label: 'گالری', tel: '09189282145', display: '۰۹۱۸۹۲۸۲۱۴۵' },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* ─── Hero ─── */}
      <section style={{ background: '#1A0A0A', padding: '80px 24px 72px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', marginBottom: 20, fontWeight: 400 }}>
            CONTACT
          </p>
          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 64px)', fontWeight: 900,
            color: 'white', lineHeight: 1.2, marginBottom: 20,
            letterSpacing: '-0.02em',
          }}>
            با ما در ارتباط باشید
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', fontWeight: 300, lineHeight: 1.9, maxWidth: 480 }}>
            از رزرو پلاتو تا سفارش سفارشی برای کافه — هر سوالی دارید خوشحال می‌شیم بشنویم.
          </p>
        </div>
      </section>

      {/* ─── سه بلوک اطلاعاتی ─── */}
      <section style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>

            {/* آدرس */}
            <div style={{ padding: '40px 0 40px', borderLeft: '1px solid #EBEBEB' }}>
              <div style={{ paddingLeft: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: '#F9F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={14} color="#801A00" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#B0B0B0', letterSpacing: '0.1em' }}>آدرس</span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#171717', lineHeight: 1.7, marginBottom: 8 }}>
                  خیابان سنائی
                </p>
                <p style={{ fontSize: 13, color: '#888', fontWeight: 300, lineHeight: 1.9, marginBottom: 20 }}>
                  کوچه فریدون نژادکی، پلاک ۳
                </p>
                <a
                  href="https://nshn.ir/_bvk7KWxiB9q"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 12, fontWeight: 700, color: '#801A00',
                    textDecoration: 'none',
                  }}
                >
                  نشان روی نقشه
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* تلفن */}
            <div style={{ padding: '40px 0 40px', borderLeft: '1px solid #EBEBEB' }}>
              <div style={{ paddingLeft: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: '#F9F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={14} color="#801A00" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#B0B0B0', letterSpacing: '0.1em' }}>تماس مستقیم</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {phones.map(({ label, tel, display }) => (
                    <div key={tel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: '#B0B0B0', fontWeight: 400 }}>{label}</span>
                      <a
                        href={`tel:${tel}`}
                        dir="ltr"
                        style={{ fontSize: 15, fontWeight: 700, color: '#171717', textDecoration: 'none', letterSpacing: '0.01em', transition: 'color 150ms' }}
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

            {/* ایمیل + اینستاگرام */}
            <div style={{ padding: '40px 0 40px' }}>
              <div style={{ paddingLeft: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: '#F9F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={14} color="#801A00" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#B0B0B0', letterSpacing: '0.1em' }}>شبکه‌های ارتباطی</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 11, color: '#C0C0C0', marginBottom: 4, fontWeight: 400 }}>ایمیل</p>
                    <a
                      href="mailto:info@deyhouse.ir"
                      dir="ltr"
                      style={{ fontSize: 14, fontWeight: 600, color: '#171717', textDecoration: 'none', transition: 'color 150ms' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#801A00' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#171717' }}
                    >
                      info@deyhouse.ir
                    </a>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#C0C0C0', marginBottom: 4, fontWeight: 400 }}>اینستاگرام</p>
                    <a
                      href="https://www.instagram.com/dey__house?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      style={{ fontSize: 14, fontWeight: 600, color: '#171717', textDecoration: 'none', transition: 'color 150ms' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#801A00' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#171717' }}
                    >
                      @dey__house
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── نقشه ─── */}
      <section style={{ padding: '56px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#171717', letterSpacing: '-0.01em' }}>موقعیت مکانی</h2>
          <p style={{ fontSize: 13, color: '#999', marginTop: 6, fontWeight: 300 }}>خیابان سنائی، کوچه فریدون نژادکی، پلاک ۳</p>
        </div>

        <a
          href="https://nshn.ir/_bvk7KWxiB9q"
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
          style={{ textDecoration: 'none' }}
        >
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 340 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/map.png"
              alt="نقشه خانه دی"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* overlay */}
            <div
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 250ms' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.35)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)' }}
            />
            {/* badge */}
            <div style={{
              position: 'absolute', bottom: 20, right: 20,
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#801A00', color: 'white',
              padding: '10px 20px', borderRadius: 100,
              fontSize: 13, fontWeight: 700, letterSpacing: '0.01em',
              boxShadow: '0 4px 20px rgba(128,26,0,0.35)',
            }}>
              <MapPin size={13} color="white" />
              باز کردن در نشان
              <ExternalLink size={11} color="white" />
            </div>
          </div>
        </a>
      </section>

      {/* ─── CTA پایین ─── */}
      <section style={{ background: '#F9F0F0', borderTop: '1px solid #F0E8E8', padding: '48px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 900, color: '#171717', marginBottom: 6 }}>می‌خواهید پلاتو رزرو کنید؟</p>
            <p style={{ fontSize: 13, color: '#888', fontWeight: 300 }}>سیستم رزرو آنلاین ما در دسترس شماست</p>
          </div>
          <Link
            href="/booking"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#801A00', color: 'white',
              padding: '13px 28px', borderRadius: 100,
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              letterSpacing: '0.01em', whiteSpace: 'nowrap',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#6B1600' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#801A00' }}
          >
            رزرو آنلاین
          </Link>
        </div>
      </section>

    </div>
  )
}
