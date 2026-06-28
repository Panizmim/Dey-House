export async function convertIfHeic(file: File): Promise<File> {
  const ext  = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.type === 'image/heics' ||
    (file.type === '' && (ext === '.heic' || ext === '.heif' || ext === '.heics'))

  if (!isHeic) return file

  const heic2any = (await import('heic2any')).default
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 }) as Blob
  const name = file.name.replace(/\.[^.]+$/, '.jpg')
  return new File([blob], name, { type: 'image/jpeg' })
}
