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
