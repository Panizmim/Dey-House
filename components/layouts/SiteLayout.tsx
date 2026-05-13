'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Logo } from '@/components/ui/Logo'
import { LayoutDashboard, Menu, X, ChevronLeft } from '@/components/ui/icons'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/events',  label: 'رویدادها' },
  { href: '/cafe',    label: 'منو' },
  { href: '/artist',  label: 'همکاری هنرمندان' },
  { href: '/about',   label: 'درباره ما' },
]

/* ─── Navbar ─── */
function Navbar() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0)
      setMobileMenuOpen(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const close = () => setMobileMenuOpen(false)

  return (
    <>
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-[#EFEFEF] bg-white/95 backdrop-blur-md text-neutral-700'
            : 'border-b border-transparent bg-transparent text-white'
        )}
        style={{ height: '68px' }}
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
              {session ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 group relative pb-0.5"
                  style={{ fontSize: '18px', fontWeight: 600 }}
                >
                  <LayoutDashboard size={18} />
                  <span>داشبورد</span>
                  <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-current transition-all duration-200 group-hover:w-full" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="relative pb-0.5 group"
                  style={{ fontSize: '18px', fontWeight: 600 }}
                >
                  ورود / ثبت‌نام
                  <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-current transition-all duration-200 group-hover:w-full" />
                </Link>
              )}
              <Link
                href="/booking"
                className="relative pb-0.5 group"
                style={{ fontSize: '18px', fontWeight: 600 }}
              >
                رزرو پلاتو
                <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-current transition-all duration-200 group-hover:w-full" />
              </Link>
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
                <Link
                  href="/dashboard"
                  onClick={close}
                  className="flex items-center justify-center gap-2 text-center rounded-lg bg-white"
                  style={{
                    width: '100%',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#171717',
                  }}
                >
                  <LayoutDashboard size={16} />
                  داشبورد من
                </Link>
                <Link
                  href="/booking"
                  onClick={close}
                  className="block text-center text-white rounded-lg"
                  style={{
                    width: '100%',
                    background: '#8B1E1E',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 700,
                  }}
                >
                  رزرو پلاتو
                </Link>
                <button
                  onClick={() => { close(); signOut() }}
                  className="w-full text-center"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#717171',
                    cursor: 'pointer',
                  }}
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={close}
                  className="block text-center rounded-lg bg-white"
                  style={{
                    width: '100%',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#171717',
                  }}
                >
                  ورود / ثبت‌نام
                </Link>
                <Link
                  href="/booking"
                  onClick={close}
                  className="block text-center text-white"
                  style={{
                    width: '100%',
                    background: '#8B1E1E',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 700,
                  }}
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
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
