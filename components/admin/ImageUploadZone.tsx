'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ImagePlus } from '@/components/ui/icons'
import { convertIfHeic } from '@/lib/convertHeic'

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface ImageUploadZoneProps {
  currentUrl?: string | null
  preview: string | null
  onFileSelect: (file: File) => void
  onClear: () => void
  onCropExisting?: () => void
  onDeleteExisting?: () => void
  status?: UploadStatus
  errorMessage?: string | null
}

export default function ImageUploadZone({
  currentUrl, preview, onFileSelect, onClear, onCropExisting, onDeleteExisting,
  status = 'idle', errorMessage,
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  async function handleFile(file: File) {
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.heics', '.avif']
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    const typeOk = file.type.startsWith('image/') || file.type === '' || file.type === 'application/octet-stream'
    const extOk  = allowedExts.includes(ext)
    if (!typeOk && !extOk) return
    if (file.size > 50 * 1024 * 1024) return
    const converted = await convertIfHeic(file)
    onFileSelect(converted)
  }

  return (
    <div>
      {currentUrl && !preview && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', width: 200, height: 200 }}>
            <Image src={currentUrl} alt="تصویر فعلی" fill className="object-cover" />
            {/* دکمه‌های overlay روی عکس */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              display: 'flex', borderTop: '1px solid rgba(255,255,255,0.15)',
            }}>
              {onCropExisting && (
                <button
                  type="button"
                  onClick={onCropExisting}
                  style={{
                    flex: 1, padding: '8px 0', border: 'none', borderRight: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.52)', color: 'white',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  برش
                </button>
              )}
              {onDeleteExisting && (
                <button
                  type="button"
                  onClick={onDeleteExisting}
                  style={{
                    flex: 1, padding: '8px 0', border: 'none',
                    background: 'rgba(185,28,28,0.72)', color: 'white',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  حذف
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => status !== 'uploading' && inputRef.current?.click()}
            style={{
              marginTop: 8, padding: '4px 12px', borderRadius: 6, border: '1px solid #E5E5E5',
              background: 'white', color: '#717171', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            تغییر تصویر
          </button>
        </div>
      )}

      {preview ? (
        <div style={{ marginBottom: 4 }}>
          {/* پیش‌نمایش مربعی */}
          <div style={{ position: 'relative', width: 200, height: 200, borderRadius: 10, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="پیش‌نمایش"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />

            {status === 'uploading' && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <p style={{ color: 'white', fontSize: 10, fontWeight: 600 }}>آپلود...</p>
              </div>
            )}

            {status === 'success' && (
              <div style={{
                position: 'absolute', top: 6, right: 6,
                background: '#16A34A', borderRadius: '50%',
                width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}

            {status === 'error' && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(220,38,38,0.15)',
                border: '2px solid #DC2626',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <p style={{ color: '#DC2626', fontSize: 10, fontWeight: 700, background: 'white', padding: '3px 8px', borderRadius: 4 }}>
                  {errorMessage ?? 'خطا'}
                </p>
              </div>
            )}

            {/* دکمه‌های overlay روی پیش‌نمایش */}
            {status !== 'uploading' && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                display: 'flex', borderTop: '1px solid rgba(255,255,255,0.15)',
              }}>
                {onCropExisting && (
                  <button
                    type="button"
                    onClick={onCropExisting}
                    style={{
                      flex: 1, padding: '8px 0', border: 'none', borderRight: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(0,0,0,0.52)', color: 'white',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    برش مجدد
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClear}
                  style={{
                    flex: 1, padding: '8px 0', border: 'none',
                    background: 'rgba(185,28,28,0.72)', color: 'white',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  حذف
                </button>
              </div>
            )}
          </div>
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
