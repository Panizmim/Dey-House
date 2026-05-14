'use client'

import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

interface ImageUploadZoneProps {
  currentUrl?: string | null
  preview: string | null
  onFileSelect: (file: File) => void
  onClear: () => void
}

export default function ImageUploadZone({ currentUrl, preview, onFileSelect, onClear }: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return
    onFileSelect(file)
  }

  return (
    <div>
      {currentUrl && !preview && (
        <div style={{ marginBottom: 12 }}>
          <img src={currentUrl} alt="تصویر فعلی" className="w-20 h-20 rounded-lg object-cover" />
          <p style={{ fontSize: 11, color: '#B0B0B0', marginTop: 4 }}>
            تصویر فعلی — برای تغییر، تصویر جدید انتخاب کنید
          </p>
        </div>
      )}

      {preview ? (
        <div style={{ position: 'relative' }}>
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
            border: `1px dashed ${dragging ? '#8B1E1E' : '#E5E5E5'}`,
            borderRadius: 8,
            padding: 24,
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? '#FAFAFA' : 'white',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#8B1E1E'
            e.currentTarget.style.background = '#FAFAFA'
          }}
          onMouseLeave={(e) => {
            if (!dragging) {
              e.currentTarget.style.borderColor = '#E5E5E5'
              e.currentTarget.style.background = 'white'
            }
          }}
        >
          <ImagePlus size={24} color="#B0B0B0" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: 13, color: '#717171', marginBottom: 4 }}>انتخاب تصویر</p>
          <p style={{ fontSize: 11, color: '#B0B0B0' }}>JPG, PNG — حداکثر ۵MB</p>
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
