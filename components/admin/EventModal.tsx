'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ImagePlus, X } from '@/components/ui/icons'
import toast from 'react-hot-toast'
import Modal from './Modal'
import ImageUploadZone, { type UploadStatus } from './ImageUploadZone'
import JalaliDatePicker from '@/components/ui/JalaliDatePicker'
import { jalaliToDisplay } from '@/lib/jalali'

export interface EventRow {
  id: string
  title: string
  type: string
  date: string
  endDate: string | null
  time: string
  location: string | null
  description: string | null
  imageUrl: string | null
  galleryImages: string
  eventDates: string
  isFeatured: boolean
  isActive: boolean
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

/* ─── TimePicker 24h ─── */
function TimePickerDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const HOURS   = Array.from({ length: 24 }, (_, i) => i)
  const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

  const parse = (v: string): { h: number; m: number } => {
    if (!v) return { h: 9, m: 0 }
    const [hh, mm] = v.split(':').map(Number)
    return { h: hh, m: mm }
  }

  const { h, m } = parse(value)

  const commit = (hour: number, min: number) => {
    onChange(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`)
  }

  const display = value
    ? `${toFa(String(h).padStart(2, '0'))}:${toFa(String(m).padStart(2, '0'))}`
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
          width: 160, padding: '12px 10px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>

            {/* ساعت */}
            <div>
              <p style={{ fontSize: 10, color: '#A0A0A0', fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>ساعت</p>
              <div style={colStyle}>
                {HOURS.map((hour) => (
                  <button key={hour} type="button" style={btnStyle(h === hour)} onClick={() => commit(hour, m)}>
                    {toFa(String(hour).padStart(2, '0'))}
                  </button>
                ))}
              </div>
            </div>

            {/* دقیقه */}
            <div>
              <p style={{ fontSize: 10, color: '#A0A0A0', fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>دقیقه</p>
              <div style={colStyle}>
                {MINUTES.map((min) => (
                  <button key={min} type="button" style={btnStyle(m === min)} onClick={() => commit(h, min)}>
                    {toFa(String(min).padStart(2, '0'))}
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
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl,     setImageUrl]     = useState<string | null>(null)
  const [imageStatus,  setImageStatus]  = useState<UploadStatus>('idle')
  const [gallery, setGallery]           = useState<GallerySlot[]>([])
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker,   setShowEndPicker]   = useState(false)
  const [startStyle,      setStartStyle]      = useState<React.CSSProperties>({})
  const [endStyle,        setEndStyle]        = useState<React.CSSProperties>({})
  const startBtnRef                           = useRef<HTMLButtonElement>(null)
  const endBtnRef                             = useRef<HTMLButtonElement>(null)
  const [startDate, setStartDate]             = useState<Date | null>(null)
  const [endDate,   setEndDate]               = useState<Date | null>(null)
  const [form, setForm] = useState({
    title: '', type: 'تئاتر', date: '', endDate: '', time: '', location: '', description: '', isFeatured: false, isActive: true, isArchived: false,
  })

  function openStartPicker() {
    if (startBtnRef.current) {
      const r = startBtnRef.current.getBoundingClientRect()
      setStartStyle({ position: 'fixed', top: r.bottom + 4, right: window.innerWidth - r.right, zIndex: 9999 })
    }
    setShowStartPicker((v) => !v)
    setShowEndPicker(false)
  }

  function openEndPicker() {
    if (endBtnRef.current) {
      const r = endBtnRef.current.getBoundingClientRect()
      setEndStyle({ position: 'fixed', top: r.bottom + 4, right: window.innerWidth - r.right, zIndex: 9999 })
    }
    setShowEndPicker((v) => !v)
    setShowStartPicker(false)
  }

  useEffect(() => {
    if (!open) return
    setImagePreview(null)
    setImageUrl(null)
    setImageStatus('idle')
    setShowStartPicker(false)
    setShowEndPicker(false)
    if (event) {
      const isoStart = event.date    ? event.date.slice(0, 10)    : ''
      const isoEnd   = event.endDate ? event.endDate.slice(0, 10) : ''
      setForm({
        title:       event.title,
        type:        event.type,
        date:        isoStart,
        endDate:     isoEnd,
        time:        event.time ?? '',
        location:    event.location ?? '',
        description: event.description ?? '',
        isFeatured:  event.isFeatured,
        isActive:    event.isActive,
        isArchived:  event.isArchived,
      })
      setStartDate(isoStart ? (() => { const [y,m,d] = isoStart.split('-').map(Number); return new Date(y,m-1,d) })() : null)
      setEndDate  (isoEnd   ? (() => { const [y,m,d] = isoEnd.split('-').map(Number);   return new Date(y,m-1,d) })() : null)
      try {
        const saved: string[] = JSON.parse(event.galleryImages || '[]')
        setGallery(saved.map((url) => ({ url, file: null, preview: null })))
      } catch {
        setGallery([])
      }
    } else {
      setForm({ title: '', type: 'تئاتر', date: '', endDate: '', time: '', location: '', description: '', isFeatured: false, isActive: true, isArchived: false })
      setStartDate(null)
      setEndDate(null)
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
      toast.error('عنوان، تاریخ شروع و ساعت الزامی هستند')
      return
    }
    if (imageStatus === 'uploading') { toast.error('لطفاً صبر کنید تا آپلود تصویر تمام شود'); return }
    setLoading(true)
    try {
      const finalImageUrl: string | null = imageUrl ?? event?.imageUrl ?? null

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
        body: JSON.stringify({ ...form, imageUrl: finalImageUrl, galleryImages: galleryUrls, isArchived: form.isArchived, endDate: form.endDate || null }),
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
    <>
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

        {/* تاریخ شروع + تاریخ پایان */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>تاریخ شروع *</label>
            <button
              ref={startBtnRef}
              type="button"
              onClick={openStartPicker}
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
            <label className={labelClass}>تاریخ پایان</label>
            <button
              ref={endBtnRef}
              type="button"
              onClick={openEndPicker}
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

        {/* ساعت */}
        <div>
          <label className={labelClass}>ساعت *</label>
          <TimePickerDropdown value={form.time} onChange={(v) => set('time', v)} />
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
            status={imageStatus}
            onFileSelect={(file) => {
              setImagePreview(URL.createObjectURL(file))
              setImageUrl(null)
              setImageStatus('uploading')
              uploadImage(file)
                .then((url) => { setImageUrl(url); setImageStatus('success') })
                .catch(() => setImageStatus('error'))
            }}
            onClear={() => { setImagePreview(null); setImageUrl(null); setImageStatus('idle') }}
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

        {/* وضعیت فعال / غیرفعال */}
        <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#404040', marginBottom: 10 }}>وضعیت رویداد</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => set('isActive', true)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: '2px solid',
                borderColor: form.isActive ? '#059669' : '#E5E5E5',
                background: form.isActive ? '#ECFDF5' : 'white',
                color: form.isActive ? '#065F46' : '#A0A0A0',
                fontSize: 14, fontWeight: form.isActive ? 700 : 400,
                cursor: 'pointer', transition: 'all 150ms',
                fontFamily: 'YekanBakh, Tahoma, sans-serif',
              }}
            >
              ● فعال
            </button>
            <button
              type="button"
              onClick={() => set('isActive', false)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: '2px solid',
                borderColor: !form.isActive ? '#6B7280' : '#E5E5E5',
                background: !form.isActive ? '#F3F4F6' : 'white',
                color: !form.isActive ? '#374151' : '#A0A0A0',
                fontSize: 14, fontWeight: !form.isActive ? 700 : 400,
                cursor: 'pointer', transition: 'all 150ms',
                fontFamily: 'YekanBakh, Tahoma, sans-serif',
              }}
            >
              ○ غیرفعال
            </button>
          </div>
        </div>
      </div>
    </Modal>

    {(showStartPicker || showEndPicker) && typeof window !== 'undefined' && createPortal(
      <>
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => { setShowStartPicker(false); setShowEndPicker(false) }}
        />
        {showStartPicker && (
          <div style={startStyle}>
            <JalaliDatePicker
              selected={startDate}
              disablePast={false}
              onSelect={(date) => {
                setStartDate(date)
                const iso = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
                set('date', iso)
                setShowStartPicker(false)
              }}
            />
          </div>
        )}
        {showEndPicker && (
          <div style={endStyle}>
            <JalaliDatePicker
              selected={endDate}
              disablePast={false}
              onSelect={(date) => {
                setEndDate(date)
                const iso = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
                set('endDate', iso)
                setShowEndPicker(false)
              }}
            />
          </div>
        )}
      </>,
      document.body
    )}
    </>
  )
}
