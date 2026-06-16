'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, User, CalendarDays, CreditCard, LogOut, MapPin, Phone } from '@/components/ui/icons'
import { signOut } from 'next-auth/react'
import { LoginModal }    from '@/components/ui/LoginModal'
import { RegisterModal } from '@/components/ui/RegisterModal'

const navLinks = [
  { href: '/events',  label: 'رویدادها' },
  { href: '/gallery', label: 'گالری دیـ ده' },
  { href: '/cafe',    label: 'منو' },
  { href: '/artist',  label: 'همکاری هنرمندان' },
  { href: '/about',   label: 'درباره ما' },
]

/* ─── منوی کاربر لاگین‌شده ─── */
function UserDropdown({ scrolled }: { scrolled: boolean }) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const name    = session?.user?.name  || 'کاربر'
  const email   = session?.user?.email || ''
  const initial = name.charAt(0)

  const textColor = scrolled ? '#171717' : 'white'

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: '14px', fontWeight: 600, color: textColor,
          fontFamily: 'YekanBakh, Tahoma, sans-serif',
          padding: 0,
        }}
      >
        {name}
        <ChevronDown
          size={15}
          style={{
            transition: 'transform 200ms',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* dropdown panel */}
      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 12px)', left: 0,
            minWidth: '260px', background: 'white',
            border: '1px solid #EFEFEF', borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            zIndex: 100, overflow: 'hidden',
          }}
        >
          {/* هدر: آواتار + نام + ایمیل */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #F5F5F5' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: '#801A00', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, flexShrink: 0,
            }}>
              {initial}
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#171717', marginBottom: 2 }}>{name}</p>
              <p style={{ fontSize: 12, color: '#A0A0A0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</p>
            </div>
          </div>

          {/* آیتم‌های منو */}
          <div style={{ padding: '8px 0' }}>
            {[
              { href: '/dashboard/profile',  icon: <User size={16} />,         label: 'اطلاعات شخصی' },
              { href: '/dashboard/bookings', icon: <CalendarDays size={16} />, label: 'رزروهای قبلی'  },
              { href: '/dashboard/payments', icon: <CreditCard size={16} />,   label: 'پرداخت‌ها'     },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                  gap: 10, padding: '11px 20px',
                  fontSize: 13, color: '#404040', textDecoration: 'none',
                  transition: 'background 150ms',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FAFAFA' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ color: '#A0A0A0' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* خروج */}
          <div style={{ borderTop: '1px solid #F5F5F5', padding: '8px 0 4px' }}>
            <button
              onClick={() => { setOpen(false); signOut() }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                gap: 10, padding: '11px 20px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, color: '#801A00',
                fontFamily: 'YekanBakh, Tahoma, sans-serif',
                transition: 'background 150ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#FDF5F5' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <LogOut size={16} />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Navbar ─── */
function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const hasHero = pathname === '/'
  const [scrolled, setScrolled] = useState(!hasHero)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginOpen,    setLoginOpen]    = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(!hasHero || window.scrollY > 10)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [hasHero])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const close = () => setMobileMenuOpen(false)

  return (
    <>
      <header
        className="fixed top-0 right-0 left-0 z-50 transition-all duration-300 h-[60px] lg:h-[68px]"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #EFEFEF' : 'none',
          color: scrolled ? '#171717' : 'white',
        }}
      >
        {/* ── موبایل ── */}
        <div className="lg:hidden relative flex items-center justify-between px-4 h-[60px]">
          {/* همبرگر — راست */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }}
            aria-label="باز کردن منو"
          >
            <Menu size={22} />
          </button>

          {/* لوگو — وسط */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" onClick={close}>
              <div className="relative" style={{ width: 76, height: 30 }}>
                <Image
                  src="/images/logo.primary color.png"
                  alt="خانه دی"
                  fill
                  className="object-contain"
                  style={scrolled ? { mixBlendMode: 'multiply' } : { filter: 'brightness(0) invert(1)' }}
                />
              </div>
            </Link>
          </div>

          {/* آیکون کاربر — چپ */}
          {session ? (
            <Link
              href="/dashboard/profile"
              style={{ color: 'inherit', display: 'flex', alignItems: 'center', padding: '6px' }}
              aria-label="حساب کاربری"
            >
              <User size={22} />
            </Link>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              style={{ color: 'inherit', display: 'flex', alignItems: 'center', padding: '6px', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="ورود به حساب"
            >
              <User size={22} />
            </button>
          )}
        </div>

        {/* ── دسکتاپ ── */}
        <div className="hidden lg:grid max-w-[1280px] mx-auto px-8 h-[68px] grid-cols-3 items-center">
          {/* راست — لوگو */}
          <div className="flex items-center">
            <Link href="/" onClick={close}>
              <div className="relative w-24 h-10">
                <Image
                  src="/images/logo.primary color.png"
                  alt="خانه دی"
                  fill
                  className="object-contain"
                  style={
                    scrolled
                      ? { mixBlendMode: 'multiply' }
                      : { filter: 'brightness(0) invert(1)' }
                  }
                />
              </div>
            </Link>
          </div>

          {/* وسط — لینک‌ها */}
          <div className="flex items-center justify-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: '15px', fontWeight: 400 }}
                className="px-3 py-1.5 transition-opacity duration-200 hover:opacity-70 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* چپ — دکمه‌ها */}
          <div className="flex items-center justify-end gap-6">
            <Link
              href="/#studios"
              className="relative pb-0.5 group"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              رزرو پلاتو
              <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-current transition-all duration-200 group-hover:w-full" />
            </Link>

            {session ? (
              <UserDropdown scrolled={scrolled} />
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="relative pb-0.5 group"
                style={{ fontSize: '14px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontFamily: 'YekanBakh, Tahoma, sans-serif' }}
              >
                ورود / ثبت‌نام
                <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-current transition-all duration-200 group-hover:w-full" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── منوی فول‌پیج موبایل ── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden z-[52] bg-white flex flex-col overflow-hidden"
          style={{ animation: 'menuFadeIn 200ms ease forwards', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, minHeight: '-webkit-fill-available' }}
        >
          {/* هدر: فقط دکمه بستن */}
          <div className="flex items-center px-5" style={{ height: 60, flexShrink: 0 }}>
            <button
              onClick={close}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: '#171717' }}
              aria-label="بستن منو"
            >
              <X size={24} />
            </button>
          </div>

          {/* لوگو — سمت راست، بالای لینک‌ها */}
          <div className="flex justify-start px-6 pb-4" style={{ flexShrink: 0 }}>
            <Link href="/" onClick={close}>
              <div className="relative" style={{ width: 96, height: 38 }}>
                <Image
                  src="/images/logo.primary color.png"
                  alt="خانه دی"
                  fill
                  className="object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </Link>
          </div>

          {/* لینک‌ها */}
          <div className="flex flex-col flex-1 overflow-y-auto">
            {[...navLinks, { href: '/contact', label: 'تماس با ما' }].map((link, i, arr) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '18px 24px',
                  fontSize: 18, fontWeight: 600, color: '#171717',
                  borderBottom: i === arr.length - 1 ? 'none' : '1px solid #F0F0F0',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* دکمه‌های اکشن */}
          <div
            className="px-5 pt-4 flex flex-col gap-3"
            style={{ flexShrink: 0, paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
          >
            <Link
              href="/#studios"
              onClick={close}
              style={{
                display: 'block', textAlign: 'center',
                background: '#801A00', color: 'white',
                borderRadius: 12, padding: '15px',
                fontSize: 16, fontWeight: 700, textDecoration: 'none',
              }}
            >
              رزرو پلاتو
            </Link>

            {session ? (
              <button
                onClick={() => { close(); signOut() }}
                style={{
                  background: 'transparent', border: '1px solid #E5E5E5',
                  borderRadius: 12, padding: '15px',
                  fontSize: 15, fontWeight: 600, color: '#801A00',
                  cursor: 'pointer', fontFamily: 'YekanBakh, Tahoma, sans-serif',
                  width: '100%',
                }}
              >
                خروج از حساب
              </button>
            ) : (
              <button
                onClick={() => { close(); setLoginOpen(true) }}
                style={{
                  display: 'block', textAlign: 'center', width: '100%',
                  border: '1px solid #E5E5E5',
                  borderRadius: 12, padding: '15px',
                  fontSize: 15, fontWeight: 600, color: '#171717',
                  background: 'white', cursor: 'pointer',
                  fontFamily: 'YekanBakh, Tahoma, sans-serif',
                }}
              >
                ورود / ثبت‌نام
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes menuFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true) }}
      />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true) }}
      />
    </>
  )
}

/* ─── Footer ─── */
const footerServices = [
  { label: 'رزرو پلاتو', href: '/booking' },
  { label: 'رویدادها',   href: '/events'  },
  { label: 'کافه',       href: '/cafe'    },
  { label: 'گالری',      href: '/gallery' },
]

const footerInfo = [
  { label: 'درباره ما',   href: '/about'   },
  { label: 'همکاری هنری', href: '/artist'  },
  { label: 'تماس با ما',  href: '/contact' },
]

const socialLinks = [
  { label: 'اینستاگرام', href: '#' },
  { label: 'تلگرام',     href: '#' },
  { label: 'واتساپ',     href: '#' },
]

function Footer() {
  return (
    <footer className="bg-neutral-900">
      <div className="max-w-container mx-auto px-6 md:px-8 lg:px-12 pt-14 pb-8">
        <div className="flex flex-col md:flex-row gap-12">

          <div className="md:w-[30%] flex flex-col gap-5">
            <div className="flex flex-col gap-1 mb-4">
              <Image
                src="/images/logo.primary color.png"
                alt="خانه دی"
                width={140}
                height={46}
                className="object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <p className="text-white/40 font-light leading-loose" style={{ fontSize: '14px' }}>
                برای زندگی تازه‌ای که هنوز نزیسته‌ایم
              </p>
            </div>

            {/* آدرس */}
            <div className="flex items-start gap-2">
              <MapPin size={14} className="flex-shrink-0 mt-0.5" style={{ opacity: 0.5, color: 'white' }} />
              <p className="font-light leading-relaxed" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)' }}>
                خیابان سنائی، کوچه فریدون نژادکی، پلاک ۳
              </p>
            </div>

            {/* شماره‌های تماس */}
            <div className="flex flex-col gap-2">
              {[
                { label: 'کافه',  tel: '09029282135', display: '۰۹۰۲۹۲۸۲۱۳۵' },
                { label: 'پلاتو', tel: '09020282145', display: '۰۹۰۲۰۲۸۲۱۴۵' },
                { label: 'گالری', tel: '09189282145', display: '۰۹۱۸۹۲۸۲۱۴۵' },
              ].map(({ label, tel, display }) => (
                <div key={tel} className="flex items-center gap-2">
                  <Phone size={13} style={{ opacity: 0.4, color: 'white', flexShrink: 0 }} />
                  <span className="font-light" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.35)' }}>
                    {label}
                  </span>
                  <a
                    href={`tel:${tel}`}
                    className="font-light transition-colors hover:text-white"
                    style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', direction: 'ltr', display: 'inline-block' }}
                  >
                    {display}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white/60" style={{ fontSize: '16px' }}>خدمات</h4>
              <nav className="flex flex-col gap-3">
                {footerServices.map((item) => (
                  <Link key={item.label} href={item.href} className="text-base text-white/55 hover:text-white/90 transition-colors duration-200">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white/60" style={{ fontSize: '16px' }}>اطلاعات</h4>
              <nav className="flex flex-col gap-3">
                {footerInfo.map((item) => (
                  <Link key={item.label} href={item.href} className="text-base text-white/55 hover:text-white/90 transition-colors duration-200">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-white/60" style={{ fontSize: '16px' }}>ارتباط</h4>
              <nav className="flex flex-col gap-3">
                {socialLinks.map((item) => (
                  <a key={item.label} href={item.href} className="text-base text-white/55 hover:text-white/90 transition-colors duration-200">
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.08] mt-12 pt-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-white/30 text-sm">© ۱۴۰۳ خانه دی — تمام حقوق محفوظ است</p>
          <p className="text-white/20 text-sm">deyhouse.ir</p>
        </div>
      </div>
    </footer>
  )
}

/* ─── SiteLayout ─── */
export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={isHomePage ? 'flex-1' : 'flex-1 pt-[60px] lg:pt-[68px]'}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
