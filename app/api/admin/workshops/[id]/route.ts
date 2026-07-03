import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return false
  return true
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const body = await req.json()
    const { title, date, description, imageUrl, isActive } = body
    const workshop = await db.workshop.update({
      where: { id: params.id },
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
    console.error('[PATCH /api/admin/workshops/:id]', e)
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'خطا در ویرایش ورکشاپ', detail: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    await db.workshop.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[DELETE /api/admin/workshops/:id]', e)
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'خطا در حذف ورکشاپ', detail: msg }, { status: 500 })
  }
}
