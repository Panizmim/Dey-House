'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { User, CalendarDays, CreditCard, LogOut, MessageCircle } from 'lucide-react'


const menuItems = [
  { label: 'اطلاعات شخصی', icon: User,        href: '/dashboard/profile'  },
  { label: 'رزروهای قبلی', icon: CalendarDays, href: '/dashboard/bookings' },
  { label: 'پرداخت‌ها',    icon: CreditCard,   href: '/dashboard/payments' },
]

export function DashboardSidebar() {
  const pathname = usePathname()

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
    }}>
      {/* لوگو */}
      <div style={{ marginBottom: 32 }}>
        <Link href="/" title="بازگشت به سایت">
          <Image
            src="/images/logo.png"
            alt="خانه دی"
            width={96}
            height={40}
            className="object-contain"
            style={{ filter: 'invert(20%) sepia(80%) saturate(500%) hue-rotate(320deg)' }}
          />
        </Link>
      </div>

      {/* منو */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {menuItems.map(({ label, icon: Icon, href }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: active ? 0 : 12,
                fontSize: 14,
                fontWeight: active ? 700 : 400,
                color: active ? '#8B1E1E' : '#404040',
                background: active ? '#FDF0F0' : 'transparent',
                borderRight: active ? '3px solid #8B1E1E' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#F5F5F5' }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={18} style={{ color: active ? '#8B1E1E' : '#A0A0A0', flexShrink: 0 }} />
              {label}
            </Link>
          )
        })}

        {/* خروج */}
        <div style={{ borderTop: '1px solid #F0F0F0', marginTop: 16, paddingTop: 16 }}>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
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
            <LogOut size={18} style={{ color: '#A0A0A0', flexShrink: 0 }} />
            خروج از حساب
          </button>
        </div>
      </nav>

      {/* کارت پشتیبانی */}
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <div style={{
          background: '#F9F9F9',
          border: '1px solid #EFEFEF',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center',
        }}>
          <MessageCircle size={28} style={{ color: '#A0A0A0', margin: '0 auto 8px' }} />
          <p style={{ fontSize: 14, fontWeight: 700, color: '#171717', marginBottom: 4 }}>
            نیاز به پشتیبانی دارید؟
          </p>
          <p style={{ fontSize: 12, color: '#A0A0A0', marginBottom: 12 }}>
            با تیم ما در تماس باشید
          </p>
          <Link
            href="/contact"
            style={{
              display: 'block',
              width: '100%',
              border: '1px solid #E0E0E0',
              borderRadius: 8,
              padding: '8px 0',
              fontSize: 14,
              fontWeight: 500,
              color: '#404040',
              textDecoration: 'none',
              transition: 'all 150ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#8B1E1E'
              e.currentTarget.style.color = '#8B1E1E'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E0E0E0'
              e.currentTarget.style.color = '#404040'
            }}
          >
            تماس با ما
          </Link>
        </div>
      </div>
    </aside>
  )
}
