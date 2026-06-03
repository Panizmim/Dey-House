'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ImagePlus, X } from '@/components/ui/icons'
import { toPersianNum } from '@/lib/utils'

interface UploadMeta {
  originalSize: number
  optimizedSize: number
  savings: string
}

interface ImageUploadZoneProps {
  currentUrl?: string | null
  preview: string | null
  onFileSelect: (file: File) => void
  onClear: () => void
  uploadMeta?: UploadMeta | null
}

export default function ImageUploadZone({ currentUrl, preview, onFileSelect, onClear, uploadMeta }: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    if (file.size > 20 * 1024 * 1024) return
    onFileSelect(file)
  }

  return (
    <div>
      {currentUrl && !preview && (
        <div style={{ marginBottom: 12 }}>
          <Image src={currentUrl} alt="تصویر فعلی" width={80} height={80} className="rounded-lg object-cover" />
          <p style={{ fontSize: 11, color: '#B0B0B0', marginTop: 4 }}>
            تصویر فعلی — برای تغییر، تصویر جدید انتخاب کنید
          </p>
        </div>
      )}

      {preview ? (
        <div style={{ position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="پیش‌نمایش" className="w-full rounded-lg object-cover" style={{ height: 160 }} />
          <button
            onClick={onClear}
            style={{
              position: 'absolute', top: 8, left: 8,
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} color="white" />
          </button>
          {uploadMeta && (
            <p style={{ fontSize: 11, color: '#2F9E44', marginTop: 6, textAlign: 'center' }}>
              ✓ بهینه شد: {toPersianNum(uploadMeta.originalSize)}KB ← {toPersianNum(uploadMeta.optimizedSize)}KB ({uploadMeta.savings} کاهش)
            </p>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
          }}
          style={{
            border: `1px dashed ${dragging ? '#801A00' : '#E5E5E5'}`,
            borderRadius: 8,
            padding: 24,
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? '#FAFAFA' : 'white',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#801A00'
            e.currentTarget.style.background  = '#FAFAFA'
          }}
          onMouseLeave={(e) => {
            if (!dragging) {
              e.currentTarget.style.borderColor = '#E5E5E5'
              e.currentTarget.style.background  = 'white'
            }
          }}
        >
          <ImagePlus size={24} color="#B0B0B0" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: 13, color: '#717171', marginBottom: 4 }}>انتخاب تصویر</p>
          <p style={{ fontSize: 11, color: '#B0B0B0' }}>JPG, PNG, WebP — حداکثر ۲۰MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
