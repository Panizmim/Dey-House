import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return false
  return true
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const body = await req.json()
    const { title, type, date, time, location, description, isFeatured } = body
    const event = await db.event.update({
      where: { id: params.id },
      data: {
        title, type, time,
        location: location || null,
        description: description || null,
        isFeatured: !!isFeatured,
        date: new Date(date),
      },
    })
    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'خطا در ویرایش رویداد' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    await db.event.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'خطا در حذف رویداد' }, { status: 500 })
  }
}
