'use client'

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { User } from '@/components/ui/icons'

const pageTitles: Record<string, string> = {
  '/admin':                  'خلاصه',
  '/admin/events':           'رویدادها',
  '/admin/cafe':             'منوی کافه',
  '/admin/bookings':         'رزروها',
  '/admin/contact-requests': 'درخواست‌های تماس',
  '/admin/users':            'کاربران',
  '/admin/submissions':      'همکاری هنرمندان',
}

export default function AdminHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const title = pageTitles[pathname] ?? 'پنل مدیریت'

  return (
    <header
      className="flex items-center justify-between bg-white"
      style={{ height: 60, padding: '0 24px', borderBottom: '1px solid #EFEFEF' }}
    >
      <p style={{ fontSize: 16, fontWeight: 700, color: '#171717' }}>{title}</p>
      <div className="flex items-center gap-2" style={{ fontSize: 14, color: '#717171' }}>
        <User size={16} />
        <span>{session?.user?.name ?? 'ادمین'}</span>
      </div>
    </header>
  )
}
