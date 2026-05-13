'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'

type User = { id: string; name: string; email: string; phone: string | null; role: string; createdAt: string; bookings: { id: string }[] }

export default function AdminUsersPage() {
  const [users, setUsers]   = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (debounced) params.set('search', debounced)
    const res  = await fetch(`/api/admin/users?${params}`)
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }, [debounced])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function makeAdmin(id: string) {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این کاربر را ادمین کنید؟')) return
    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'ADMIN' }),
    })
    if (res.ok) { toast.success('نقش کاربر تغییر کرد'); fetchUsers() }
    else toast.error('خطا')
  }

  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717', marginBottom: 20 }}>کاربران</h1>

      {/* جستجو */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جستجو بر اساس نام یا ایمیل..."
        style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E5E5E5', fontSize: 14, width: 280, marginBottom: 20 }}
      />

      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEFEF' }}>
                {['نام', 'ایمیل', 'تلفن', 'نقش', 'تاریخ عضویت', 'تعداد رزرو', 'عملیات'].map((h) => (
                  <th key={h} style={{ padding: '12px 14px', fontSize: 12, color: '#717171', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #EFEFEF' }}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} style={{ padding: '12px 14px' }}>
                        <div className="animate-pulse rounded" style={{ height: 14, background: '#F3F4F6', width: '75%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', fontSize: 14, color: '#717171' }}>کاربری یافت نشد</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #EFEFEF' }}>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13 }}>{u.email}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, direction: 'ltr' }}>{u.phone ?? '—'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600,
                        background: u.role === 'ADMIN' ? '#FDF5F5' : '#F3F4F6',
                        color:      u.role === 'ADMIN' ? '#8B1E1E' : '#6B7280',
                      }}>
                        {u.role === 'ADMIN' ? 'ادمین' : 'کاربر'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>{new Date(u.createdAt).toLocaleDateString('fa-IR')}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13 }}>{u.bookings.length}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div className="flex gap-2">
                        {u.role === 'USER' && (
                          <button
                            onClick={() => makeAdmin(u.id)}
                            style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E5E5E5', background: 'white', fontSize: 12, cursor: 'pointer' }}
                          >
                            تبدیل به ادمین
                          </button>
                        )}
                        <a
                          href={`/admin/bookings?userId=${u.id}`}
                          style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E5E5E5', background: 'white', fontSize: 12, cursor: 'pointer', textDecoration: 'none', color: '#171717' }}
                        >
                          رزروها
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
