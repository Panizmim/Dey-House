'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { Area } from 'react-easy-crop'
import Modal from './Modal'
import ImageUploadZone, { type UploadStatus } from './ImageUploadZone'
import ImageCropper, { getCroppedFile } from './ImageCropModal'
import { ChevronDown } from '@/components/ui/icons'
import { convertIfHeic } from '@/lib/convertHeic'

export interface CafeMenuItem {
  id: string
  name: string
  price: number
  category: string
  description: string | null
  imageUrl: string | null
  isAvailable: boolean
}

interface CafeItemModalProps {
  open: boolean
  item?: CafeMenuItem | null
  categories?: string[]
  onClose: () => void
  onSave: () => void
}

const inputClass = 'w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:border-[#801A00] transition-colors'
const labelClass = 'block text-sm font-medium text-[#404040] mb-1'

async function uploadImage(file: File): Promise<string> {
  const converted = await convertIfHeic(file)
  const fd = new FormData()
  fd.append('file', converted)
  fd.append('folder', 'cafe-menu')
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('خطا در آپلود تصویر')
  const data = await res.json()
  return data.url as string
}

type Mode = 'form' | 'crop'

export default function CafeItemModal({ open, item, categories = [], onClose, onSave }: CafeItemModalProps) {
  const [mode,          setMode]         = useState<Mode>('form')
  const [loading,       setLoading]      = useState(false)
  const [cropLoading,   setCropLoading]  = useState(false)
  const [imagePreview,  setImagePreview] = useState<string | null>(null)
  const [imageUrl,      setImageUrl]     = useState<string | null>(null)
  const [imageStatus,   setImageStatus]  = useState<UploadStatus>('idle')
  const [imageDeleted,  setImageDeleted] = useState(false)
  const [cropSrc,       setCropSrc]      = useState<string | null>(null)
  const [cropArea,      setCropArea]     = useState<Area | null>(null)
  const [form, setForm] = useState({
    name: '', price: '', category: categories[0] ?? '', description: '', isAvailable: true,
  })

  useEffect(() => {
    if (!open) return
    setMode('form')
    setImagePreview(null)
    setImageUrl(null)
    setImageStatus('idle')
    setImageDeleted(false)
    setCropSrc(null)
    setCropArea(null)
    if (item) {
      setForm({
        name:        item.name,
        price:       String(item.price),
        category:    item.category,
        description: item.description ?? '',
        isAvailable: item.isAvailable,
      })
    } else {
      setForm({ name: '', price: '', category: categories[0] ?? '', description: '', isAvailable: true })
    }
  }, [item, open, categories])

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
    if (!form.name || !form.price || !form.category) {
      toast.error('نام، قیمت و دسته‌بندی الزامی هستند')
      return
    }
    const price = parseInt(form.price, 10)
    if (isNaN(price) || price <= 0) { toast.error('قیمت نامعتبر است'); return }
    if (imageStatus === 'uploading') { toast.error('لطفاً صبر کنید تا آپلود تمام شود'); return }

    setLoading(true)
    try {
      const finalImageUrl = imageDeleted ? null : (imageUrl ?? item?.imageUrl ?? null)
      const body = {
        name:        form.name,
        price,
        category:    form.category,
        description: form.description || null,
        imageUrl:    finalImageUrl,
        isAvailable: form.isAvailable,
      }
      const url    = item ? `/api/admin/cafe-menu/${item.id}` : '/api/admin/cafe-menu'
      const method = item ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      toast.success(item ? 'آیتم با موفقیت ویرایش شد' : 'آیتم با موفقیت اضافه شد')
      onSave()
      onClose()
    } catch {
      toast.error('خطا در ذخیره آیتم')
    } finally {
      setLoading(false)
    }
  }

  const isCrop = mode === 'crop'

  return (
    <Modal
      open={open}
      maxWidth={680}
      title={isCrop ? 'برش تصویر' : item ? 'ویرایش آیتم منو' : 'افزودن آیتم جدید'}
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
              {loading ? 'در حال ذخیره...' : item ? 'ذخیره تغییرات' : 'افزودن آیتم'}
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
            <label className={labelClass}>نام آیتم *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="مثال: اسپرسو"
            />
          </div>

          {/* قیمت + دسته */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>قیمت (تومان) *</label>
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                className={inputClass}
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="350000"
              />
            </div>
            <div>
              <label className={labelClass}>دسته‌بندی *</label>
              <div style={{ position: 'relative' }}>
                <select
                  className={inputClass}
                  style={{ height: 38, appearance: 'none', WebkitAppearance: 'none', paddingLeft: 28 }}
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} color="#A0A0A0" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* محتویات */}
          <div>
            <label className={labelClass}>محتویات (اختیاری)</label>
            <textarea
              className={inputClass}
              rows={2}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="مثال: قهوه، شیر، شکر..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* تصویر */}
          <div>
            <label className={labelClass}>تصویر آیتم</label>
            <ImageUploadZone
              currentUrl={imageDeleted ? null : (imageUrl ?? item?.imageUrl)}
              preview={imagePreview}
              status={imageStatus}
              onFileSelect={(file) => { setImageDeleted(false); openCropFor(URL.createObjectURL(file)) }}
              onCropExisting={() => {
                const src = imageUrl ?? imagePreview ?? item?.imageUrl ?? null
                if (src) openCropFor(src)
              }}
              onDeleteExisting={() => {
                setImageDeleted(true)
                setImagePreview(null)
                setImageUrl(null)
                setImageStatus('idle')
              }}
              onClear={() => { setImagePreview(null); setImageUrl(null); setImageStatus('idle') }}
            />
          </div>

          {/* وضعیت */}
          <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: 14, color: '#404040' }}>
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => set('isAvailable', e.target.checked)}
              className="w-4 h-4 accent-[#801A00]"
            />
            موجود است
          </label>
        </div>
      )}
    </Modal>
  )
}
