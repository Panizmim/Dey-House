import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  return !!(session && session.user.role === 'ADMIN')
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const { name } = await req.json()
    if (!name?.trim()) return NextResponse.json({ error: 'نام الزامی است' }, { status: 400 })
    const cat = await db.cafeCategory.update({
      where: { id: params.id },
      data:  { name: name.trim() },
    })
    return NextResponse.json(cat)
  } catch {
    return NextResponse.json({ error: 'خطا در ویرایش' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    await db.cafeCategory.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'خطا در حذف' }, { status: 500 })
  }
}
