import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { searchParams } = new URL(req.url)
  const status   = searchParams.get('status')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo   = searchParams.get('dateTo')

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (dateFrom || dateTo) {
    where.date = {}
    if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom)
    if (dateTo)   (where.date as Record<string, unknown>).lte = new Date(dateTo)
  }

  const bookings = await db.booking.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      user:   { select: { name: true, email: true } },
      studio: { select: { name: true } },
    },
  })
  return NextResponse.json(bookings)
}

// رزرو مستقیم توسط ادمین — بدون پرداخت
export async function POST(req: NextRequest) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const body = await req.json()
    const { studioId, date, startTime, endTime, type, notes, userId } = body

    if (!studioId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'پارامترهای ناقص' }, { status: 400 })
    }

    // محاسبه مدت زمان
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const durationHours = (eh * 60 + em - sh * 60 - sm) / 60
    if (durationHours <= 0) {
      return NextResponse.json({ error: 'ساعت پایان باید بعد از ساعت شروع باشد' }, { status: 400 })
    }

    // بررسی تداخل با رزروهای موجود
    const bookingDate  = new Date(date + 'T00:00:00.000Z')
    const endOfDay     = new Date(date + 'T23:59:59.999Z')
    const conflicting  = await db.booking.findFirst({
      where: {
        studioId,
        date:      { gte: bookingDate, lte: endOfDay },
        startTime,
        status:    { in: ['CONFIRMED', 'PENDING'] },
      },
    })
    if (conflicting) {
      return NextResponse.json({ error: 'این زمان قبلاً رزرو شده است' }, { status: 409 })
    }

    // استفاده از userId مشخص‌شده یا ادمین خودش
    const bookingUserId = userId || session.user.id

    const booking = await db.booking.create({
      data: {
        userId:        bookingUserId,
        studioId,
        date:          bookingDate,
        startTime,
        endTime,
        durationHours,
        type:          type || 'theater',
        status:        'CONFIRMED',
        paymentStatus: 'PAID',
        totalPrice:    0,
        notes:         notes || 'رزرو توسط ادمین',
      },
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Admin booking error:', error)
    return NextResponse.json({ error: 'خطا در ثبت رزرو' }, { status: 500 })
  }
}
