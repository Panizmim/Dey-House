'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, X, ChevronDown } from '@/components/ui/icons'
import toast from 'react-hot-toast'
import JalaliDatePicker from '@/components/ui/JalaliDatePicker'
import { jalaliToDisplay } from '@/lib/jalali'
import ImageUploadZone from '@/components/admin/ImageUploadZone'

type Gallery = {
  id:          string
  title:       string
  artistName:  string
  slug:        string
  description: string | null
  startDate:   string
  endDate:     string
  status:      string
  coverImage:  string | null
  isActive:    boolean
}

const statusLabel: Record<string, string> = {
  UPCOMING: 'به زودی',
  ACTIVE:   'در حال برگزاری',
  PAST:     'برگزار شده',
}

const inputClass = 'w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E1E] transition-colors'
const labelClass = 'block text-sm font-medium text-[#404040] mb-1'

function Badge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    UPCOMING: { bg: '#FEF3C7', color: '#92400E' },
    ACTIVE:   { bg: '#D1FAE5', color: '#065F46' },
    PAST:     { bg: '#F3F4F6', color: '#6B7280' },
  }
  const s = map[status] ?? { bg: '#F3F4F6', color: '#6B7280' }
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>
      {statusLabel[status] ?? status}
    </span>
  )
}

/* ─── Modal ─── */
function GalleryModal({
  open, gallery, onClose, onSaved,
}: {
  open: boolean
  gallery: Gallery | null
  onClose: () => void
  onSaved: () => void
}) {
  const [title,       setTitle]       = useState('')
  const [artistName,  setArtistName]  = useState('')
  const [description, setDescription] = useState('')
  const [startDate,   setStartDate]   = useState<Date | null>(null)
  const [endDate,     setEndDate]     = useState<Date | null>(null)
  const [status,      setStatus]      = useState('UPCOMING')
  const [coverFile,        setCoverFile]        = useState<File | null>(null)
  const [coverPreview,     setCoverPreview]     = useState<string | null>(null)
  const [showStartPicker,  setShowStartPicker]  = useState(false)
  const [showEndPicker,    setShowEndPicker]    = useState(false)
  const [saving,           setSaving]           = useState(false)

  useEffect(() => {
    if (open) {
      setTitle(gallery?.title ?? '')
      setArtistName(gallery?.artistName ?? '')
      setDescription(gallery?.description ?? '')
      setStartDate(gallery ? new Date(gallery.startDate) : null)
      setEndDate(gallery ? new Date(gallery.endDate) : null)
      setStatus(gallery?.status ?? 'UPCOMING')
      setCoverFile(null)
      setCoverPreview(null)
      setShowStartPicker(false)
      setShowEndPicker(false)
    }
  }, [open, gallery])

  async function uploadCover(): Promise<string | null> {
    if (!coverFile) return gallery?.coverImage ?? null
    const fd = new FormData()
    fd.append('file', coverFile)
    fd.append('folder', 'galleries')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (!res.ok) throw new Error('خطا در آپلود تصویر')
    const { url } = await res.json()
    return url as string
  }

  async function handleSave() {
    if (!title || !artistName || !startDate || !endDate) {
      toast.error('عنوان، نام هنرمند و تاریخ‌ها اجباری هستند')
      return
    }
    setSaving(true)
    try {
      const coverImage = await uploadCover()
      const body = {
        title, artistName, description,
        startDate: startDate.toISOString(),
        endDate:   endDate.toISOString(),
        status, coverImage,
      }

      const res = gallery
        ? await fetch(`/api/admin/galleries/${gallery.id}`, { method: 'PUT',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/admin/galleries',               { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

      if (!res.ok) throw new Error()
      toast.success(gallery ? 'نمایشگاه ویرایش شد' : 'نمایشگاه اضافه شد')
      onSaved()
      onClose()
    } catch {
      toast.error('خطا در ذخیره‌سازی')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#171717' }}>
            {gallery ? 'ویرایش نمایشگاه' : 'افزودن نمایشگاه جدید'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#717171' }}>
            <X size={20} />
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className={labelClass}>عنوان نمایشگاه *</label>
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="نام نمایشگاه" />
          </div>

          <div>
            <label className={labelClass}>نام هنرمند *</label>
            <input className={inputClass} value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="نام هنرمند" />
          </div>

          <div>
            <label className={labelClass}>توضیحات (گزاره)</label>
            <textarea
              className={inputClass}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="درباره این نمایشگاه بنویسید..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* تاریخ شروع */}
            <div style={{ position: 'relative' }}>
              <label className={labelClass}>تاریخ شروع *</label>
              <button
                type="button"
                onClick={() => { setShowStartPicker((v) => !v); setShowEndPicker(false) }}
                className={inputClass}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'white' }}
              >
                <span style={{ color: startDate ? '#171717' : '#A0A0A0', fontSize: 14 }}>
                  {startDate ? jalaliToDisplay(startDate) : 'انتخاب تاریخ'}
                </span>
                <ChevronDown size={14} color="#A0A0A0" style={{ transition: 'transform 200ms', transform: showStartPicker ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>
              {showStartPicker && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 60 }}>
                  <JalaliDatePicker
                    selected={startDate}
                    onSelect={(date) => { setStartDate(date); setShowStartPicker(false) }}
                    disablePast={false}
                  />
                </div>
              )}
            </div>

            {/* تاریخ پایان */}
            <div style={{ position: 'relative' }}>
              <label className={labelClass}>تاریخ پایان *</label>
              <button
                type="button"
                onClick={() => { setShowEndPicker((v) => !v); setShowStartPicker(false) }}
                className={inputClass}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'white' }}
              >
                <span style={{ color: endDate ? '#171717' : '#A0A0A0', fontSize: 14 }}>
                  {endDate ? jalaliToDisplay(endDate) : 'انتخاب تاریخ'}
                </span>
                <ChevronDown size={14} color="#A0A0A0" style={{ transition: 'transform 200ms', transform: showEndPicker ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>
              {showEndPicker && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 60 }}>
                  <JalaliDatePicker
                    selected={endDate}
                    onSelect={(date) => { setEndDate(date); setShowEndPicker(false) }}
                    disablePast={false}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>وضعیت</label>
            <select
              className={inputClass}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="UPCOMING">به زودی</option>
              <option value="ACTIVE">در حال برگزاری</option>
              <option value="PAST">برگزار شده</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>تصویر کاور</label>
            <ImageUploadZone
              currentUrl={gallery?.coverImage}
              preview={coverPreview}
              onFileSelect={(f) => {
                setCoverFile(f)
                const reader = new FileReader()
                reader.onload = (e) => setCoverPreview(e.target?.result as string)
                reader.readAsDataURL(f)
              }}
              onClear={() => { setCoverFile(null); setCoverPreview(null) }}
            />
          </div>
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t border-[#F0F0F0] flex justify-end gap-3">
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #E5E5E5', background: 'white', fontSize: 13, cursor: 'pointer' }}
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#8B1E1E', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ─── */
export default function AdminGalleryPage() {
  const [galleries,  setGalleries]  = useState<Gallery[]>([])
  const [loading,    setLoading]    = useState(true)
  const [modalOpen,  setModalOpen]  = useState(false)
  const [editGallery,setEditGallery]= useState<Gallery | null>(null)

  async function fetchGalleries() {
    setLoading(true)
    const res  = await fetch('/api/admin/galleries')
    const data = await res.json()
    setGalleries(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchGalleries() }, [])

  async function handleDelete(id: string) {
    if (!window.confirm('آیا از حذف این نمایشگاه مطمئن هستید؟')) return
    const res = await fetch(`/api/admin/galleries/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('نمایشگاه حذف شد'); fetchGalleries() }
    else toast.error('خطا در حذف')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717' }}>گالری</h1>
        <button
          onClick={() => { setEditGallery(null); setModalOpen(true) }}
          className="flex items-center gap-2"
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#8B1E1E', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={16} />
          افزودن نمایشگاه جدید
        </button>
      </div>

      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEFEF' }}>
                {['نمایشگاه', 'هنرمند', 'تاریخ شروع', 'تاریخ پایان', 'وضعیت', 'عملیات'].map((h) => (
                  <th key={h} style={{ padding: '12px 14px', fontSize: 12, color: '#717171', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #EFEFEF' }}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} style={{ padding: '12px 14px' }}>
                        <div className="animate-pulse rounded" style={{ height: 14, background: '#F3F4F6', width: '80%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : galleries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 32, textAlign: 'center', fontSize: 14, color: '#717171' }}>
                    هیچ نمایشگاهی ثبت نشده
                  </td>
                </tr>
              ) : (
                galleries.map((g) => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #EFEFEF' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div className="flex items-center gap-3">
                        {g.coverImage && (
                          <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                            <Image src={g.coverImage} alt={g.title} fill className="object-cover" />
                          </div>
                        )}
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{g.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>{g.artistName}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {new Date(g.startDate).toLocaleDateString('fa-IR')}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {new Date(g.endDate).toLocaleDateString('fa-IR')}
                    </td>
                    <td style={{ padding: '12px 14px' }}><Badge status={g.status} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditGallery(g); setModalOpen(true) }}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: '1px solid #E5E5E5', background: 'white', fontSize: 13, cursor: 'pointer' }}
                        >
                          <Pencil size={13} /> ویرایش
                        </button>
                        <button
                          onClick={() => handleDelete(g.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#DC2626', fontSize: 13, cursor: 'pointer' }}
                        >
                          <Trash2 size={13} /> حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GalleryModal
        open={modalOpen}
        gallery={editGallery}
        onClose={() => setModalOpen(false)}
        onSaved={fetchGalleries}
      />
    </div>
  )
}
