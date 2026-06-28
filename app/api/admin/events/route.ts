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
  const events = await db.event.findMany({ orderBy: { date: 'desc' } })
  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const body = await req.json()
    const { title, type, date, endDate, time, location, description, imageUrl, isFeatured, isActive, isArchived, galleryImages } = body
    const event = await db.event.create({
      data: {
        title, type, time,
        location:      location || null,
        description:   description || null,
        imageUrl:      imageUrl || null,
        isFeatured:    !!isFeatured,
        isActive:      isActive !== false,
        isArchived:    !!isArchived,
        galleryImages: JSON.stringify(Array.isArray(galleryImages) ? galleryImages : []),
        slug:          slugify(title),
        date:          new Date(date),
        endDate:       endDate ? new Date(endDate) : null,
      },
    })
    return NextResponse.json(event)
  } catch (e) {
    console.error('[POST /api/admin/events]', e)
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'خطا در ایجاد رویداد', detail: msg }, { status: 500 })
  }
}
