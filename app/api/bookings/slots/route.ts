import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ALL_SLOTS = [
  '09:00','10:00','11:00','12:00',
  '14:00','15:00','16:00','17:00','18:00','19:00','20:00',
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const studioId = searchParams.get('studioId')
  const date     = searchParams.get('date')

  if (!studioId || !date) {
    return NextResponse.json({ error: 'پارامترهای ناقص' }, { status: 400 })
  }

  try {
    const startOfDay = new Date(date + 'T00:00:00.000Z')
    const endOfDay   = new Date(date + 'T23:59:59.999Z')

    const bookings = await db.booking.findMany({
      where: {
        studioId,
        date:   { gte: startOfDay, lte: endOfDay },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
    })

    const bookedTimes = new Set(bookings.map((b) => b.startTime))
    const slots = ALL_SLOTS.map((time) => ({
      time,
      available: !bookedTimes.has(time),
    }))

    return NextResponse.json({ slots })
  } catch {
    return NextResponse.json({ error: 'خطا در دریافت زمان‌ها' }, { status: 500 })
  }
}
