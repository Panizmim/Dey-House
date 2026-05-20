import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return false
  return true
}

function slugify(title: string) {
  return title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9؀-ۿ-]/g, '') + '-' + Date.now()
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const galleries = await db.gallery.findMany({ orderBy: { startDate: 'desc' } })
  return NextResponse.json(galleries)
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const body = await req.json()
    const { title, artistName, description, startDate, endDate, status, coverImage } = body

    const gallery = await db.gallery.create({
      data: {
        title,
        artistName,
        slug:        slugify(title),
        description: description || null,
        startDate:   new Date(startDate),
        endDate:     new Date(endDate),
        status:      status || 'UPCOMING',
        coverImage:  coverImage || null,
      },
    })
    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Gallery create error:', error)
    return NextResponse.json({ error: 'خطا در ایجاد نمایشگاه' }, { status: 500 })
  }
}
