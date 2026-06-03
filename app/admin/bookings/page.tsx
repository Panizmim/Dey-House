'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, X } from '@/components/ui/icons'

type Booking = {
  id: string
  status: string
  paymentStatus: string
  date: string
  startTime: string
  endTime: string
  type: string
  totalPrice: number
  notes: string | null
  user: { name: string; email: string }
  studio: { name: string }
}

type Studio = { id: string; name: string; pricePerHour: number }

const ALL_SLOTS = [
  '09:00','10:00','11:00','12:00',
  '14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00',
]

const USAGE_TYPES = [
  { value: 'theater',       label: 'تمرین تئاتر' },
  { value: 'workshop',      label: 'ورکشاپ' },
  { value: 'photography',   label: 'عکاسی / فیلمبرداری' },
  { value: 'yoga',          label: 'یوگا' },
  { value: 'other',         label: 'سایر' },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    PENDING:   { label: 'در انتظار',  bg: '#FEF3C7', color: '#92400E' },
    CONFIRMED: { label: 'تایید شده', bg: '#D1FAE5', color: '#065F46' },
    CANCELLED: { label: 'لغو شده',   bg: '#FEE2E2', color: '#991B1B' },
  }
  const s = map[status] ?? { label: status, bg: '#F3F4F6', color: '#6B7280' }
  return <span style={{ background: s.bg, color: s.color, borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{s.label}</span>
}

function PayBadge({ status, totalPrice }: { status: string; totalPrice: number }) {
  if (status === 'PAID' && totalPrice === 0)
    return <span style={{ background: '#EFF6FF', color: '#1D4ED8', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>ادمین</span>
  if (status === 'PAID')
    return <span style={{ background: '#D1FAE5', color: '#065F46', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>پرداخت شده</span>
  return <span style={{ background: '#F3F4F6', color: '#6B7280', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>پرداخت نشده</span>
}

const toFa = (s: string) => s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])

/* ─── Modal رزرو ادمین ─── */
function AdminBookingModal({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved: () => void
}) {
  const [studios,    setStudios]    = useState<Studio[]>([])
  const [studioId,   setStudioId]   = useState('')
  const [date,       setDate]       = useState('')
  const [startTime,  setStartTime]  = useState('')
  const [endTime,    setEndTime]    = useState('')
  const [type,       setType]       = useState('theater')
  const [notes,      setNotes]      = useState('')
  const [saving,     setSaving]     = useState(false)
  const [slots,      setSlots]      = useState<{ time: string; available: boolean }[]>([])
  const [loadSlots,  setLoadSlots]  = useState(false)

  useEffect(() => {
    fetch('/api/studios')
      .then((r) => r.json())
      .then((data: Studio[]) => { setStudios(data); if (data.length) setStudioId(data[0].id) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!studioId || !date) { setSlots([]); return }
    setLoadSlots(true)
    fetch(`/api/bookings/slots?studioId=${studioId}&date=${date}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadSlots(false))
  }, [studioId, date])

  // وقتی startTime تغییر کند endTime را به slot بعدی ست کن
  function handleStartTime(t: string) {
    setStartTime(t)
    const idx = ALL_SLOTS.indexOf(t)
    if (idx >= 0 && idx < ALL_SLOTS.length - 1) setEndTime(ALL_SLOTS[idx + 1])
    else setEndTime('')
  }

  const availableStarts = slots.filter((s) => s.available).map((s) => s.time)
  const validEnds = startTime
    ? ALL_SLOTS.filter((t) => {
        const [sh, sm] = startTime.split(':').map(Number)
        const [th, tm] = t.split(':').map(Number)
        return th * 60 + tm > sh * 60 + sm
      })
    : []

  async function handleSave() {
    if (!studioId || !date || !startTime || !endTime) {
      toast.error('لطفاً همه فیلدهای اجباری را پر کنید')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ studioId, date, startTime, endTime, type, notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error((data as { error?: string }).error || 'خطا')
      toast.success('رزرو با موفقیت ثبت شد')
      onSaved()
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'خطا در ثبت رزرو')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1px solid #E5E5E5', fontSize: 13, outline: 'none',
    background: 'white',
  }
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#404040', marginBottom: 4, display: 'block' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>

        {/* هدر */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#171717' }}>رزرو پلاتو توسط ادمین</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#717171' }}>
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">

          {/* راهنما */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1D4ED8' }}>
            این رزرو بدون پرداخت ثبت می‌شود و وضعیت آن «تایید شده» خواهد بود.
          </div>

          {/* پلاتو */}
          <div>
            <label style={labelStyle}>پلاتو *</label>
            <select value={studioId} onChange={(e) => setStudioId(e.target.value)} style={inputStyle}>
              {studios.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* تاریخ */}
          <div>
            <label style={labelStyle}>تاریخ *</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => { setDate(e.target.value); setStartTime(''); setEndTime('') }}
              style={inputStyle}
            />
          </div>

          {/* ساعت */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>ساعت شروع *</label>
              {loadSlots ? (
                <div style={{ ...inputStyle, color: '#A0A0A0' }}>در حال بارگذاری...</div>
              ) : (
                <select
                  value={startTime}
                  onChange={(e) => handleStartTime(e.target.value)}
                  style={inputStyle}
                  disabled={!date}
                >
                  <option value="">انتخاب کنید</option>
                  {slots.length > 0
                    ? slots.map((s) => (
                        <option key={s.time} value={s.time} disabled={!s.available}>
                          {toFa(s.time)}{!s.available ? ' (رزرو شده)' : ''}
                        </option>
                      ))
                    : ALL_SLOTS.map((t) => <option key={t} value={t}>{toFa(t)}</option>)
                  }
                </select>
              )}
            </div>

            <div>
              <label style={labelStyle}>ساعت پایان *</label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={inputStyle}
                disabled={!startTime}
              >
                <option value="">انتخاب کنید</option>
                {validEnds.map((t) => <option key={t} value={t}>{toFa(t)}</option>)}
              </select>
            </div>
          </div>

          {/* نوع کاربری */}
          <div>
            <label style={labelStyle}>نوع کاربری</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
              {USAGE_TYPES.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>

          {/* یادداشت */}
          <div>
            <label style={labelStyle}>یادداشت</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="توضیح اختیاری..."
              style={{ ...inputStyle, resize: 'vertical' }}
              rows={2}
            />
          </div>

          {/* خلاصه */}
          {startTime && endTime && (
            <div style={{ background: '#F9F9F9', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#404040' }}>
              <span style={{ fontWeight: 700 }}>خلاصه: </span>
              {toFa(startTime)} تا {toFa(endTime)}
              {' — '}
              {(() => {
                const [sh, sm] = startTime.split(':').map(Number)
                const [eh, em] = endTime.split(':').map(Number)
                const dur = (eh * 60 + em - sh * 60 - sm) / 60
                return toFa(String(dur % 1 === 0 ? dur : dur.toFixed(1))) + ' ساعت'
              })()}
              <span style={{ color: '#1D4ED8', fontWeight: 700, marginRight: 8 }}>رایگان (ادمین)</span>
            </div>
          )}
        </div>

        {/* فوتر */}
        <div className="px-6 py-4 border-t border-[#F0F0F0] flex justify-end gap-3">
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #E5E5E5', background: 'white', fontSize: 13, cursor: 'pointer' }}
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !studioId || !date || !startTime || !endTime}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: '#801A00', color: 'white', fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
              opacity: (saving || !studioId || !date || !startTime || !endTime) ? 0.5 : 1,
            }}
          >
            {saving ? 'در حال ثبت...' : 'ثبت رزرو'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ─── */
export default function AdminBookingsPage() {
  const [bookings,      setBookings]      = useState<Booking[]>([])
  const [loading,       setLoading]       = useState(true)
  const [statusFilter,  setStatusFilter]  = useState('all')
  const [dateFrom,      setDateFrom]      = useState('')
  const [dateTo,        setDateTo]        = useState('')
  const [modalOpen,     setModalOpen]     = useState(false)

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
    if (status === 'CANCELLED' && !window.confirm('آیا مطمئن هستید که می‌خواهید این رزرو را لغو کنید؟')) return
    const label = status === 'CONFIRMED' ? 'تایید' : 'لغو'
    const res = await fetch(`/api/admin/bookings/${id}/status`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    })
    if (res.ok) { toast.success(`رزرو ${label} شد`); fetchBookings() }
    else toast.error('خطا در عملیات')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717' }}>رزروها</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2"
          style={{
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: '#801A00', color: 'white', fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          رزرو توسط ادمین
        </button>
      </div>

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
                {['کاربر', 'پلاتو', 'تاریخ', 'ساعت', 'نوع', 'مبلغ', 'نوع رزرو', 'وضعیت', 'عملیات'].map((h) => (
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
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {USAGE_TYPES.find((u) => u.value === b.type)?.label ?? b.type}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {b.totalPrice === 0 ? '—' : b.totalPrice.toLocaleString('fa-IR')}
                    </td>
                    <td style={{ padding: '12px 14px' }}><PayBadge status={b.paymentStatus} totalPrice={b.totalPrice} /></td>
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

      {modalOpen && (
        <AdminBookingModal
          onClose={() => setModalOpen(false)}
          onSaved={fetchBookings}
        />
      )}
    </div>
  )
}
