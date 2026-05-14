'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Search, User, CalendarDays, CreditCard, LogOut } from 'lucide-react'

const profileLinks = [
  { icon: User,        label: 'اطلاعات شخصی', href: '/dashboard/profile'  },
  { icon: CalendarDays,label: 'رزروهای قبلی', href: '/dashboard/bookings' },
  { icon: CreditCard,  label: 'پرداخت‌ها',    href: '/dashboard/payments' },
]

export function DashboardTopBar() {
  const { data: session }  = useSession()
  const [profileOpen, setProfileOpen] = useState(false)

  const initials = session?.user?.name?.[0] ?? 'U'

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    }}>

      {/* جستجو — راست */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#F5F5F5',
        borderRadius: 12,
        padding: '10px 16px',
        flex: 1,
        maxWidth: 400,
      }}>
        <Search size={18} style={{ color: '#A0A0A0', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="جستجو..."
          dir="rtl"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 14,
            color: '#171717',
            width: '100%',
          }}
        />
      </div>

      {/* آواتار + نام — چپ */}
      <div style={{ position: 'relative' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => setProfileOpen((v) => !v)}
        >
          {session?.user?.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={session.user.image}
              alt="آواتار"
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#8B1E1E', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, flexShrink: 0,
            }}>
              {initials}
            </div>
          )}
          <span style={{ fontSize: 14, fontWeight: 700, color: '#171717', whiteSpace: 'nowrap' }}>
            {session?.user?.name}
          </span>
        </div>

        {profileOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 40 }}
              onClick={() => setProfileOpen(false)}
            />
            <div style={{
              position: 'absolute', left: 0, top: 52,
              width: 220,
              background: 'white',
              borderRadius: 16,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              border: '1px solid #EFEFEF',
              zIndex: 50,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #F5F5F5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#8B1E1E', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, flexShrink: 0,
                  }}>
                    {initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#171717', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session?.user?.name}
                    </p>
                    <p style={{ fontSize: 11, color: '#A0A0A0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ padding: 8 }}>
                {profileLinks.map(({ icon: Icon, label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10,
                      fontSize: 13, color: '#404040',
                      textDecoration: 'none',
                      transition: 'background 150ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F5F5' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Icon size={15} style={{ color: '#A0A0A0' }} />
                    {label}
                  </Link>
                ))}
              </div>
              <div style={{ padding: 8, borderTop: '1px solid #F5F5F5' }}>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10,
                    fontSize: 13, color: '#C92A2A',
                    background: 'transparent', border: 'none',
                    width: '100%', textAlign: 'right',
                    cursor: 'pointer',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF0F0' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <LogOut size={15} style={{ color: '#C92A2A' }} />
                  خروج از حساب
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
