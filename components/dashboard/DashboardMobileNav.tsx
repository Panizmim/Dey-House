'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, CalendarDays, CreditCard, Home } from '@/components/ui/icons'

const items = [
  { label: 'خانه',      icon: Home,         href: '/'                   },
  { label: 'رزروها',    icon: CalendarDays, href: '/dashboard/bookings' },
  { label: 'پروفایل',   icon: User,         href: '/dashboard/profile'  },
  { label: 'پرداخت‌ها', icon: CreditCard,   href: '/dashboard/payments' },
]

export function DashboardMobileNav() {
  const pathname = usePathname()
  return (
    <nav style={{
      position: 'fixed', bottom: 0, right: 0, left: 0,
      background: 'white',
      borderTop: '1px solid #EFEFEF',
      display: 'flex',
      zIndex: 50,
    }}>
      {items.map(({ label, icon: Icon, href }) => {
        const active = href === '/' ? pathname === '/' : (pathname === href || pathname.startsWith(href + '/'))
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '10px 0',
              textDecoration: 'none',
              color: active ? '#801A00' : '#A0A0A0',
              fontSize: 11,
              fontWeight: active ? 700 : 400,
              transition: 'color 150ms',
            }}
          >
            <Icon size={20} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
