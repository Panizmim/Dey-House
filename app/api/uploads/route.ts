import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
const MAX_SIZE = 8 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file   = formData.get('file')   as File
    const folder = (formData.get('folder') as string) || 'submissions'

    if (!file)                      return NextResponse.json({ error: 'فایلی انتخاب نشده' },       { status: 400 })
    if (file.size > MAX_SIZE)       return NextResponse.json({ error: 'حجم فایل بیش از ۸MB است' }, { status: 400 })
    if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'فرمت فایل مجاز نیست' },   { status: 400 })

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext    = file.name.split('.').pop() ?? 'bin'
    const name   = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`

    const dir = join(process.cwd(), 'public', 'uploads', folder)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, name), buffer)

    return NextResponse.json({ url: `/uploads/${folder}/${name}` })
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
