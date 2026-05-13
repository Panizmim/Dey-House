import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'احراز هویت لازم است' }, { status: 401 })
  }

  try {
    const bookings = await db.booking.findMany({
      where:   { userId: session.user.id },
      include: { studio: { select: { name: true, imageUrl: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'خطا در دریافت رزروها' }, { status: 500 })
  }
}
