'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'

interface Props {
  imageSrc: string
  onAreaChange: (area: Area) => void
}

export default function ImageCropper({ imageSrc, onAreaChange }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const handleCropComplete = useCallback(
    (_: Area, pixels: Area) => onAreaChange(pixels),
    [onAreaChange],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* ناحیه کراپ */}
      <div style={{ position: 'relative', height: 300, borderRadius: 8, overflow: 'hidden', background: '#111' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          cropShape="rect"
          showGrid
          style={{
            containerStyle: { borderRadius: 8 },
            cropAreaStyle: { border: '2px solid #8C2020', borderRadius: 8 },
          }}
        />
      </div>

      {/* اسلایدر زوم */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, direction: 'rtl' }}>
        <span style={{ fontSize: 12, color: '#717171', flexShrink: 0 }}>زوم</span>
        <input
          type="range" min={1} max={3} step={0.01} value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#8C2020', cursor: 'pointer' }}
        />
        <span style={{ fontSize: 11, color: '#B0B0B0', flexShrink: 0, minWidth: 28, textAlign: 'left' }}>
          {zoom.toFixed(1)}×
        </span>
      </div>

      <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
        تصویر را بکشید و زوم کنید تا بخش مورد نظر انتخاب شود — نسبت مربعی
      </p>
    </div>
  )
}

/* ── تابع کمکی: ساخت Blob از ناحیه کراپ ── */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function getCroppedFile(src: string, area: Area): Promise<File> {
  const image  = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width  = area.width
  canvas.height = area.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height)
  const blob = await new Promise<Blob>((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error('canvas empty'))), 'image/jpeg', 0.92),
  )
  return new File([blob], `menu-${Date.now()}.jpg`, { type: 'image/jpeg' })
}
