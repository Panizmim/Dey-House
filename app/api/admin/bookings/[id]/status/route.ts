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
    const { status } = await req.json()
    const booking = await db.booking.update({
      where: { id: params.id },
      data: { status },
    })
    return NextResponse.json(booking)
  } catch {
    return NextResponse.json({ error: 'خطا در تغییر وضعیت رزرو' }, { status: 500 })
  }
}
