import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return false
  return true
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const workshops = await db.workshop.findMany({ orderBy: { date: 'desc' } })
  return NextResponse.json(workshops)
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const body = await req.json()
    const { title, date, description, imageUrl, isActive } = body
    const workshop = await db.workshop.create({
      data: {
        title,
        date:        new Date(date),
        description: description || null,
        imageUrl:    imageUrl || null,
        isActive:    isActive !== false,
      },
    })
    return NextResponse.json(workshop)
  } catch (e) {
    console.error('[POST /api/admin/workshops]', e)
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'خطا در ایجاد ورکشاپ', detail: msg }, { status: 500 })
  }
}
