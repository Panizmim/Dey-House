'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ImagePlus, X } from '@/components/ui/icons'

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface ImageUploadZoneProps {
  currentUrl?: string | null
  preview: string | null
  onFileSelect: (file: File) => void
  onClear: () => void
  status?: UploadStatus
  errorMessage?: string | null
}

export default function ImageUploadZone({
  currentUrl, preview, onFileSelect, onClear,
  status = 'idle', errorMessage,
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.heics', '.avif']
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    const typeOk = file.type.startsWith('image/') || file.type === '' || file.type === 'application/octet-stream'
    const extOk  = allowedExts.includes(ext)
    if (!typeOk && !extOk) return
    if (file.size > 50 * 1024 * 1024) return
    onFileSelect(file)
  }

  return (
    <div>
      {currentUrl && !preview && (
        <div
          onClick={() => status !== 'uploading' && inputRef.current?.click()}
          style={{ position: 'relative', marginBottom: 12, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', maxWidth: 200 }}
        >
          <Image
            src={currentUrl}
            alt="تصویر فعلی"
            width={200}
            height={280}
            className="object-cover w-full"
            style={{ display: 'block', borderRadius: 10 }}
          />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 10 }}
          >
            <ImagePlus size={22} color="white" />
            <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>تغییر پوستر</span>
          </div>
        </div>
      )}

      {preview ? (
        <div style={{ position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="پیش‌نمایش" className="w-full rounded-lg object-cover" style={{ height: 160 }} />

          {/* overlay وضعیت آپلود */}
          {status === 'uploading' && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 8,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>در حال آپلود...</p>
            </div>
          )}

          {status === 'success' && (
            <div style={{
              position: 'absolute', top: 8, right: 8,
              background: '#16A34A', borderRadius: '50%',
              width: 24, height: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          {status === 'error' && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 8,
              background: 'rgba(220,38,38,0.15)',
              border: '2px solid #DC2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <p style={{ color: '#DC2626', fontSize: 12, fontWeight: 700, background: 'white', padding: '4px 10px', borderRadius: 6 }}>
                {errorMessage ?? 'خطا در آپلود'}
              </p>
            </div>
          )}

          {status !== 'uploading' && (
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
          )}
        </div>
      ) : (
        <div
          onClick={() => status !== 'uploading' && inputRef.current?.click()}
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
            borderRadius: 8, padding: 24, textAlign: 'center',
            cursor: status === 'uploading' ? 'not-allowed' : 'pointer',
            background: dragging ? '#FAFAFA' : 'white',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { if (status !== 'uploading') { e.currentTarget.style.borderColor = '#801A00'; e.currentTarget.style.background = '#FAFAFA' } }}
          onMouseLeave={(e) => { if (!dragging) { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.background = 'white' } }}
        >
          <ImagePlus size={24} color="#B0B0B0" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: 13, color: '#717171', marginBottom: 4 }}>انتخاب تصویر یا رها کردن فایل اینجا</p>
          <p style={{ fontSize: 11, color: '#B0B0B0' }}>JPG، PNG، WebP، HEIC — حداکثر ۵۰MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif,.heics"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {/* CSS animation برای spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
