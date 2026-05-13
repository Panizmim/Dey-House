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
    const { title, type, date, time, location, description, isFeatured } = body
    const event = await db.event.create({
      data: {
        title, type, time,
        location: location || null,
        description: description || null,
        isFeatured: !!isFeatured,
        slug: slugify(title),
        date: new Date(date),
      },
    })
    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'خطا در ایجاد رویداد' }, { status: 500 })
  }
}
