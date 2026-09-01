import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.heics', '.avif']
const MAX_SIZE = 8 * 1024 * 1024

async function uploadToSupabase(buffer: Uint8Array, folder: string, filename: string, contentType: string): Promise<string> {
  const supabaseUrl = process.env.SUPABASE_URL!
  const anonKey     = process.env.SUPABASE_ANON_KEY!
  const path        = `${folder}/${filename}`

  const res = await fetch(`${supabaseUrl}/storage/v1/object/uploads/${path}`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${anonKey}`,
      'Content-Type': contentType,
      'x-upsert':     'true',
    },
    body: new Uint8Array(buffer),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Supabase Storage error: ${res.status} ${text}`)
  }

  return `${supabaseUrl}/storage/v1/object/public/uploads/${path}`
}

async function uploadToLocal(buffer: Uint8Array, folder: string, filename: string): Promise<string> {
  const dir = join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, filename), buffer)
  return `/uploads/${folder}/${filename}`
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file   = formData.get('file')   as File
    const folder = (formData.get('folder') as string) || 'submissions'

    if (!file)                return NextResponse.json({ error: 'فایلی انتخاب نشده' },       { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'حجم فایل بیش از ۸MB است' }, { status: 400 })

    const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase()
    const isPdf = file.type === 'application/pdf' || ext === '.pdf'
    const isImage = file.type.startsWith('image/') || file.type === '' || file.type === 'application/octet-stream'
    if (!isPdf && (!isImage || !ALLOWED_IMAGE_EXTENSIONS.includes(ext))) {
      return NextResponse.json({ error: 'فرمت فایل مجاز نیست' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const inputBuffer = Buffer.from(bytes)
    let outputBuffer: Uint8Array = inputBuffer
    let contentType = file.type
    let outputExt = ext || '.bin'

    if (!isPdf) {
      const isHeic = ['.heic', '.heif', '.heics'].includes(ext) || ['image/heic', 'image/heif', 'image/heics'].includes(file.type)
      if (isHeic) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const heicConvert = require('heic-convert')
        outputBuffer = Buffer.from(await heicConvert({ buffer: inputBuffer, format: 'JPEG', quality: 0.92 }))
      }

      outputBuffer = await sharp(outputBuffer, { failOn: 'none' })
        .rotate()
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer()
      contentType = 'image/webp'
      outputExt = '.webp'
    }

    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}${outputExt}`

    const useSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    const url = useSupabase
      ? await uploadToSupabase(outputBuffer, folder, name, contentType)
      : await uploadToLocal(outputBuffer, folder, name)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
