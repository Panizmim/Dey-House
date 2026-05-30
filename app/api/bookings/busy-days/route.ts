import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { fromJalali, daysInJalaliMonth, toJalali } from '@/lib/jalali'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const studioId = searchParams.get('studioId')
  const jYear    = parseInt(searchParams.get('year')  ?? '')
  const jMonth   = parseInt(searchParams.get('month') ?? '')

  if (!studioId || isNaN(jYear) || isNaN(jMonth)) {
    return NextResponse.json({ error: 'پارامترهای ناقص' }, { status: 400 })
  }

  try {
    const firstDay  = fromJalali(jYear, jMonth, 1)
    const daysCount = daysInJalaliMonth(jYear, jMonth)
    const lastDay   = fromJalali(jYear, jMonth, daysCount)

    const startOfMonth = new Date(firstDay)
    startOfMonth.setHours(0, 0, 0, 0)
    const endOfMonth = new Date(lastDay)
    endOfMonth.setHours(23, 59, 59, 999)

    const bookings = await db.booking.findMany({
      where: {
        studioId,
        date:   { gte: startOfMonth, lte: endOfMonth },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      select: { date: true },
    })

    const busyDays = new Set<number>()
    for (const booking of bookings) {
      const j = toJalali(booking.date)
      if (j.jy === jYear && j.jm === jMonth) {
        busyDays.add(j.jd)
      }
    }

    return NextResponse.json({ busyDays: Array.from(busyDays) })
  } catch {
    return NextResponse.json({ error: 'خطا در دریافت اطلاعات' }, { status: 500 })
  }
}
