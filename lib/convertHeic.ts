'use client'

function isHeicFile(file: File): boolean {
  const ext = (file.name.toLowerCase().split('.').pop()) ?? ''
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.type === 'image/heics' ||
    ((file.type === '' || file.type === 'application/octet-stream') &&
      ['heic', 'heif', 'heics'].includes(ext))
  )
}

export async function convertIfHeic(file: File): Promise<File> {
  if (!isHeicFile(file)) return file

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width  = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) { URL.revokeObjectURL(url); resolve(file); return }
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (!blob) { resolve(file); return }
          const name = file.name.replace(/\.[^.]+$/, '.jpg')
          resolve(new File([blob], name, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        0.92,
      )
    }

    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

// Vercel درخواست‌های بزرگ‌تر از ۴.۵MB را قبل از رسیدن به API رد می‌کند (خطای 413).
// سرور در هر حال تصویر را به حداکثر ۱۹۲۰ پیکسل کوچک می‌کند، پس کوچک کردن
// در مرورگر تا همین اندازه هیچ کیفیتی از نتیجه‌ی نهایی کم نمی‌کند.
const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024
const MAX_SIDE = 1920

function loadImage(file: File): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload  = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
    img.src = url
  })
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

/** تبدیل HEIC + کوچک کردن تصاویر حجیم تا زیر سقف حجم درخواست Vercel */
export async function prepareImageForUpload(file: File): Promise<File> {
  const converted = await convertIfHeic(file)
  if (converted.size <= MAX_UPLOAD_BYTES) return converted

  const img = await loadImage(converted)
  if (!img) return converted

  const scale  = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width  = Math.round(img.naturalWidth  * scale)
  canvas.height = Math.round(img.naturalHeight * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return converted
  // پس‌زمینه سفید تا بخش‌های شفاف PNG در JPEG سیاه نشوند
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  for (const quality of [0.92, 0.85, 0.75]) {
    const blob = await canvasToJpeg(canvas, quality)
    if (blob && blob.size <= MAX_UPLOAD_BYTES) {
      const name = converted.name.replace(/\.[^.]+$/, '.jpg')
      return new File([blob], name, { type: 'image/jpeg' })
    }
  }
  return converted
}
