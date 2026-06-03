'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ImagePlus, X } from '@/components/ui/icons'
import toast from 'react-hot-toast'
import Modal from './Modal'
import ImageUploadZone from './ImageUploadZone'
import JalaliDatePicker from '@/components/ui/JalaliDatePicker'
import { jalaliToDisplay } from '@/lib/jalali'

export interface EventRow {
  id: string
  title: string
  type: string
  date: string
  time: string
  location: string | null
  description: string | null
  imageUrl: string | null
  galleryImages: string
  isFeatured: boolean
  isArchived: boolean
}

interface EventModalProps {
  open: boolean
  event?: EventRow | null
  onClose: () => void
  onSaved: () => void
}

type GallerySlot = { url: string | null; file: File | null; preview: string | null }

const MAX_GALLERY = 8
const inputClass = 'w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:border-[#801A00] transition-colors'
const labelClass = 'block text-sm font-medium text-[#404040] mb-1'
const eventTypes = ['تئاتر', 'نمایشگاه', 'موسیقی', 'ادبی', 'ورکشاپ', 'سایر']

const toFa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])

/* ─── TimePicker ─── */
function TimePickerDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const HOURS   = Array.from({ length: 12 }, (_, i) => i + 1)
  const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

  const parse = (v: string): { h: number; m: number; p: 'AM' | 'PM' } => {
    if (!v) return { h: 12, m: 0, p: 'AM' }
    const [hh, mm] = v.split(':').map(Number)
    return { h: hh % 12 || 12, m: mm, p: hh >= 12 ? 'PM' : 'AM' }
  }

  const { h, m, p } = parse(value)

  const commit = (hour: number, min: number, period: 'AM' | 'PM') => {
    const h24 = period === 'AM' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12)
    onChange(`${String(h24).padStart(2, '0')}:${String(min).padStart(2, '0')}`)
  }

  const display = value
    ? `${toFa(h)}:${toFa(String(m).padStart(2, '0'))} ${p === 'AM' ? 'صبح' : 'بعدازظهر'}`
    : 'انتخاب ساعت'

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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
    textAlign: 'center',
    flexShrink: 0,
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
              <p style={{ fontSize: 10, color: '#A0A0A0', fontWeight: 700, marginBottom: 6, textAlign: 'center', letterSpacing: '0.05em' }}>ساعت</p>
              <div style={colStyle}>
                {HOURS.map((hour) => (
                  <button key={hour} type="button" style={btnStyle(h === hour)} onClick={() => commit(hour, m, p)}>
                    {toFa(hour)}
                  </button>
                ))}
              </div>
            </div>

            {/* دقیقه */}
            <div>
              <p style={{ fontSize: 10, color: '#A0A0A0', fontWeight: 700, marginBottom: 6, textAlign: 'center', letterSpacing: '0.05em' }}>دقیقه</p>
              <div style={colStyle}>
                {MINUTES.map((min) => (
                  <button key={min} type="button" style={btnStyle(m === min)} onClick={() => commit(h, min, p)}>
                    {toFa(String(min).padStart(2, '0'))}
                  </button>
                ))}
              </div>
            </div>

            {/* صبح / بعدازظهر */}
            <div>
              <p style={{ fontSize: 10, color: '#A0A0A0', fontWeight: 700, marginBottom: 6, textAlign: 'center', letterSpacing: '0.05em' }}>دوره</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(['AM', 'PM'] as const).map((period) => (
                  <button key={period} type="button" style={{ ...btnStyle(p === period), padding: '10px 4px' }} onClick={() => commit(h, m, period)}>
                    {period === 'AM' ? 'صبح' : 'بعدازظهر'}
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

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('folder', 'events')
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('خطا در آپلود تصویر')
  return ((await res.json()) as { url: string }).url
}

/* ─── یک slot گالری ─── */
function GallerySlotCard({
  slot,
  onFile,
  onRemove,
}: {
  slot: GallerySlot
  onFile: (file: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const src = slot.preview ?? slot.url

  if (src) {
    return (
      <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', background: '#F0F0F0' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <button
          onClick={onRemove}
          style={{
            position: 'absolute', top: 5, left: 5,
            width: 24, height: 24, borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={12} color="white" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => inputRef.current?.click()}
      style={{
        aspectRatio: '1', borderRadius: 8,
        border: '1.5px dashed #D0D0D0',
        background: 'white', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 4,
        transition: 'border-color 150ms, background 150ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#801A00'; e.currentTarget.style.background = '#FDF5F5' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#D0D0D0'; e.currentTarget.style.background = 'white' }}
    >
      <ImagePlus size={18} color="#B0B0B0" />
      <span style={{ fontSize: 10, color: '#B0B0B0' }}>افزودن</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
            onFile(file)
          } else if (file) {
            toast.error('فایل باید تصویر و حداکثر ۵MB باشد')
          }
          e.target.value = ''
        }}
      />
    </button>
  )
}

export default function EventModal({ open, event, onClose, onSaved }: EventModalProps) {
  const [loading, setLoading]           = useState(false)
  const [imageFile, setImageFile]       = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [gallery, setGallery]           = useState<GallerySlot[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate]     = useState<Date | null>(null)
  const [form, setForm] = useState({
    title: '', type: 'تئاتر', date: '', time: '', location: '', description: '', isFeatured: false,
  })

  useEffect(() => {
    if (!open) return
    setImageFile(null)
    setImagePreview(null)
    setShowDatePicker(false)
    if (event) {
      const isoDate = event.date ? event.date.slice(0, 10) : ''
      setForm({
        title:       event.title,
        type:        event.type,
        date:        isoDate,
        time:        event.time ?? '',
        location:    event.location ?? '',
        description: event.description ?? '',
        isFeatured:  event.isFeatured,
      })
      if (isoDate) {
        const [y, m, d] = isoDate.split('-').map(Number)
        setSelectedDate(new Date(y, m - 1, d))
      } else {
        setSelectedDate(null)
      }
      try {
        const saved: string[] = JSON.parse(event.galleryImages || '[]')
        setGallery(saved.map((url) => ({ url, file: null, preview: null })))
      } catch {
        setGallery([])
      }
    } else {
      setForm({ title: '', type: 'تئاتر', date: '', time: '', location: '', description: '', isFeatured: false })
      setSelectedDate(null)
      setGallery([])
    }
  }, [event, open])

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  function addGallerySlot() {
    if (gallery.length >= MAX_GALLERY) return
    setGallery((g) => [...g, { url: null, file: null, preview: null }])
  }

  function handleGalleryFile(index: number, file: File) {
    const preview = URL.createObjectURL(file)
    setGallery((g) => g.map((slot, i) => i === index ? { url: null, file, preview } : slot))
  }

  function removeGallerySlot(index: number) {
    setGallery((g) => g.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    if (!form.title || !form.date || !form.time) {
      toast.error('عنوان، تاریخ و ساعت الزامی هستند')
      return
    }
    setLoading(true)
    try {
      let imageUrl: string | null = event?.imageUrl ?? null
      if (imageFile) imageUrl = await uploadImage(imageFile)

      const galleryUrls: string[] = []
      for (const slot of gallery) {
        if (slot.file) {
          galleryUrls.push(await uploadImage(slot.file))
        } else if (slot.url) {
          galleryUrls.push(slot.url)
        }
      }

      const url    = event ? `/api/admin/events/${event.id}` : '/api/admin/events'
      const method = event ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageUrl, galleryImages: galleryUrls }),
      })
      if (!res.ok) throw new Error()
      toast.success(event ? 'رویداد با موفقیت ویرایش شد' : 'رویداد با موفقیت ایجاد شد')
      onSaved()
      onClose()
    } catch {
      toast.error('خطا در ذخیره رویداد')
    } finally {
      setLoading(false)
    }
  }

  const filledCount = gallery.filter((s) => s.url || s.file).length
  const canAdd      = gallery.length < MAX_GALLERY

  return (
    <Modal
      open={open}
      title={event ? 'ویرایش رویداد' : 'افزودن رویداد جدید'}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E5E5', background: 'white', fontSize: 14, cursor: 'pointer' }}
          >
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#801A00', color: 'white', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'در حال ذخیره...' : event ? 'ذخیره تغییرات' : 'افزودن رویداد'}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* عنوان */}
        <div>
          <label className={labelClass}>عنوان رویداد *</label>
          <input className={inputClass} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="عنوان رویداد" />
        </div>

        {/* نوع + مکان */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>نوع رویداد *</label>
            <select className={inputClass} value={form.type} onChange={(e) => set('type', e.target.value)}>
              {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>مکان</label>
            <input className={inputClass} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="مثال: سالن اصلی" />
          </div>
        </div>

        {/* تاریخ + ساعت */}
        <div className="grid grid-cols-2 gap-3">
          <div style={{ position: 'relative' }}>
            <label className={labelClass}>تاریخ *</label>
            <button
              type="button"
              onClick={() => setShowDatePicker((v) => !v)}
              className={inputClass}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'white' }}
            >
              <span style={{ color: selectedDate ? '#171717' : '#A0A0A0', fontSize: 14 }}>
                {selectedDate ? jalaliToDisplay(selectedDate) : 'انتخاب تاریخ'}
              </span>
              <ChevronDown size={14} color="#A0A0A0" />
            </button>
            {showDatePicker && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50 }}>
                <JalaliDatePicker
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                    set('date', iso)
                    setShowDatePicker(false)
                  }}
                />
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <label className={labelClass}>ساعت *</label>
            <TimePickerDropdown value={form.time} onChange={(v) => set('time', v)} />
          </div>
        </div>

        {/* توضیحات */}
        <div>
          <label className={labelClass}>توضیحات</label>
          <textarea
            className={inputClass}
            rows={4}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="توضیحات رویداد..."
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* تصویر پوستر */}
        <div>
          <label className={labelClass}>تصویر پوستر</label>
          <ImageUploadZone
            currentUrl={event?.imageUrl}
            preview={imagePreview}
            onFileSelect={(file) => { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }}
            onClear={() => { setImageFile(null); setImagePreview(null) }}
          />
        </div>

        {/* گالری */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <label className={labelClass} style={{ margin: 0 }}>
              گالری رویداد
              <span style={{ fontSize: 11, color: '#A0A0A0', fontWeight: 400, marginRight: 6 }}>
                ({filledCount}/{MAX_GALLERY} تصویر)
              </span>
            </label>
            {canAdd && (
              <button
                onClick={addGallerySlot}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', borderRadius: 6,
                  border: '1px solid #E5E5E5', background: 'white',
                  fontSize: 12, color: '#404040', cursor: 'pointer',
                }}
              >
                <ImagePlus size={13} />
                افزودن تصویر
              </button>
            )}
          </div>

          {gallery.length === 0 ? (
            <button
              onClick={addGallerySlot}
              style={{
                width: '100%', padding: '20px', borderRadius: 8,
                border: '1.5px dashed #D0D0D0', background: 'white',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6, transition: 'all 150ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#801A00'; e.currentTarget.style.background = '#FDF5F5' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#D0D0D0'; e.currentTarget.style.background = 'white' }}
            >
              <ImagePlus size={22} color="#B0B0B0" />
              <span style={{ fontSize: 12, color: '#A0A0A0' }}>تصاویر گالری را اینجا اضافه کنید (حداکثر ۸ تصویر)</span>
            </button>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {gallery.map((slot, i) => (
                <GallerySlotCard
                  key={i}
                  slot={slot}
                  onFile={(file) => handleGalleryFile(i, file)}
                  onRemove={() => removeGallerySlot(i)}
                />
              ))}
              {canAdd && (
                <button
                  onClick={addGallerySlot}
                  style={{
                    aspectRatio: '1', borderRadius: 8,
                    border: '1.5px dashed #D0D0D0', background: 'white',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 4,
                    transition: 'border-color 150ms, background 150ms',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#801A00'; e.currentTarget.style.background = '#FDF5F5' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#D0D0D0'; e.currentTarget.style.background = 'white' }}
                >
                  <ImagePlus size={18} color="#B0B0B0" />
                  <span style={{ fontSize: 10, color: '#B0B0B0' }}>افزودن</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* رویداد ویژه */}
        <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: 14, color: '#404040' }}>
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => set('isFeatured', e.target.checked)}
            className="w-4 h-4 accent-[#801A00]"
          />
          نمایش به عنوان رویداد ویژه در صفحه اصلی
        </label>
      </div>
    </Modal>
  )
}
