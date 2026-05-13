'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { href: '/dashboard',          label: 'خلاصه',       icon: '◎' },
  { href: '/dashboard/bookings', label: 'رزروهای من',   icon: '📋' },
  { href: '/dashboard/profile',  label: 'پروفایل',      icon: '👤' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-neutral-50 flex">

      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-l border-neutral-200 sticky top-0 h-screen">
        <div className="p-6 border-b border-neutral-100">
          <Link href="/" className="text-lg font-bold text-brand">خانه دی</Link>
          <p className="text-xs text-neutral-400 mt-1">داشبورد کاربری</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm transition-colors',
                  isActive
                    ? 'bg-brand-light text-brand font-medium'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                )}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-sm">
              {session?.user?.name?.[0] ?? 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 truncate max-w-[120px]">{session?.user?.name}</p>
              <p className="text-xs text-neutral-400 truncate max-w-[120px]">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-right text-sm text-neutral-500 hover:text-red-500 px-3 py-2 rounded-btn hover:bg-neutral-50 transition-colors"
          >
            خروج از حساب
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar — mobile */}
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <Link href="/" className="font-bold text-brand">خانه دی</Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm text-neutral-500 hover:text-red-500"
          >
            خروج
          </button>
        </div>

        <div className="p-6 md:p-10">{children}</div>

        {/* Bottom nav — mobile */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 flex">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors',
                  isActive ? 'text-brand font-medium' : 'text-neutral-400'
                )}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>
      </main>
    </div>
  )
}
