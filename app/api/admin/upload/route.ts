import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import sharp from 'sharp'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file   = formData.get('file') as File
  const folder = (formData.get('folder') as string) || 'uploads'

  if (!file) {
    return NextResponse.json({ error: 'فایلی انتخاب نشده' }, { status: 400 })
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'فقط فایل‌های JPG، PNG و WebP مجاز هستند' },
      { status: 400 }
    )
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'حجم فایل نباید بیشتر از ۲۰MB باشد' },
      { status: 400 }
    )
  }

  try {
    const bytes       = await file.arrayBuffer()
    const inputBuffer = Buffer.from(bytes)

    const optimizedBuffer = await sharp(inputBuffer)
      .resize({
        width:            1920,
        height:           1920,
        fit:              'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer()

    const filename  = `${Date.now()}.webp`
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), optimizedBuffer)

    const originalKB  = Math.round(file.size / 1024)
    const optimizedKB = Math.round(optimizedBuffer.length / 1024)
    const savings     = Math.round((1 - optimizedBuffer.length / file.size) * 100)

    console.log(`Image optimized: ${originalKB}KB → ${optimizedKB}KB (${savings}% saved)`)

    return NextResponse.json({
      success: true,
      url: `/uploads/${folder}/${filename}`,
      meta: { originalSize: originalKB, optimizedSize: optimizedKB, savings: `${savings}%` },
    })
  } catch (error) {
    console.error('Image optimization error:', error)
    return NextResponse.json({ error: 'خطا در پردازش تصویر' }, { status: 500 })
  }
}
