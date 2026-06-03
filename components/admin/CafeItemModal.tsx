'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from './Modal'
import ImageUploadZone from './ImageUploadZone'

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

async function uploadImage(file: File, folder: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('folder', folder)
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('خطا در آپلود تصویر')
  const data = await res.json()
  return data.url as string
}

export default function CafeItemModal({ open, item, categories = [], onClose, onSave }: CafeItemModalProps) {
  const CATEGORIES = categories
  const [loading, setLoading]   = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', price: '', category: CATEGORIES[0], description: '', isAvailable: true,
  })

  useEffect(() => {
    if (!open) return
    setImageFile(null)
    setImagePreview(null)
    if (item) {
      setForm({
        name:        item.name,
        price:       String(item.price),
        category:    item.category,
        description: item.description ?? '',
        isAvailable: item.isAvailable,
      })
    } else {
      setForm({ name: '', price: '', category: CATEGORIES[0] ?? '', description: '', isAvailable: true })
    }
  }, [item, open])

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  function handleFileSelect(file: File) {
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleClearImage() {
    setImageFile(null)
    setImagePreview(null)
  }

  async function handleSubmit() {
    if (!form.name || !form.price || !form.category) {
      toast.error('نام، قیمت و دسته‌بندی الزامی هستند')
      return
    }
    const price = parseInt(form.price, 10)
    if (isNaN(price) || price <= 0) { toast.error('قیمت نامعتبر است'); return }

    setLoading(true)
    try {
      let imageUrl: string | null = item?.imageUrl ?? null
      if (imageFile) imageUrl = await uploadImage(imageFile, 'cafe-menu')

      const body = {
        name:        form.name,
        price,
        category:    form.category,
        description: form.description || null,
        imageUrl,
        isAvailable: form.isAvailable,
      }

      const url    = item ? `/api/admin/cafe-menu/${item.id}` : '/api/admin/cafe-menu'
      const method = item ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
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

  return (
    <Modal
      open={open}
      title={item ? 'ویرایش آیتم منو' : 'افزودن آیتم جدید'}
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
            {loading ? 'در حال ذخیره...' : item ? 'ذخیره تغییرات' : 'افزودن آیتم'}
          </button>
        </>
      }
    >
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
              type="number"
              className={inputClass}
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="مثال: 350000"
            />
          </div>
          <div>
            <label className={labelClass}>دسته‌بندی *</label>
            <select className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* محتویات غذا */}
        <div>
          <label className={labelClass}>محتویات غذا (اختیاری)</label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="مثال: قهوه، شیر، شکر — یا مواد اولیه..."
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* تصویر */}
        <div>
          <label className={labelClass}>تصویر آیتم</label>
          <ImageUploadZone
            currentUrl={item?.imageUrl}
            preview={imagePreview}
            onFileSelect={handleFileSelect}
            onClear={handleClearImage}
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
    </Modal>
  )
}
