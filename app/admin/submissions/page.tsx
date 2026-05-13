'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, Download } from 'lucide-react'
import toast from 'react-hot-toast'

type Submission = {
  id: string; name: string; email: string; phone: string; artField: string
  status: string; resumeUrl: string | null; artworkUrls: string; createdAt: string
}

const STATUS_FILTERS = [
  { value: 'all', label: 'همه' },
  { value: 'PENDING',   label: 'جدید' },
  { value: 'REVIEWING', label: 'در حال بررسی' },
  { value: 'ACCEPTED',  label: 'پذیرفته' },
  { value: 'REJECTED',  label: 'رد شده' },
]

function statusInfo(s: string) {
  return s === 'PENDING'   ? { label: 'جدید',           bg: '#FEF3C7', color: '#92400E' }
    : s === 'REVIEWING'    ? { label: 'در حال بررسی',   bg: '#DBEAFE', color: '#1E40AF' }
    : s === 'ACCEPTED'     ? { label: 'پذیرفته',        bg: '#D1FAE5', color: '#065F46' }
    :                        { label: 'رد شده',          bg: '#FEE2E2', color: '#991B1B' }
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState('all')

  async function fetchSubmissions() {
    setLoading(true)
    const params = filter !== 'all' ? `?status=${filter}` : ''
    const res  = await fetch(`/api/admin/submissions${params}`)
    const data = await res.json()
    setSubmissions(data)
    setLoading(false)
  }

  useEffect(() => { fetchSubmissions() }, [filter])

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/submissions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      toast.success('وضعیت بروز شد')
      fetchSubmissions()
    } else {
      toast.error('خطا')
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717', marginBottom: 20 }}>همکاری هنرمندان</h1>

      {/* فیلتر */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
              background: filter === f.value ? '#8B1E1E' : 'white',
              color:      filter === f.value ? 'white' : '#404040',
              border:     filter === f.value ? 'none' : '1px solid #EFEFEF',
              fontWeight: filter === f.value ? 600 : 400,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg" style={{ border: '1px solid #EFEFEF', padding: 20, height: 160 }} />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <p style={{ fontSize: 14, color: '#717171', textAlign: 'center', padding: '48px 0' }}>هیچ درخواستی یافت نشد</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissions.map((s) => {
            const si = statusInfo(s.status)
            let artworkCount = 0
            try { artworkCount = JSON.parse(s.artworkUrls).length } catch {}
            return (
              <div key={s.id} style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 8, padding: 20 }}>
                {/* سطر ۱ */}
                <div className="flex items-center justify-between mb-2">
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#171717' }}>{s.name}</p>
                  <span style={{ background: si.bg, color: si.color, borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{si.label}</span>
                </div>
                {/* سطر ۲ */}
                <div className="flex items-center justify-between mb-3">
                  <p style={{ fontSize: 13, color: '#717171' }}>{s.artField}</p>
                  <p style={{ fontSize: 12, color: '#B0B0B0' }}>{new Date(s.createdAt).toLocaleDateString('fa-IR')}</p>
                </div>
                {/* سطر ۳ */}
                <div className="flex flex-wrap gap-4 mb-3" style={{ fontSize: 12, color: '#717171' }}>
                  <span className="flex items-center gap-1"><Mail size={12} />{s.email}</span>
                  <span className="flex items-center gap-1"><Phone size={12} />{s.phone}</span>
                </div>
                {/* فایل‌ها */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {s.resumeUrl && (
                    <a href={s.resumeUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1"
                      style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E5E5E5', fontSize: 12, color: '#404040', textDecoration: 'none' }}>
                      <Download size={12} />
                      دانلود رزومه
                    </a>
                  )}
                  {artworkCount > 0 && (
                    <span style={{ fontSize: 12, color: '#717171', padding: '4px 10px', background: '#FAFAFA', borderRadius: 6, border: '1px solid #EFEFEF' }}>
                      {artworkCount} نمونه کار ارسال شده
                    </span>
                  )}
                </div>
                {/* دکمه‌های عملیات */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => updateStatus(s.id, 'ACCEPTED')}
                    style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: '#D1FAE5', color: '#065F46', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    پذیرفته شد
                  </button>
                  <button onClick={() => updateStatus(s.id, 'REJECTED')}
                    style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: '#FEE2E2', color: '#991B1B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    رد شد
                  </button>
                  <button onClick={() => updateStatus(s.id, 'REVIEWING')}
                    style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: '#FEF3C7', color: '#92400E', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    در حال بررسی
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
