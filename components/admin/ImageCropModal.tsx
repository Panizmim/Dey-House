'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'

interface Props {
  imageSrc: string
  onCrop: (file: File) => void
  onCancel: () => void
}

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.src = src
  })
}

async function getCroppedBlob(src: string, area: Area): Promise<Blob> {
  const image = await createImage(src)
  const canvas = document.createElement('canvas')
  canvas.width  = area.width
  canvas.height = area.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('canvas empty'))),
      'image/jpeg',
      0.92,
    )
  })
}

export default function ImageCropModal({ imageSrc, onCrop, onCancel }: Props) {
  const [crop,    setCrop]    = useState({ x: 0, y: 0 })
  const [zoom,    setZoom]    = useState(1)
  const [area,    setArea]    = useState<Area | null>(null)
  const [loading, setLoading] = useState(false)

  const onCropComplete = useCallback((_: Area, pixels: Area) => setArea(pixels), [])

  async function handleConfirm() {
    if (!area) return
    setLoading(true)
    try {
      const blob = await getCroppedBlob(imageSrc, area)
      const file = new File([blob], `menu-${Date.now()}.jpg`, { type: 'image/jpeg' })
      onCrop(file)
    } catch {
      // اگه خطا داشت کاربر دوباره امتحان می‌کنه
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        background: 'rgba(0,0,0,0.92)',
      }}
    >
      {/* هدر */}
      <div style={{
        padding: '16px 20px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#12070a', borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <h2 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>
          برش تصویر منو
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>
          بخش مورد نظر را انتخاب کنید — نسبت مربعی
        </p>
      </div>

      {/* ناحیه کراپ */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          cropShape="rect"
          showGrid
          style={{
            containerStyle: { background: '#000' },
            cropAreaStyle: { border: '2px solid #8C2020', borderRadius: 8 },
          }}
        />
      </div>

      {/* اسلایدر زوم */}
      <div style={{
        background: '#0d0505', padding: '14px 24px', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 12, direction: 'rtl',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, flexShrink: 0 }}>
          زوم
        </span>
        <input
          type="range" min={1} max={3} step={0.01} value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#8C2020', cursor: 'pointer', height: 4 }}
        />
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, flexShrink: 0, minWidth: 32, textAlign: 'left' }}>
          {zoom.toFixed(1)}×
        </span>
      </div>

      {/* دکمه‌ها */}
      <div style={{
        background: '#12070a', padding: '14px 20px', flexShrink: 0,
        display: 'flex', gap: 10, justifyContent: 'flex-end', direction: 'rtl',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <button
          onClick={onCancel}
          style={{
            padding: '9px 20px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'transparent', color: 'rgba(255,255,255,0.8)',
            fontSize: 14, cursor: 'pointer',
          }}
        >
          انصراف
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading || !area}
          style={{
            padding: '9px 24px', borderRadius: 8, border: 'none',
            background: '#8C2020', color: 'white',
            fontSize: 14, fontWeight: 700,
            cursor: (loading || !area) ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.65 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {loading ? 'در حال پردازش...' : 'تأیید و ادامه'}
        </button>
      </div>
    </div>
  )
}
