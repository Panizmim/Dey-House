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
    const current = await db.cafeMenuItem.findUnique({ where: { id: params.id }, select: { isAvailable: true } })
    if (!current) return NextResponse.json({ error: 'آیتم یافت نشد' }, { status: 404 })
    const item = await db.cafeMenuItem.update({
      where: { id: params.id },
      data: { isAvailable: !current.isAvailable },
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'خطا در تغییر وضعیت' }, { status: 500 })
  }
}
