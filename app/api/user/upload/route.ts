import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import sharp from 'sharp'

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

    const filename  = `avatar-${session.user.id}-${Date.now()}.webp`
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), optimized)

    return NextResponse.json({ url: `/uploads/avatars/${filename}` })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: 'خطا در آپلود تصویر' }, { status: 500 })
  }
}
