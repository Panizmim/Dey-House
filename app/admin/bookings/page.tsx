'use client'

import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, X, ChevronDown, Calendar } from '@/components/ui/icons'
import JalaliDatePicker from '@/components/ui/JalaliDatePicker'
import { jalaliToDisplay } from '@/lib/jalali'

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

type Studio = { id: string; name: string }

const USAGE_TYPES = [
  { value: 'theater', label: 'تمرین تئاتر' },
  { value: 'other',   label: 'سایر' },
]

const toFa = (s: string) => s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])
const toFaNum = (n: number | string) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])

/* ── dateToISO: تبدیل Date به رشته YYYY-MM-DD ── */
function dateToISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* ── TimePickerDropdown — دقیقاً مثل EventModal ── */
function TimePickerDropdown({ value, onChange, label }: { value: string; onChange: (v: string) => void; label?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const HOURS   = Array.from({ length: 12 }, (_, i) => i + 1)
  const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

  const parse = (v: string): { h: number; m: number; p: 'AM' | 'PM' } => {
    if (!v) return { h: 8, m: 0, p: 'AM' }
    const [hh, mm] = v.split(':').map(Number)
    return { h: hh % 12 || 12, m: mm, p: hh >= 12 ? 'PM' : 'AM' }
  }

  const { h, m, p } = parse(value)

  const commit = (hour: number, min: number, period: 'AM' | 'PM') => {
    const h24 = period === 'AM' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12)
    onChange(`${String(h24).padStart(2, '0')}:${String(min).padStart(2, '0')}`)
  }

  const display = value
    ? `${toFaNum(h)}:${toFaNum(String(m).padStart(2, '0'))} ${p === 'AM' ? 'صبح' : 'بعدازظهر'}`
    : label ?? 'انتخاب ساعت'

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const inputClass = 'w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:border-[#801A00] transition-colors'

  const colStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: 2,
    maxHeight: 200, overflowY: 'auto',
  }
  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 4px', borderRadius: 6, border: 'none', cursor: 'pointer',
    background: active ? '#801A00' : 'transparent',
    color: active ? 'white' : '#171717',
    fontSize: 13, fontWeight: active ? 700 : 400,
    fontFamily: 'YekanBakh, Tahoma, sans-serif',
    textAlign: 'center', flexShrink: 0,
  })

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={inputClass}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'white' }}
      >
        <span style={{ color: value ? '#171717' : '#A0A0A0', fontSize: 14 }}>{display}</span>
        <ChevronDown size={14} color="#A0A0A0" style={{ transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 60,
          background: 'white', border: '1px solid #E5E5E5', borderRadius: 12,
          boxShadow: '0 8px 28px rgba(0,0,0,0.13)',
          width: 224, padding: '12px 10px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {/* ساعت */}
            <div>
              <p style={{ fontSize: 10, color: '#A0A0A0', fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>ساعت</p>
              <div style={colStyle}>
                {HOURS.map((hour) => (
                  <button key={hour} type="button" style={btnStyle(h === hour)} onClick={() => commit(hour, m, p)}>
                    {toFaNum(hour)}
                  </button>
                ))}
              </div>
            </div>
            {/* دقیقه */}
            <div>
              <p style={{ fontSize: 10, color: '#A0A0A0', fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>دقیقه</p>
              <div style={colStyle}>
                {MINUTES.map((min) => (
                  <button key={min} type="button" style={btnStyle(m === min)} onClick={() => commit(h, min, p)}>
                    {toFaNum(String(min).padStart(2, '0'))}
                  </button>
                ))}
              </div>
            </div>
            {/* صبح/بعدازظهر */}
            <div>
              <p style={{ fontSize: 10, color: '#A0A0A0', fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>دوره</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(['AM', 'PM'] as const).map((period) => (
                  <button key={period} type="button" style={btnStyle(p === period)} onClick={() => commit(h, m, period)}>
                    {period === 'AM' ? 'صبح' : 'عصر'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── JalaliDateButton — دکمه‌ای با تقویم dropdown ── */
function JalaliDateButton({
  value,
  onChange,
  placeholder,
  disablePast,
}: {
  value: Date | null
  onChange: (d: Date | null) => void
  placeholder: string
  disablePast?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputClass = 'w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:border-[#801A00] transition-colors'

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={inputClass}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'white' }}
      >
        <span style={{ color: value ? '#171717' : '#A0A0A0', fontSize: 14 }}>
          {value ? jalaliToDisplay(value) : placeholder}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {value && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange(null) }}
              style={{ cursor: 'pointer', color: '#A0A0A0', fontSize: 12, lineHeight: 1 }}
            >✕</span>
          )}
          <ChevronDown size={14} color="#A0A0A0" style={{ transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
        </div>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50 }}>
          <JalaliDatePicker
            selected={value}
            disablePast={disablePast ?? false}
            onSelect={(d) => { onChange(d); setOpen(false) }}
          />
        </div>
      )}
    </div>
  )
}

/* ── Badges ── */
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

/* ── Modal رزرو ادمین ── */
function AdminBookingModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [studios,   setStudios]   = useState<Studio[]>([])
  const [studioId,  setStudioId]  = useState('')
  const [selDate,   setSelDate]   = useState<Date | null>(null)
  const [showCal,   setShowCal]   = useState(false)
  const calRef = useRef<HTMLDivElement>(null)
  const [startTime, setStartTime] = useState('')
  const [endTime,   setEndTime]   = useState('')
  const [type,      setType]      = useState('theater')
  const [notes,     setNotes]     = useState('')
  const [saving,    setSaving]    = useState(false)

  useEffect(() => {
    fetch('/api/studios')
      .then((r) => r.json())
      .then((data: Studio[]) => { setStudios(data); if (data.length) setStudioId(data[0].id) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setShowCal(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleSave() {
    if (!studioId || !selDate || !startTime || !endTime) {
      toast.error('لطفاً همه فیلدهای اجباری را پر کنید')
      return
    }
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    if (eh * 60 + em <= sh * 60 + sm) {
      toast.error('ساعت پایان باید بعد از ساعت شروع باشد')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/bookings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ studioId, date: dateToISO(selDate), startTime, endTime, type, notes }),
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

  const dur = (() => {
    if (!startTime || !endTime) return null
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const d = (eh * 60 + em - sh * 60 - sm) / 60
    return d > 0 ? d : null
  })()

  const inputClass = 'w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:border-[#801A00] transition-colors'
  const labelClass = 'block text-sm font-medium text-[#404040] mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" style={{ maxHeight: '90vh', overflowY: 'auto' }}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#171717' }}>رزرو پلاتو توسط ادمین</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#717171' }}>
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">

          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#1D4ED8' }}>
            این رزرو بدون پرداخت ثبت می‌شود و وضعیت آن «تایید شده» خواهد بود.
          </div>

          {/* پلاتو */}
          <div>
            <label className={labelClass}>پلاتو *</label>
            <select value={studioId} onChange={(e) => setStudioId(e.target.value)} className={inputClass}>
              {studios.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* تاریخ — JalaliDatePicker */}
          <div>
            <label className={labelClass}>تاریخ *</label>
            <div ref={calRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowCal((v) => !v)}
                className={inputClass}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'white' }}
              >
                <span style={{ color: selDate ? '#171717' : '#A0A0A0', fontSize: 14 }}>
                  {selDate ? jalaliToDisplay(selDate) : 'انتخاب تاریخ'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} color="#A0A0A0" />
                  <ChevronDown size={14} color="#A0A0A0" style={{ transform: showCal ? 'rotate(180deg)' : 'rotate(0)', transition: '200ms' }} />
                </div>
              </button>
              {showCal && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50 }}>
                  <JalaliDatePicker
                    selected={selDate}
                    disablePast={true}
                    onSelect={(d) => { setSelDate(d); setShowCal(false) }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ساعت شروع و پایان */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>ساعت شروع *</label>
              <TimePickerDropdown value={startTime} onChange={setStartTime} label="ساعت شروع" />
            </div>
            <div>
              <label className={labelClass}>ساعت پایان *</label>
              <TimePickerDropdown value={endTime} onChange={setEndTime} label="ساعت پایان" />
            </div>
          </div>

          {/* نوع کاربری */}
          <div>
            <label className={labelClass}>نوع کاربری</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
              {USAGE_TYPES.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>

          {/* یادداشت */}
          <div>
            <label className={labelClass}>یادداشت</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="توضیح اختیاری..."
              className={inputClass}
              style={{ resize: 'vertical' }}
              rows={2}
            />
          </div>

          {/* خلاصه */}
          {selDate && startTime && endTime && dur && dur > 0 && (
            <div style={{ background: '#F9F9F9', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#404040' }}>
              <span style={{ fontWeight: 700 }}>خلاصه: </span>
              {jalaliToDisplay(selDate)} — {toFa(startTime)} تا {toFa(endTime)}
              {' — '}
              {toFaNum(dur % 1 === 0 ? dur : dur.toFixed(1))} ساعت
              <span style={{ color: '#1D4ED8', fontWeight: 700, marginRight: 8 }}>رایگان (ادمین)</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#F0F0F0] flex justify-end gap-3">
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #E5E5E5', background: 'white', fontSize: 13, cursor: 'pointer' }}>
            انصراف
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !studioId || !selDate || !startTime || !endTime}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: '#801A00', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              opacity: (saving || !studioId || !selDate || !startTime || !endTime) ? 0.5 : 1,
            }}
          >
            {saving ? 'در حال ثبت...' : 'ثبت رزرو'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ── */
export default function AdminBookingsPage() {
  const [bookings,     setBookings]     = useState<Booking[]>([])
  const [loading,      setLoading]      = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom,     setDateFrom]     = useState<Date | null>(null)
  const [dateTo,       setDateTo]       = useState<Date | null>(null)
  const [modalOpen,    setModalOpen]    = useState(false)

  async function fetchBookings() {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (dateFrom) params.set('dateFrom', dateToISO(dateFrom))
    if (dateTo)   params.set('dateTo',   dateToISO(dateTo))
    const res  = await fetch(`/api/admin/bookings?${params}`)
    const data = await res.json()
    setBookings(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchBookings() }, [statusFilter, dateFrom, dateTo])

  async function updateStatus(id: string, status: string) {
    if (status === 'CANCELLED' && !window.confirm('آیا مطمئن هستید که می‌خواهید این رزرو را لغو کنید؟')) return
    const label = status === 'CONFIRMED' ? 'تایید' : 'لغو'
    const res = await fetch(`/api/admin/bookings/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
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
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#801A00', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={16} />
          رزرو توسط ادمین
        </button>
      </div>

      {/* فیلترها */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <p style={{ fontSize: 12, color: '#717171', marginBottom: 4 }}>وضعیت</p>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E5E5', fontSize: 14, background: 'white', minWidth: 140 }}
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="PENDING">در انتظار</option>
            <option value="CONFIRMED">تایید شده</option>
            <option value="CANCELLED">لغو شده</option>
          </select>
        </div>

        <div style={{ minWidth: 160 }}>
          <p style={{ fontSize: 12, color: '#717171', marginBottom: 4 }}>از تاریخ</p>
          <JalaliDateButton value={dateFrom} onChange={setDateFrom} placeholder="از تاریخ" />
        </div>

        <div style={{ minWidth: 160 }}>
          <p style={{ fontSize: 12, color: '#717171', marginBottom: 4 }}>تا تاریخ</p>
          <JalaliDateButton value={dateTo} onChange={setDateTo} placeholder="تا تاریخ" />
        </div>
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
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {new Date(b.date).toLocaleDateString('fa-IR')}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {toFa(b.startTime)}–{toFa(b.endTime)}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {USAGE_TYPES.find((u) => u.value === b.type)?.label ?? b.type}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {b.totalPrice === 0 ? '—' : b.totalPrice.toLocaleString('fa-IR')}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <PayBadge status={b.paymentStatus} totalPrice={b.totalPrice} />
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={b.status} />
                    </td>
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
