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
    const { name, price, category, description, imageUrl, isAvailable } = body
    const item = await db.cafeMenuItem.update({
      where: { id: params.id },
      data: {
        name, price: Number(price), category,
        description: description || null,
        imageUrl: imageUrl || null,
        ...(isAvailable !== undefined && { isAvailable: !!isAvailable }),
      },
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'خطا در ویرایش آیتم' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    await db.cafeMenuItem.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'خطا در حذف آیتم' }, { status: 500 })
  }
}
