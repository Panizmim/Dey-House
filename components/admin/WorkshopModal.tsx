'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import Modal from './Modal'
import ImageUploadZone, { type UploadStatus } from './ImageUploadZone'
import ImageCropper, { getCroppedFile as getCroppedFileHelper } from './ImageCropModal'
import { jalaliToDisplay } from '@/lib/jalali'
import JalaliDatePicker from '@/components/ui/JalaliDatePicker'
import { ChevronDown } from '@/components/ui/icons'
import { convertIfHeic } from '@/lib/convertHeic'
import type { Area } from 'react-easy-crop'

export interface WorkshopRow {
  id:          string
  title:       string
  date:        string
  description: string | null
  imageUrl:    string | null
  isActive:    boolean
}

interface Props {
  open:      boolean
  workshop?: WorkshopRow | null
  onClose:   () => void
  onSaved:   () => void
}

const inputClass = 'w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:border-[#801A00] transition-colors'
const labelClass = 'block text-sm font-medium text-[#404040] mb-1'

async function uploadImage(file: File): Promise<string> {
  const converted = await convertIfHeic(file)
  const fd = new FormData()
  fd.append('file', converted)
  fd.append('folder', 'workshops')
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('خطا در آپلود تصویر')
  return ((await res.json()) as { url: string }).url
}


