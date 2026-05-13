import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'احراز هویت لازم است' }, { status: 401 })
  }

  const { id } = await params

  try {
    const booking = await db.booking.findUnique({ where: { id } })

    if (!booking) {
      return NextResponse.json({ error: 'رزرو یافت نشد' }, { status: 404 })
    }

    if (booking.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 403 })
    }

    if (booking.status === 'CANCELLED') {
      return NextResponse.json({ error: 'رزرو قبلاً لغو شده است' }, { status: 400 })
    }

    await db.booking.update({
      where: { id },
      data:  { status: 'CANCELLED' },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
