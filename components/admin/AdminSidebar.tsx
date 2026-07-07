'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Calendar, UtensilsCrossed, BookOpen, Phone, Users, Palette, ArrowRight, LogOut, Grid2x2, Monitor, GraduationCap, Building2 } from '@/components/ui/icons'

const navGroups = [
  {
    label: null,
    items: [{ href: '/admin', label: 'خلاصه', icon: LayoutDashboard, exact: true }],
  },
  {
    label: 'محتوا',
    items: [
      { href: '/admin/hero',      label: 'هیرو سکشن', icon: Monitor,         exact: false },
      { href: '/admin/events',    label: 'رویدادها',  icon: Calendar,        exact: false },
      { href: '/admin/workshops', label: 'ورکشاپ‌ها', icon: GraduationCap,  exact: false },
      { href: '/admin/studios',   label: 'پلاتوها',   icon: Building2,       exact: false },
      { href: '/admin/gallery',   label: 'گالری',     icon: Grid2x2,         exact: false },
      { href: '/admin/cafe',      label: 'منوی کافه', icon: UtensilsCrossed, exact: false },
    ],
  },
  {
    label: 'رزروها',
    items: [
      { href: '/admin/bookings',         label: 'رزروها',             icon: BookOpen, exact: false },
      { href: '/admin/contact-requests', label: 'درخواست‌های تماس', icon: Phone,    exact: false },
    ],
  },
  {
    label: 'کاربران',
    items: [
      { href: '/admin/users',       label: 'کاربران',         icon: Users,   exact: false },
      { href: '/admin/submissions', label: 'همکاری هنرمندان', icon: Palette, exact: false },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside style={{
      width: 260,
      flexShrink: 0,
      background: 'white',
      borderRadius: 16,
      padding: '28px 20px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 40px)',
      position: 'sticky',
      top: 20,
      overflowY: 'auto',
    }}>
      {/* لوگو */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <Link href="/">
          <Image
            src="/images/logo.transparent.png"
            alt="خانه دی"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>
      </div>

      {/* برچسب پنل */}
      <p style={{ textAlign: 'center', fontSize: 11, color: '#B0B0B0', marginBottom: 28, letterSpacing: '0.04em' }}>
        پنل مدیریت
      </p>

      {/* منو */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
        {navGroups.map((group) => (
          <div key={group.label ?? 'main'} style={{ marginBottom: group.label ? 8 : 0 }}>
            {group.label && (
              <p style={{ fontSize: 10, color: '#C0C0C0', padding: '12px 16px 6px', letterSpacing: '0.06em', fontWeight: 600 }}>
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href, item.exact)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 16px',
                    borderRadius: active ? 0 : 12,
                    fontSize: 14,
                    fontWeight: active ? 700 : 400,
                    color: active ? '#801A00' : '#404040',
                    background: active ? '#FDF0F0' : 'transparent',
                    borderRight: active ? '3px solid #801A00' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 150ms',
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#F5F5F5' }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={17} color={active ? '#801A00' : '#A0A0A0'} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}

        {/* جداکننده و لینک‌های پایین */}
        <div style={{ borderTop: '1px solid #F0F0F0', marginTop: 16, paddingTop: 16 }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 16px',
              borderRadius: 12,
              fontSize: 14,
              color: '#404040',
              textDecoration: 'none',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F5F5' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <ArrowRight size={17} style={{ color: '#A0A0A0', flexShrink: 0 }} />
            بازگشت به سایت
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 16px',
              borderRadius: 12,
              fontSize: 14,
              color: '#717171',
              background: 'transparent',
              border: 'none',
              width: '100%',
              textAlign: 'right',
              cursor: 'pointer',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F5F5' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut size={17} style={{ color: '#A0A0A0', flexShrink: 0 }} />
            خروج از حساب
          </button>
        </div>
      </nav>
    </aside>
  )
}
