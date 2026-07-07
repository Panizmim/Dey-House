import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
const MAX_SIZE = 8 * 1024 * 1024

async function uploadToSupabase(buffer: Buffer, folder: string, filename: string, contentType: string): Promise<string> {
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

async function uploadToLocal(buffer: Buffer, folder: string, filename: string): Promise<string> {
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

    if (!file)                      return NextResponse.json({ error: 'فایلی انتخاب نشده' },       { status: 400 })
    if (file.size > MAX_SIZE)       return NextResponse.json({ error: 'حجم فایل بیش از ۸MB است' }, { status: 400 })
    if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'فرمت فایل مجاز نیست' },   { status: 400 })

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext    = file.name.split('.').pop() ?? 'bin'
    const name   = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`

    const useSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    const url = useSupabase
      ? await uploadToSupabase(buffer, folder, name, file.type)
      : await uploadToLocal(buffer, folder, name)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
