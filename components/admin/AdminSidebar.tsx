'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Calendar, UtensilsCrossed, BookOpen, Phone, Users, Palette, ArrowRight, LogOut, Grid2x2, Monitor, GraduationCap } from '@/components/ui/icons'

const navGroups = [
  {
    label: null,
    items: [{ href: '/admin', label: 'خلاصه', icon: LayoutDashboard, exact: true }],
  },
  {
    label: 'محتوا',
    items: [
      { href: '/admin/hero',     label: 'هیرو سکشن', icon: Monitor,         exact: false },
      { href: '/admin/events',    label: 'رویدادها',   icon: Calendar,       exact: false },
      { href: '/admin/workshops', label: 'ورکشاپ‌ها', icon: GraduationCap,  exact: false },
      { href: '/admin/gallery',  label: 'گالری',      icon: Grid2x2,        exact: false },
      { href: '/admin/cafe',     label: 'منوی کافه', icon: UtensilsCrossed, exact: false },
    ],
  },
  {
    label: 'رزروها',
    items: [
      { href: '/admin/bookings',          label: 'رزروها',              icon: BookOpen,  exact: false },
      { href: '/admin/contact-requests',  label: 'درخواست‌های تماس',  icon: Phone,     exact: false },
    ],
  },
  {
    label: 'کاربران',
    items: [
      { href: '/admin/users',       label: 'کاربران',          icon: Users,    exact: false },
      { href: '/admin/submissions', label: 'همکاری هنرمندان', icon: Palette,  exact: false },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside
      className="flex flex-col bg-white h-screen overflow-y-auto"
      style={{ width: 240, borderLeft: '1px solid #EFEFEF', position: 'sticky', top: 0, flexShrink: 0 }}
    >
      {/* لوگو */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #EFEFEF' }}>
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="خانه دی"
            width={32}
            height={32}
            className="object-contain"
            style={{ mixBlendMode: 'multiply' }}
          />
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#171717', lineHeight: 1.2 }}>خانه دی</p>
            <p style={{ fontSize: 11, color: '#717171' }}>پنل مدیریت</p>
          </div>
        </div>
      </div>

      {/* لینک‌های منو */}
      <nav className="flex-1 py-2">
        {navGroups.map((group) => (
          <div key={group.label ?? 'main'}>
            {group.label && (
              <p style={{ fontSize: 10, color: '#B0B0B0', textTransform: 'uppercase', padding: '16px 20px 8px', letterSpacing: '0.08em' }}>
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
                  className="flex items-center gap-[10px] transition-colors duration-150"
                  style={{
                    padding: '10px 20px',
                    borderRadius: 8,
                    margin: '2px 12px',
                    fontSize: 14,
                    fontWeight: active ? 700 : 400,
                    color: active ? '#801A00' : '#404040',
                    background: active ? '#FDF5F5' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#F5F5F5' }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={16} color={active ? '#801A00' : '#717171'} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* پایین */}
      <div style={{ borderTop: '1px solid #EFEFEF', padding: '8px 0' }}>
        <Link
          href="/"
          className="flex items-center gap-[10px] transition-colors duration-150"
          style={{ padding: '10px 20px', margin: '2px 12px', borderRadius: 8, fontSize: 14, color: '#404040' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F5F5' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <ArrowRight size={16} color="#717171" />
          بازگشت به سایت
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-[10px] w-full text-right transition-colors duration-150"
          style={{ padding: '10px 20px', margin: '2px 12px', borderRadius: 8, fontSize: 14, color: '#DC2626', background: 'transparent', border: 'none', cursor: 'pointer', width: 'calc(100% - 24px)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut size={16} />
          خروج
        </button>
      </div>
    </aside>
  )
}
