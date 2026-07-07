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
    const { name, description, capacity, pricePerHour, imageUrl, isActive } = body
    const studio = await db.studio.update({
      where: { id: params.id },
      data: {
        name,
        description:  description || null,
        capacity:     Number(capacity),
        pricePerHour: Number(pricePerHour),
        imageUrl:     imageUrl || null,
        ...(isActive !== undefined && { isActive: !!isActive }),
      },
    })
    return NextResponse.json(studio)
  } catch {
    return NextResponse.json({ error: 'خطا در ویرایش پلاتو' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    await db.studio.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'خطا در حذف پلاتو — احتمالاً دارای رزرو است' }, { status: 500 })
  }
}
