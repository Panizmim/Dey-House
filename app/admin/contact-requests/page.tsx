'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type ContactRequest = {
  id: string; name: string; email: string; phone: string
  usageType: string; message: string | null; isRead: boolean; createdAt: string
}

export default function AdminContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading]   = useState(true)

  async function fetchRequests() {
    setLoading(true)
    const res  = await fetch('/api/admin/contact-requests')
    const data = await res.json()
    setRequests(data)
    setLoading(false)
  }

  useEffect(() => { fetchRequests() }, [])

  async function markRead(id: string) {
    const res = await fetch(`/api/admin/contact-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead: true }),
    })
    if (res.ok) { toast.success('علامت‌گذاری شد'); fetchRequests() }
    else toast.error('خطا')
  }

  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717', marginBottom: 20 }}>درخواست‌های تماس</h1>
      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEFEF' }}>
                {['نام', 'تلفن', 'ایمیل', 'نوع کاربری', 'پیام', 'تاریخ', 'وضعیت', 'عملیات'].map((h) => (
                  <th key={h} style={{ padding: '12px 14px', fontSize: 12, color: '#717171', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #EFEFEF' }}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} style={{ padding: '12px 14px' }}>
                        <div className="animate-pulse rounded" style={{ height: 14, background: '#F3F4F6', width: '75%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : requests.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', fontSize: 14, color: '#717171' }}>هیچ درخواستی وجود ندارد</td></tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #EFEFEF', background: r.isRead ? 'transparent' : '#FFFBF0' }}>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: r.isRead ? 400 : 600 }}>{r.name}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, direction: 'ltr' }}>{r.phone}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13 }}>{r.email}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>{r.usageType}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.message ?? '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>{new Date(r.createdAt).toLocaleDateString('fa-IR')}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {r.isRead
                        ? <span style={{ background: '#D1FAE5', color: '#065F46', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>تماس گرفته شد</span>
                        : <span style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>جدید</span>
                      }
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {!r.isRead && (
                        <button
                          onClick={() => markRead(r.id)}
                          style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E5E5E5', background: 'white', fontSize: 12, cursor: 'pointer' }}
                        >
                          علامت‌گذاری
                        </button>
                      )}
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
