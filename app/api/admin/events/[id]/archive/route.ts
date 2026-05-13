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
    const current = await db.event.findUnique({ where: { id: params.id }, select: { isArchived: true } })
    if (!current) return NextResponse.json({ error: 'رویداد یافت نشد' }, { status: 404 })
    const event = await db.event.update({
      where: { id: params.id },
      data: { isArchived: !current.isArchived },
    })
    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'خطا در آرشیو رویداد' }, { status: 500 })
  }
}
