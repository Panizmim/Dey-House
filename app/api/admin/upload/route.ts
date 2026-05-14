import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const folder = (formData.get('folder') as string) || 'uploads'

  if (!file) {
    return NextResponse.json({ error: 'فایلی انتخاب نشده' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'حجم فایل بیش از ۵MB است' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const timestamp = Date.now()
  const ext = file.name.split('.').pop()
  const filename = `${timestamp}.${ext}`

  const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, filename), buffer)

  return NextResponse.json({ success: true, url: `/uploads/${folder}/${filename}` })
}
