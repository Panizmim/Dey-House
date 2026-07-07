import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import sharp from 'sharp'

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

async function uploadToLocal(buffer: Buffer, folder: string, filename: string): Promise<string> {
  const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, filename), buffer)
  return `/uploads/${folder}/${filename}`
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'فایلی انتخاب نشده' }, { status: 400 })
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'فقط فایل‌های JPG، PNG و WebP مجاز هستند' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'حجم فایل نباید بیشتر از ۵MB باشد' }, { status: 400 })
  }

  try {
    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const optimized = await sharp(buffer)
      .resize({ width: 400, height: 400, fit: 'cover', position: 'centre' })
      .webp({ quality: 85 })
      .toBuffer()

    const filename = `avatar-${session.user.id}-${Date.now()}.webp`

    const useSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    const url = useSupabase
      ? await uploadToSupabase(optimized, 'avatars', filename)
      : await uploadToLocal(optimized, 'avatars', filename)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: 'خطا در آپلود تصویر' }, { status: 500 })
  }
}
