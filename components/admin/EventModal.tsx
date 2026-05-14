'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from './Modal'
import ImageUploadZone from './ImageUploadZone'

export interface EventRow {
  id: string
  title: string
  type: string
  date: string
  time: string
  location: string | null
  description: string | null
  imageUrl: string | null
  isFeatured: boolean
  isArchived: boolean
}

interface EventModalProps {
  open: boolean
  event?: EventRow | null
  onClose: () => void
  onSaved: () => void
}

const inputClass = 'w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:border-[#8B1E1E] transition-colors'
const labelClass = 'block text-sm font-medium text-[#404040] mb-1'

const eventTypes = ['تئاتر', 'نمایشگاه', 'موسیقی', 'ادبی', 'ورکشاپ', 'سایر']

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('folder', 'events')
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('خطا در آپلود تصویر')
  const data = await res.json()
  return data.url as string
}

export default function EventModal({ open, event, onClose, onSaved }: EventModalProps) {
  const [loading, setLoading]         = useState(false)
  const [imageFile, setImageFile]     = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '', type: 'تئاتر', date: '', time: '', location: '', description: '', isFeatured: false,
  })

  useEffect(() => {
    if (!open) return
    setImageFile(null)
    setImagePreview(null)
    if (event) {
      setForm({
        title:       event.title,
        type:        event.type,
        date:        event.date ? event.date.slice(0, 10) : '',
        time:        event.time ?? '',
        location:    event.location ?? '',
        description: event.description ?? '',
        isFeatured:  event.isFeatured,
      })
    } else {
      setForm({ title: '', type: 'تئاتر', date: '', time: '', location: '', description: '', isFeatured: false })
    }
  }, [event, open])

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  function handleFileSelect(file: File) {
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
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

      const url    = event ? `/api/admin/events/${event.id}` : '/api/admin/events'
      const method = event ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageUrl }),
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
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#8B1E1E', color: 'white', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
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
          <div>
            <label className={labelClass}>تاریخ *</label>
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              placeholder="مثال: ۱۵ خرداد ۱۴۰۴"
            />
          </div>
          <div>
            <label className={labelClass}>ساعت *</label>
            <input
              type="time"
              className={inputClass}
              value={form.time}
              onChange={(e) => set('time', e.target.value)}
              placeholder="مثال: ۱۹:۳۰"
            />
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
            onFileSelect={handleFileSelect}
            onClear={() => { setImageFile(null); setImagePreview(null) }}
          />
        </div>

        {/* رویداد ویژه */}
        <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: 14, color: '#404040' }}>
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => set('isFeatured', e.target.checked)}
            className="w-4 h-4 accent-[#8B1E1E]"
          />
          نمایش به عنوان رویداد ویژه در صفحه اصلی
        </label>
      </div>
    </Modal>
  )
}
