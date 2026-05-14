'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { Menu, X, ChevronLeft } from '@/components/ui/icons'
import { ChevronDown, User, CalendarDays, CreditCard, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

const navLinks = [
  { href: '/events',  label: 'رویدادها' },
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
          fontSize: '15px', fontWeight: 600, color: textColor,
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
              background: '#8B1E1E', color: 'white',
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
                fontSize: 13, fontWeight: 600, color: '#8B1E1E',
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
        className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
        style={{
          height: '68px',
          background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #EFEFEF' : 'none',
          color: scrolled ? '#171717' : 'white',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-8 h-[68px] grid grid-cols-3 items-center">

          {/* راست — لوگو */}
          <div className="flex items-center">
            <Link href="/" onClick={close}>
              <div className="relative w-24 h-10">
                <Image
                  src="/images/logo.png"
                  alt="خانه دی"
                  fill
                  className="object-contain"
                  style={
                    scrolled
                      ? { mixBlendMode: 'multiply' }
                      : { filter: 'invert(1) grayscale(1) brightness(5)', mixBlendMode: 'screen' }
                  }
                />
              </div>
            </Link>
          </div>

          {/* وسط — لینک‌ها (فقط desktop) */}
          <div className="hidden lg:flex items-center justify-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: '18px', fontWeight: 400 }}
                className="px-3 py-1.5 transition-opacity duration-200 hover:opacity-70 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* چپ — دکمه‌های desktop / همبرگر موبایل */}
          <div className="flex items-center justify-end gap-6">
            {/* دکمه‌های desktop */}
            <div className="hidden lg:flex items-center gap-6">
              {/* رزرو پلاتو — سمت راست */}
              <Link
                href="/#studios"
                className="relative pb-0.5 group"
                style={{ fontSize: '15px', fontWeight: 600 }}
              >
                رزرو پلاتو
                <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-current transition-all duration-200 group-hover:w-full" />
              </Link>

              {/* ورود/ثبت‌نام یا منوی کاربر — سمت چپ */}
              {session ? (
                <UserDropdown scrolled={scrolled} />
              ) : (
                <Link
                  href="/login"
                  className="relative pb-0.5 group"
                  style={{ fontSize: '15px', fontWeight: 600 }}
                >
                  ورود / ثبت‌نام
                  <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-current transition-all duration-200 group-hover:w-full" />
                </Link>
              )}
            </div>

            {/* دکمه همبرگر موبایل */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
              style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer' }}
              aria-label={mobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
            >
              {mobileMenuOpen
                ? <X size={24} className="text-inherit" />
                : <Menu size={24} className="text-inherit" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* منوی کشویی موبایل */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed right-0 left-0 bottom-0 bg-white overflow-y-auto z-[49]"
          style={{
            top: '68px',
            padding: '24px',
            animation: 'mobileMenuIn 200ms ease forwards',
          }}
        >
          {/* بخش ۱ — لینک‌های ناوبار */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="flex items-center justify-between rounded-lg hover:bg-[#FAFAFA] transition-colors duration-150"
                style={{ padding: '14px 16px', fontSize: '16px', fontWeight: 400, color: '#171717' }}
              >
                <span>{link.label}</span>
                <ChevronLeft size={16} style={{ color: '#C0C0C0', flexShrink: 0 }} />
              </Link>
            ))}
          </div>

          {/* divider */}
          <div style={{ height: '1px', background: '#EFEFEF', margin: '16px 0' }} />

          {/* بخش ۲ — دکمه‌های اکشن */}
          <div className="flex flex-col gap-[10px]">
            {session ? (
              <>
                {/* آواتار + نام */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid #EFEFEF', borderRadius: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: '#8B1E1E', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, flexShrink: 0,
                  }}>
                    {(session.user?.name || 'ک').charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#171717' }}>{session.user?.name || 'کاربر'}</p>
                    <p style={{ fontSize: 11, color: '#A0A0A0' }}>{session.user?.email || ''}</p>
                  </div>
                </div>
                {[
                  { href: '/dashboard/profile',  label: 'اطلاعات شخصی' },
                  { href: '/dashboard/bookings', label: 'رزروهای قبلی'  },
                  { href: '/dashboard/payments', label: 'پرداخت‌ها'     },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    style={{
                      display: 'block', padding: '12px 16px',
                      border: '1px solid #EFEFEF', borderRadius: 8,
                      fontSize: 14, color: '#404040', textDecoration: 'none',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/#studios"
                  onClick={close}
                  className="block text-center text-white"
                  style={{ background: '#8B1E1E', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: 700 }}
                >
                  رزرو پلاتو
                </Link>
                <button
                  onClick={() => { close(); signOut() }}
                  style={{
                    background: 'transparent', border: 'none', padding: '14px',
                    fontSize: '14px', fontWeight: 600, color: '#8B1E1E',
                    cursor: 'pointer', fontFamily: 'YekanBakh, Tahoma, sans-serif',
                  }}
                >
                  خروج از حساب
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={close}
                  style={{
                    display: 'block', textAlign: 'center', borderRadius: '8px',
                    border: '1px solid #E5E5E5', padding: '14px',
                    fontSize: '15px', fontWeight: 600, color: '#171717',
                  }}
                >
                  ورود / ثبت‌نام
                </Link>
                <Link
                  href="/#studios"
                  onClick={close}
                  className="block text-center text-white"
                  style={{ background: '#8B1E1E', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: 700 }}
                >
                  رزرو پلاتو
                </Link>
              </>
            )}
          </div>

          {/* divider دوم */}
          <div style={{ height: '1px', background: '#EFEFEF', margin: '16px 0' }} />

          {/* بخش ۳ — اطلاعات تماس */}
          <div style={{ padding: '16px', background: '#FAFAFA', borderRadius: '8px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#171717', marginBottom: '8px' }}>
              خانه دی — کافه‌گالری فرهنگی معاصر
            </p>
            <p style={{ fontSize: '12px', color: '#717171', fontWeight: 300 }}>
              تهران | @Dey___house
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes mobileMenuIn {
          from { transform: translateY(-8px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
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
  { label: 'درباره ما',       href: '/about'  },
  { label: 'همکاری هنری',     href: '/artist' },
  { label: 'اخبار',           href: '#'       },
  { label: 'قوانین و مقررات', href: '#'       },
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
            <div className="flex items-center gap-3">
              <Logo size="md" light />
              <span className="text-white font-bold text-body">خانه دی</span>
            </div>
            <p className="text-white/40 text-base font-light leading-loose">
              برای زندگی تازه‌ای که هنوز نزیسته‌ایم
            </p>
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-white/40 text-sm">تهران، خیابان ولیعصر</span>
              <span className="text-white/40 text-sm">۰۲۱-۸۸۴۴-۵۵۶۶</span>
              <a
                href="mailto:info@deyhouse.ir"
                className="text-white/40 text-sm hover:text-white/80 transition-colors duration-200"
              >
                info@deyhouse.ir
              </a>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div className="flex flex-col gap-4">
              <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/35">خدمات</h4>
              <nav className="flex flex-col gap-3">
                {footerServices.map((item) => (
                  <Link key={item.label} href={item.href} className="text-base text-white/55 hover:text-white/90 transition-colors duration-200">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/35">اطلاعات</h4>
              <nav className="flex flex-col gap-3">
                {footerInfo.map((item) => (
                  <Link key={item.label} href={item.href} className="text-base text-white/55 hover:text-white/90 transition-colors duration-200">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/35">ارتباط</h4>
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
      <main className={isHomePage ? 'flex-1' : 'flex-1 pt-[68px]'}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
