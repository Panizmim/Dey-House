'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, X, ChevronDown, ImagePlus } from '@/components/ui/icons'
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
  images:      string
  venueImages: string
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

/* ─── Multi-image picker row ─── */
function MultiImagePicker({
  label,
  existingUrls,
  newFiles,
  onRemoveUrl,
  onAddFiles,
  onRemoveFile,
}: {
  label: string
  existingUrls: string[]
  newFiles: { file: File; preview: string }[]
  onRemoveUrl: (i: number) => void
  onAddFiles: (files: FileList) => void
  onRemoveFile: (i: number) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex flex-wrap gap-2 mt-1">
        {existingUrls.map((url, i) => (
          <div key={`url-${i}`} style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
            <Image src={url} alt="" fill className="object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => onRemoveUrl(i)}
              style={{
                position: 'absolute', top: 2, right: 2,
                width: 18, height: 18, borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={10} color="white" />
            </button>
          </div>
        ))}
        {newFiles.map(({ preview }, i) => (
          <div key={`new-${i}`} style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
            <button
              type="button"
              onClick={() => onRemoveFile(i)}
              style={{
                position: 'absolute', top: 2, right: 2,
                width: 18, height: 18, borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={10} color="white" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            width: 72, height: 72, flexShrink: 0,
            border: '1px dashed #E5E5E5', borderRadius: 8,
            cursor: 'pointer', background: 'white',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8B1E1E'; e.currentTarget.style.background = '#FAFAFA' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.background = 'white' }}
        >
          <ImagePlus size={18} color="#B0B0B0" />
          <span style={{ fontSize: 10, color: '#B0B0B0' }}>افزودن</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files?.length) { onAddFiles(e.target.files); e.target.value = '' } }}
        />
      </div>
    </div>
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
  const [coverFile,       setCoverFile]       = useState<File | null>(null)
  const [coverPreview,    setCoverPreview]    = useState<string | null>(null)
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker,   setShowEndPicker]   = useState(false)
  const [startStyle,      setStartStyle]      = useState<React.CSSProperties>({})
  const [endStyle,        setEndStyle]        = useState<React.CSSProperties>({})
  const [saving,          setSaving]          = useState(false)

  /* multi-image state */
  const [artworkUrls,  setArtworkUrls]  = useState<string[]>([])
  const [artworkFiles, setArtworkFiles] = useState<{ file: File; preview: string }[]>([])
  const [venueUrls,    setVenueUrls]    = useState<string[]>([])
  const [venueFiles,   setVenueFiles]   = useState<{ file: File; preview: string }[]>([])

  const startBtnRef = useRef<HTMLButtonElement>(null)
  const endBtnRef   = useRef<HTMLButtonElement>(null)

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
      setArtworkUrls(gallery ? JSON.parse(gallery.images || '[]') : [])
      setArtworkFiles([])
      setVenueUrls(gallery ? JSON.parse(gallery.venueImages || '[]') : [])
      setVenueFiles([])
    }
  }, [open, gallery])

  function openStart() {
    if (startBtnRef.current) {
      const r = startBtnRef.current.getBoundingClientRect()
      setStartStyle({ position: 'fixed', top: r.bottom + 4, right: window.innerWidth - r.right, zIndex: 9999 })
    }
    setShowStartPicker((v) => !v)
    setShowEndPicker(false)
  }

  function openEnd() {
    if (endBtnRef.current) {
      const r = endBtnRef.current.getBoundingClientRect()
      setEndStyle({ position: 'fixed', top: r.bottom + 4, right: window.innerWidth - r.right, zIndex: 9999 })
    }
    setShowEndPicker((v) => !v)
    setShowStartPicker(false)
  }

  function addArtworkFiles(files: FileList) {
    const items = Array.from(files).map((f) => ({ file: f, preview: URL.createObjectURL(f) }))
    setArtworkFiles((p) => [...p, ...items])
  }
  function removeArtworkUrl(i: number) { setArtworkUrls((p) => p.filter((_, j) => j !== i)) }
  function removeArtworkFile(i: number) {
    setArtworkFiles((p) => { URL.revokeObjectURL(p[i].preview); return p.filter((_, j) => j !== i) })
  }

  function addVenueFiles(files: FileList) {
    const items = Array.from(files).map((f) => ({ file: f, preview: URL.createObjectURL(f) }))
    setVenueFiles((p) => [...p, ...items])
  }
  function removeVenueUrl(i: number) { setVenueUrls((p) => p.filter((_, j) => j !== i)) }
  function removeVenueFile(i: number) {
    setVenueFiles((p) => { URL.revokeObjectURL(p[i].preview); return p.filter((_, j) => j !== i) })
  }

  async function uploadFile(file: File, folder: string): Promise<string> {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)
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
      const coverImage = coverFile
        ? await uploadFile(coverFile, 'galleries')
        : (gallery?.coverImage ?? null)

      const newArtworkUrls = await Promise.all(artworkFiles.map(({ file }) => uploadFile(file, 'galleries/artworks')))
      const newVenueUrls   = await Promise.all(venueFiles.map(({ file }) => uploadFile(file, 'galleries/venue')))

      const body = {
        title, artistName, description,
        startDate:   startDate.toISOString(),
        endDate:     endDate.toISOString(),
        status,      coverImage,
        images:      JSON.stringify([...artworkUrls, ...newArtworkUrls]),
        venueImages: JSON.stringify([...venueUrls,   ...newVenueUrls]),
      }

      const res = gallery
        ? await fetch(`/api/admin/galleries/${gallery.id}`, { method: 'PUT',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/admin/galleries',               { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error || 'خطا در ذخیره‌سازی')
      }
      toast.success(gallery ? 'نمایشگاه ویرایش شد' : 'نمایشگاه اضافه شد')
      onSaved()
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'خطا در ذخیره‌سازی')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <>
      {/* overlay closes pickers */}
      {(showStartPicker || showEndPicker) && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => { setShowStartPicker(false); setShowEndPicker(false) }}
        />
      )}

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

            {/* date pickers — fixed positioning to escape overflow clipping */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>تاریخ شروع *</label>
                <button
                  ref={startBtnRef}
                  type="button"
                  onClick={openStart}
                  className={inputClass}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'white' }}
                >
                  <span style={{ color: startDate ? '#171717' : '#A0A0A0', fontSize: 14 }}>
                    {startDate ? jalaliToDisplay(startDate) : 'انتخاب تاریخ'}
                  </span>
                  <ChevronDown size={14} color="#A0A0A0" style={{ transition: 'transform 200ms', transform: showStartPicker ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
              </div>

              <div>
                <label className={labelClass}>تاریخ پایان *</label>
                <button
                  ref={endBtnRef}
                  type="button"
                  onClick={openEnd}
                  className={inputClass}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'white' }}
                >
                  <span style={{ color: endDate ? '#171717' : '#A0A0A0', fontSize: 14 }}>
                    {endDate ? jalaliToDisplay(endDate) : 'انتخاب تاریخ'}
                  </span>
                  <ChevronDown size={14} color="#A0A0A0" style={{ transition: 'transform 200ms', transform: showEndPicker ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>وضعیت</label>
              <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
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

            <MultiImagePicker
              label="گزیده آثار"
              existingUrls={artworkUrls}
              newFiles={artworkFiles}
              onRemoveUrl={removeArtworkUrl}
              onAddFiles={addArtworkFiles}
              onRemoveFile={removeArtworkFile}
            />

            <MultiImagePicker
              label="فضای نمایش"
              existingUrls={venueUrls}
              newFiles={venueFiles}
              onRemoveUrl={removeVenueUrl}
              onAddFiles={addVenueFiles}
              onRemoveFile={removeVenueFile}
            />
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

      {/* pickers rendered outside modal scroll container */}
      {showStartPicker && (
        <div style={startStyle}>
          <JalaliDatePicker
            selected={startDate}
            onSelect={(date) => { setStartDate(date); setShowStartPicker(false) }}
            disablePast={false}
          />
        </div>
      )}
      {showEndPicker && (
        <div style={endStyle}>
          <JalaliDatePicker
            selected={endDate}
            onSelect={(date) => { setEndDate(date); setShowEndPicker(false) }}
            disablePast={false}
          />
        </div>
      )}
    </>
  )
}

/* ─── Page ─── */
export default function AdminGalleryPage() {
  const [galleries,   setGalleries]   = useState<Gallery[]>([])
  const [loading,     setLoading]     = useState(true)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editGallery, setEditGallery] = useState<Gallery | null>(null)

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
