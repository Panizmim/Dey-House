'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { Area } from 'react-easy-crop'
import Modal from './Modal'
import ImageUploadZone, { type UploadStatus } from './ImageUploadZone'
import ImageCropper, { getCroppedFile } from './ImageCropModal'
import { convertIfHeic } from '@/lib/convertHeic'

export interface Studio {
  id: string
  name: string
  description: string | null
  capacity: number
  pricePerHour: number
  images: string[]
  isActive: boolean
}

interface StudioModalProps {
  open: boolean
  studio: Studio
  onClose: () => void
  onSave: () => void
}

interface GallerySlot {
  key: string
  url: string | null
  preview: string | null
  status: UploadStatus
}

const inputClass = 'w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:border-[#801A00] transition-colors'
const labelClass = 'block text-sm font-medium text-[#404040] mb-1'

async function uploadImage(file: File): Promise<string> {
  const converted = await convertIfHeic(file)
  const fd = new FormData()
  fd.append('file', converted)
  fd.append('folder', 'studios')
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('خطا در آپلود تصویر')
  const data = await res.json()
  return data.url as string
}

function makeKey() {
  return Math.random().toString(36).slice(2)
}

const MAX_GALLERY_IMAGES = 5

type Mode = 'form' | 'crop'

export default function StudioModal({ open, studio, onClose, onSave }: StudioModalProps) {
  const [mode,        setMode]        = useState<Mode>('form')
  const [loading,     setLoading]     = useState(false)
  const [cropLoading, setCropLoading] = useState(false)
  const [gallery,     setGallery]     = useState<GallerySlot[]>([])
  const [cropTarget,  setCropTarget]  = useState<string | 'new' | null>(null)
  const [cropSrc,     setCropSrc]     = useState<string | null>(null)
  const [cropArea,    setCropArea]    = useState<Area | null>(null)
  const [form, setForm] = useState({
    name: '', description: '', capacity: '', pricePerHour: '', isActive: true,
  })

  useEffect(() => {
    if (!open) return
    setMode('form')
    setCropTarget(null)
    setCropSrc(null)
    setCropArea(null)
    setGallery(studio.images.map((url) => ({ key: makeKey(), url, preview: null, status: 'success' as const })))
    setForm({
      name:         studio.name,
      description:  studio.description ?? '',
      capacity:     String(studio.capacity),
      pricePerHour: String(studio.pricePerHour),
      isActive:     studio.isActive,
    })
  }, [studio, open])

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleAreaChange = useCallback((area: Area) => setCropArea(area), [])

  function openCropFor(src: string, target: string | 'new') {
    setCropSrc(src)
    setCropArea(null)
    setCropTarget(target)
    setMode('crop')
  }

  function removeSlot(key: string) {
    setGallery((prev) => prev.filter((s) => s.key !== key))
  }

  async function handleCropConfirm() {
    if (!cropSrc || !cropArea || !cropTarget) return
    setCropLoading(true)
    try {
      const file = await getCroppedFile(cropSrc, cropArea)
      const preview = URL.createObjectURL(file)
      setMode('form')

      const targetKey = cropTarget === 'new' ? makeKey() : cropTarget
      if (cropTarget === 'new') {
        setGallery((prev) => [...prev, { key: targetKey, url: null, preview, status: 'uploading' }])
      } else {
        setGallery((prev) => prev.map((s) => s.key === targetKey ? { ...s, preview, status: 'uploading' } : s))
      }

      try {
        const url = await uploadImage(file)
        setGallery((prev) => prev.map((s) => s.key === targetKey ? { ...s, url, preview: null, status: 'success' } : s))
      } catch {
        toast.error('خطا در آپلود تصویر')
        setGallery((prev) => prev.map((s) => s.key === targetKey ? { ...s, status: 'error' } : s))
      }
    } catch {
      toast.error('خطا در پردازش تصویر')
      setMode('form')
    } finally {
      setCropLoading(false)
      setCropTarget(null)
    }
  }

  async function handleSubmit() {
    if (!form.name || !form.capacity || !form.pricePerHour) {
      toast.error('نام، ظرفیت و قیمت الزامی هستند')
      return
    }
    const capacity = parseInt(form.capacity, 10)
    const pricePerHour = parseInt(form.pricePerHour, 10)
    if (isNaN(capacity) || capacity <= 0) { toast.error('ظرفیت نامعتبر است'); return }
    if (isNaN(pricePerHour) || pricePerHour <= 0) { toast.error('قیمت نامعتبر است'); return }
    if (gallery.some((s) => s.status === 'uploading')) { toast.error('لطفاً صبر کنید تا آپلود تصاویر تمام شود'); return }

    setLoading(true)
    try {
      const images = gallery.filter((s) => s.url).map((s) => s.url as string)
      const body = {
        name:         form.name,
        description:  form.description || null,
        capacity,
        pricePerHour,
        images,
        isActive:     form.isActive,
      }
      const res = await fetch(`/api/admin/studios/${studio.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      toast.success('پلاتو با موفقیت ویرایش شد')
      onSave()
      onClose()
    } catch {
      toast.error('خطا در ذخیره پلاتو')
    } finally {
      setLoading(false)
    }
  }

  const isCrop = mode === 'crop'

  function hasUnsavedChanges() {
    const currentImages = gallery.filter((s) => s.url).map((s) => s.url as string)
    const imagesChanged =
      currentImages.length !== studio.images.length ||
      currentImages.some((url, i) => url !== studio.images[i])
    const formChanged =
      form.name !== studio.name ||
      form.description !== (studio.description ?? '') ||
      form.capacity !== String(studio.capacity) ||
      form.pricePerHour !== String(studio.pricePerHour) ||
      form.isActive !== studio.isActive
    return imagesChanged || formChanged
  }

  function handleRequestClose() {
    if (hasUnsavedChanges() && !window.confirm('تغییرات ذخیره‌نشده از دست می‌رود. مطمئنید می‌خواهید ببندید؟')) {
      return
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      maxWidth={680}
      title={isCrop ? 'برش تصویر' : 'ویرایش پلاتو'}
      onClose={isCrop ? () => setMode('form') : handleRequestClose}
      footer={
        isCrop ? (
          <>
            <button
              onClick={() => setMode('form')}
              style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E5E5', background: 'white', fontSize: 14, cursor: 'pointer' }}
            >
              انصراف
            </button>
            <button
              onClick={handleCropConfirm}
              disabled={cropLoading || !cropArea}
              style={{
                padding: '8px 22px', borderRadius: 8, border: 'none',
                background: '#8C2020', color: 'white', fontSize: 14, fontWeight: 600,
                cursor: (cropLoading || !cropArea) ? 'not-allowed' : 'pointer',
                opacity: cropLoading ? 0.65 : 1,
              }}
            >
              {cropLoading ? 'در حال پردازش...' : 'تأیید برش'}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleRequestClose}
              style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E5E5', background: 'white', fontSize: 14, cursor: 'pointer' }}
            >
              انصراف
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#801A00', color: 'white', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
          </>
        )
      }
    >
      {isCrop && cropSrc ? (
        <ImageCropper imageSrc={cropSrc} onAreaChange={handleAreaChange} />
      ) : (
        <div className="flex flex-col gap-4">
          {/* نام */}
          <div>
            <label className={labelClass}>نام پلاتو *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="مثال: پلاتو تئاتر ۱"
            />
          </div>

          {/* ظرفیت + قیمت */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>ظرفیت (نفر) *</label>
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                className={inputClass}
                value={form.capacity}
                onChange={(e) => set('capacity', e.target.value)}
                placeholder="20"
              />
            </div>
            <div>
              <label className={labelClass}>قیمت هر ساعت (تومان) *</label>
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                className={inputClass}
                value={form.pricePerHour}
                onChange={(e) => set('pricePerHour', e.target.value)}
                placeholder="350000"
              />
            </div>
          </div>

          {/* توضیحات */}
          <div>
            <label className={labelClass}>توضیحات (اختیاری)</label>
            <textarea
              className={inputClass}
              rows={2}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="توضیح کوتاه درباره پلاتو..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* گالری تصاویر */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#404040', display: 'block', marginBottom: 10 }}>
              گالری تصاویر ({gallery.length} از {MAX_GALLERY_IMAGES})
            </label>
            <div className="flex flex-wrap gap-3">
              {gallery.map((slot) => (
                <div key={slot.key} style={{ width: 200 }}>
                  <ImageUploadZone
                    currentUrl={slot.url}
                    preview={slot.preview}
                    status={slot.status}
                    onFileSelect={(file) => openCropFor(URL.createObjectURL(file), slot.key)}
                    onDeleteExisting={() => removeSlot(slot.key)}
                    onClear={() => removeSlot(slot.key)}
                  />
                </div>
              ))}
              {gallery.length < MAX_GALLERY_IMAGES && (
                <div style={{ width: 200 }}>
                  <ImageUploadZone
                    currentUrl={null}
                    preview={null}
                    status="idle"
                    onFileSelect={(file) => openCropFor(URL.createObjectURL(file), 'new')}
                    onClear={() => {}}
                  />
                </div>
              )}
            </div>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
              حداکثر {MAX_GALLERY_IMAGES} عکس برای هر پلاتو
            </p>
          </div>

          {/* وضعیت */}
          <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: 14, color: '#404040' }}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              className="w-4 h-4 accent-[#801A00]"
            />
            فعال (قابل رزرو در سایت)
          </label>
        </div>
      )}
    </Modal>
  )
}
