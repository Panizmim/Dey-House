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
  imageUrl: string | null
  isActive: boolean
}

interface StudioModalProps {
  open: boolean
  studio?: Studio | null
  onClose: () => void
  onSave: () => void
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

type Mode = 'form' | 'crop'

export default function StudioModal({ open, studio, onClose, onSave }: StudioModalProps) {
  const [mode,         setMode]        = useState<Mode>('form')
  const [loading,      setLoading]     = useState(false)
  const [cropLoading,  setCropLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl,     setImageUrl]    = useState<string | null>(null)
  const [imageRemoved, setImageRemoved] = useState(false)
  const [imageStatus,  setImageStatus] = useState<UploadStatus>('idle')
  const [cropSrc,      setCropSrc]     = useState<string | null>(null)
  const [cropArea,     setCropArea]    = useState<Area | null>(null)
  const [form, setForm] = useState({
    name: '', description: '', capacity: '', pricePerHour: '', isActive: true,
  })

  useEffect(() => {
    if (!open) return
    setMode('form')
    setImagePreview(null)
    setImageUrl(null)
    setImageRemoved(false)
    setImageStatus('idle')
    setCropSrc(null)
    setCropArea(null)
    if (studio) {
      setForm({
        name:         studio.name,
        description:  studio.description ?? '',
        capacity:     String(studio.capacity),
        pricePerHour: String(studio.pricePerHour),
        isActive:     studio.isActive,
      })
    } else {
      setForm({ name: '', description: '', capacity: '', pricePerHour: '', isActive: true })
    }
  }, [studio, open])

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleAreaChange = useCallback((area: Area) => setCropArea(area), [])

  function openCropFor(src: string) {
    setCropSrc(src)
    setCropArea(null)
    setMode('crop')
  }

  async function handleCropConfirm() {
    if (!cropSrc || !cropArea) return
    setCropLoading(true)
    try {
      const file = await getCroppedFile(cropSrc, cropArea)
      setMode('form')
      setImagePreview(URL.createObjectURL(file))
      setImageUrl(null)
      setImageRemoved(false)
      setImageStatus('uploading')
      const url = await uploadImage(file)
      setImageUrl(url)
      setImageStatus('success')
    } catch {
      setImageStatus('error')
      toast.error('خطا در پردازش تصویر')
      setMode('form')
    } finally {
      setCropLoading(false)
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
    if (imageStatus === 'uploading') { toast.error('لطفاً صبر کنید تا آپلود تمام شود'); return }

    setLoading(true)
    try {
      const finalImageUrl = imageRemoved ? null : (imageUrl ?? studio?.imageUrl ?? null)
      const body = {
        name:         form.name,
        description:  form.description || null,
        capacity,
        pricePerHour,
        imageUrl:     finalImageUrl,
        isActive:     form.isActive,
      }
      const url    = studio ? `/api/admin/studios/${studio.id}` : '/api/admin/studios'
      const method = studio ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      toast.success(studio ? 'پلاتو با موفقیت ویرایش شد' : 'پلاتو با موفقیت اضافه شد')
      onSave()
      onClose()
    } catch {
      toast.error('خطا در ذخیره پلاتو')
    } finally {
      setLoading(false)
    }
  }

  const isCrop = mode === 'crop'

  return (
    <Modal
      open={open}
      maxWidth={680}
      title={isCrop ? 'برش تصویر' : studio ? 'ویرایش پلاتو' : 'افزودن پلاتو جدید'}
      onClose={isCrop ? () => setMode('form') : onClose}
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
              {loading ? 'در حال ذخیره...' : studio ? 'ذخیره تغییرات' : 'افزودن پلاتو'}
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

          {/* تصویر */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#404040', display: 'block', marginBottom: 10 }}>
              تصویر پلاتو
            </label>
            <ImageUploadZone
              currentUrl={imageRemoved ? null : (imageUrl ?? studio?.imageUrl)}
              preview={imagePreview}
              status={imageStatus}
              onFileSelect={(file) => openCropFor(URL.createObjectURL(file))}
              onCropExisting={() => {
                if (cropSrc) {
                  setCropArea(null)
                  setMode('crop')
                } else {
                  const src = imageUrl ?? imagePreview ?? studio?.imageUrl ?? null
                  if (src) openCropFor(src)
                }
              }}
              onDeleteExisting={() => {
                setImagePreview(null)
                setImageUrl(null)
                setImageRemoved(true)
                setImageStatus('idle')
              }}
              onClear={() => { setImagePreview(null); setImageUrl(null); setImageStatus('idle') }}
            />
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