export default function WorkshopModal({ open, workshop, onClose, onSaved }: Props) {
  const isEdit = !!workshop

  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [dateStr,     setDateStr]     = useState('')
  const [isActive,    setIsActive]    = useState(true)

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const dateRef = useRef<HTMLDivElement>(null)

  const [imageUrl,     setImageUrl]    = useState<string | null>(null)
  const [preview,      setPreview]     = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')

  const [mode,       setMode]       = useState<'form' | 'crop'>('form')
  const [cropSrc,    setCropSrc]    = useState<string | null>(null)
  const [cropArea,   setCropArea]   = useState<Area | null>(null)
  const [cropLoading, setCropLoading] = useState(false)

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (workshop) {
      setTitle(workshop.title)
      setDescription(workshop.description ?? '')
      setDateStr(workshop.date.slice(0, 10))
      setSelectedDate(new Date(workshop.date))
      setIsActive(workshop.isActive)
      setImageUrl(workshop.imageUrl)
    } else {
      setTitle(''); setDescription(''); setDateStr('')
      setSelectedDate(null); setIsActive(true); setImageUrl(null)
    }
    setPreview(null); setUploadStatus('idle')
    setMode('form'); setCropSrc(null); setCropArea(null)
    setShowDatePicker(false)
  }, [open, workshop])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDatePicker(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleAreaChange = useCallback((pixels: Area) => { setCropArea(pixels) }, [])

  async function handleCropConfirm() {
    if (!cropSrc || !cropArea) return
    setCropLoading(true)
    try {
      const file = await getCroppedFileHelper(cropSrc, cropArea)
      setPreview(URL.createObjectURL(file))
      setUploadStatus('uploading')
      const url = await uploadImage(file)
      setImageUrl(url)
      setUploadStatus('success')
    } catch {
      setUploadStatus('error')
      toast.error('خطا در آپلود تصویر')
    } finally {
      setCropLoading(false)
      setMode('form')
    }
  }

  function handleFileSelect(file: File) {
    const objectUrl = URL.createObjectURL(file)
    setCropSrc(objectUrl)
    setMode('crop')
  }

  async function handleSave() {
    if (!title.trim())  { toast.error('عنوان ورکشاپ الزامی است'); return }
    if (!dateStr)       { toast.error('تاریخ برگزاری الزامی است'); return }
    setSaving(true)
    try {
      const body = { title: title.trim(), date: dateStr, description: description.trim() || null, imageUrl, isActive }
      const url  = isEdit ? `/api/admin/workshops/${workshop!.id}` : '/api/admin/workshops'
      const res  = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      toast.success(isEdit ? 'ورکشاپ ویرایش شد' : 'ورکشاپ ایجاد شد')
      onSaved()
      onClose()
    } catch {
      toast.error('خطا در ذخیره ورکشاپ')
    } finally {
      setSaving(false)
    }
  }

  const isCrop = mode === 'crop'

  const datePickerPortal = showDatePicker && typeof document !== 'undefined'
    ? createPortal(
        <div
          ref={dateRef}
          style={{
            position: 'fixed', zIndex: 9999,
            top: (dateRef as React.RefObject<HTMLDivElement>).current?.getBoundingClientRect().bottom ?? 0,
            right: window.innerWidth - ((dateRef as React.RefObject<HTMLDivElement>).current?.getBoundingClientRect().right ?? 0),
          }}
        >
          <JalaliDatePicker
            selected={selectedDate}
            disablePast={false}
            onSelect={(date) => {
              setSelectedDate(date)
              const iso = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
              setDateStr(iso)
              setShowDatePicker(false)
            }}
          />
        </div>,
        document.body,
      )
    : null

  return (
    <>
      <Modal
        open={open}
        title={isCrop ? 'برش تصویر پوستر' : isEdit ? 'ویرایش ورکشاپ' : 'افزودن ورکشاپ جدید'}
        onClose={onClose}
        maxWidth={480}
        footer={
          isCrop ? (
            <>
              <button type="button" onClick={() => setMode('form')}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E5E5', background: 'white', fontSize: 14, cursor: 'pointer' }}>
                انصراف
              </button>
              <button type="button" onClick={handleCropConfirm} disabled={cropLoading}
                style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#801A00', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: cropLoading ? 0.6 : 1 }}>
                {cropLoading ? 'در حال پردازش...' : 'تأیید برش'}
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={onClose}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E5E5', background: 'white', fontSize: 14, cursor: 'pointer' }}>
                انصراف
              </button>
              <button type="button" onClick={handleSave} disabled={saving}
                style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#801A00', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'در حال ذخیره...' : isEdit ? 'ذخیره تغییرات' : 'ایجاد ورکشاپ'}
              </button>
            </>
          )
        }
      >
        {isCrop && cropSrc ? (
          <ImageCropper
            imageSrc={cropSrc}
            onAreaChange={handleAreaChange}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* عنوان */}
            <div>
              <label className={labelClass}>عنوان ورکشاپ *</label>
              <input
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: ورکشاپ بازیگری مقدماتی"
              />
            </div>

            {/* تاریخ */}
            <div ref={dateRef} style={{ position: 'relative' }}>
              <label className={labelClass}>تاریخ برگزاری *</label>
              <button
                type="button"
                className={inputClass}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'white', textAlign: 'right' }}
                onClick={() => setShowDatePicker((v) => !v)}
              >
                <span style={{ color: selectedDate ? '#171717' : '#A0A0A0', fontSize: 14 }}>
                  {selectedDate ? jalaliToDisplay(selectedDate) : 'انتخاب تاریخ'}
                </span>
                <ChevronDown size={14} color="#A0A0A0" style={{ flexShrink: 0 }} />
              </button>
            </div>

            {/* توضیحات */}
            <div>
              <label className={labelClass}>توضیحات</label>
              <textarea
                className={inputClass}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات ورکشاپ، مخاطبان، محتوای آموزشی..."
                rows={4}
                style={{ resize: 'vertical', lineHeight: 1.8 }}
              />
            </div>

            {/* پوستر */}
            <div>
              <label className={labelClass}>پوستر ورکشاپ</label>
              <ImageUploadZone
                currentUrl={imageUrl}
                preview={preview}
                onFileSelect={handleFileSelect}
                onClear={() => { setPreview(null); setUploadStatus('idle') }}
                onDeleteExisting={() => setImageUrl(null)}
                status={uploadStatus}
              />
            </div>

            {/* وضعیت */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                style={{
                  width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                  background: isActive ? '#801A00' : '#E5E5E5', transition: 'background 200ms', position: 'relative',
                }}
              >
                <span style={{
                  position: 'absolute', top: 3,
                  right: isActive ? 3 : undefined, left: isActive ? undefined : 3,
                  width: 16, height: 16, borderRadius: '50%', background: 'white',
                  transition: 'all 200ms', display: 'block',
                }} />
              </button>
              <span style={{ fontSize: 13, color: '#404040' }}>
                {isActive ? 'فعال' : 'غیرفعال'}
              </span>
            </div>

          </div>
        )}
      </Modal>

      {datePickerPortal}
    </>
  )
}
