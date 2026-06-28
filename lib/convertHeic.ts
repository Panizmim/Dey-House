'use client'

function isHeicFile(file: File): boolean {
  const ext = file.name.toLowerCase().split('.').pop() ?? ''
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.type === 'image/heics' ||
    (file.type === '' && ['heic', 'heif', 'heics'].includes(ext))
  )
}

export async function convertIfHeic(file: File): Promise<File> {
  if (!isHeicFile(file)) return file
  try {
    const heic2any = (await import('heic2any')).default
    const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 }) as Blob
    const name = file.name.replace(/\.[^.]+$/, '.jpg')
    return new File([blob], name, { type: 'image/jpeg' })
  } catch {
    return file
  }
}
