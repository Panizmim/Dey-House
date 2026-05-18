'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Booking = {
  id: string
  status: string
  paymentStatus: string
  date: string
  startTime: string
  endTime: string
  type: string
  totalPrice: number
  user: { name: string; email: string }
  studio: { name: string }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    PENDING:   { label: 'در انتظار',   bg: '#FEF3C7', color: '#92400E' },
    CONFIRMED: { label: 'تایید شده',  bg: '#D1FAE5', color: '#065F46' },
    CANCELLED: { label: 'لغو شده',    bg: '#FEE2E2', color: '#991B1B' },
  }
  const s = map[status] ?? { label: status, bg: '#F3F4F6', color: '#6B7280' }
  return <span style={{ background: s.bg, color: s.color, borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{s.label}</span>
}

function PayBadge({ status }: { status: string }) {
  return status === 'PAID'
    ? <span style={{ background: '#D1FAE5', color: '#065F46', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>پرداخت شده</span>
    : <span style={{ background: '#F3F4F6', color: '#6B7280', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>پرداخت نشده</span>
}

const toFa = (s: string) => s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading]   = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')

  async function fetchBookings() {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (dateFrom) params.set('dateFrom', dateFrom)
    if (dateTo)   params.set('dateTo', dateTo)
    const res  = await fetch(`/api/admin/bookings?${params}`)
    const data = await res.json()
    setBookings(data)
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchBookings() }, [statusFilter, dateFrom, dateTo])

  async function updateStatus(id: string, status: string) {
    const label = status === 'CONFIRMED' ? 'تایید' : 'لغو'
    if (status === 'CANCELLED' && !window.confirm('آیا مطمئن هستید که می‌خواهید این رزرو را لغو کنید؟')) return
    const res = await fetch(`/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) { toast.success(`رزرو ${label} شد`); fetchBookings() }
    else toast.error('خطا در عملیات')
  }

  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717', marginBottom: 20 }}>رزروها</h1>

      {/* فیلترها */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E5E5', fontSize: 14, background: 'white' }}
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="PENDING">در انتظار</option>
          <option value="CONFIRMED">تایید شده</option>
          <option value="CANCELLED">لغو شده</option>
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E5E5', fontSize: 14 }} />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E5E5', fontSize: 14 }} />
      </div>

      {/* جدول */}
      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEFEF' }}>
                {['کاربر', 'پلاتو', 'تاریخ', 'ساعت', 'نوع', 'مبلغ', 'پرداخت', 'وضعیت', 'عملیات'].map((h) => (
                  <th key={h} style={{ padding: '12px 14px', fontSize: 12, color: '#717171', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #EFEFEF' }}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} style={{ padding: '12px 14px' }}>
                        <div className="animate-pulse rounded" style={{ height: 14, background: '#F3F4F6', width: '80%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '32px', textAlign: 'center', fontSize: 14, color: '#717171' }}>هیچ رزروی یافت نشد</td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #EFEFEF' }}>
                    <td style={{ padding: '12px 14px', fontSize: 13 }}>
                      <div>{b.user.name}</div>
                      <div style={{ fontSize: 11, color: '#717171' }}>{b.user.email}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>{b.studio.name}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>{new Date(b.date).toLocaleDateString('fa-IR')}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>{toFa(b.startTime)}–{toFa(b.endTime)}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>{b.type}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>{b.totalPrice.toLocaleString('fa-IR')}</td>
                    <td style={{ padding: '12px 14px' }}><PayBadge status={b.paymentStatus} /></td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div className="flex gap-1">
                        {b.status === 'PENDING' && (
                          <button onClick={() => updateStatus(b.id, 'CONFIRMED')}
                            style={{ padding: '3px 8px', borderRadius: 4, border: 'none', background: '#D1FAE5', color: '#065F46', fontSize: 12, cursor: 'pointer' }}>
                            تایید
                          </button>
                        )}
                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                          <button onClick={() => updateStatus(b.id, 'CANCELLED')}
                            style={{ padding: '3px 8px', borderRadius: 4, border: 'none', background: '#FEE2E2', color: '#991B1B', fontSize: 12, cursor: 'pointer' }}>
                            لغو
                          </button>
                        )}
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
