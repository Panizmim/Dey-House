import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import sharp from 'sharp'

// ── Supabase Storage upload (برای محیط production / Vercel) ──
async function uploadToSupabase(buffer: Buffer, folder: string, filename: string): Promise<string> {
  const supabaseUrl = process.env.SUPABASE_URL!
  const anonKey     = process.env.SUPABASE_ANON_KEY!
  const path        = `${folder}/${filename}`

  const res = await fetch(`${supabaseUrl}/storage/v1/object/uploads/${path}`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${anonKey}`,
      'Content-Type': 'image/webp',
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

// ── Local filesystem upload (برای محیط development) ──
async function uploadToLocal(buffer: Buffer, folder: string, filename: string): Promise<string> {
  const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, filename), buffer)
  return `/uploads/${folder}/${filename}`
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file     = formData.get('file') as File
  const folder   = (formData.get('folder') as string) || 'uploads'

  if (!file) {
    return NextResponse.json({ error: 'فایلی انتخاب نشده' }, { status: 400 })
  }

  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.heics', '.avif']
  const ext = '.' + file.name.toLowerCase().split('.').pop()
  const isImage = file.type.startsWith('image/') || file.type === '' || file.type === 'application/octet-stream'
  if (!isImage || !allowedExts.includes(ext)) {
    return NextResponse.json({ error: 'فقط فایل‌های JPG، PNG، WebP و HEIC مجاز هستند' }, { status: 400 })
  }

  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'حجم فایل نباید بیشتر از ۵۰MB باشد' }, { status: 400 })
  }

  try {
    const bytes       = await file.arrayBuffer()
    const inputBuffer = Buffer.from(bytes)

    const optimizedBuffer = await sharp(inputBuffer, { failOn: 'none' })
      .rotate()
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer()

    const filename = `${Date.now()}.webp`

    // اگر SUPABASE_SERVICE_ROLE_KEY تنظیم شده باشد (production) از Supabase Storage استفاده کن
    // در غیر این صورت (development) روی filesystem محلی ذخیره کن
    const useSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    const url = useSupabase
      ? await uploadToSupabase(optimizedBuffer, folder, filename)
      : await uploadToLocal(optimizedBuffer, folder, filename)

    const originalKB  = Math.round(file.size / 1024)
    const optimizedKB = Math.round(optimizedBuffer.length / 1024)
    const savings     = Math.round((1 - optimizedBuffer.length / file.size) * 100)

    console.log(`Image uploaded [${useSupabase ? 'supabase' : 'local'}]: ${originalKB}KB → ${optimizedKB}KB (${savings}% saved) → ${url}`)

    return NextResponse.json({
      success: true,
      url,
      meta: { originalSize: originalKB, optimizedSize: optimizedKB, savings: `${savings}%` },
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ error: 'خطا در پردازش یا آپلود تصویر' }, { status: 500 })
  }
}
