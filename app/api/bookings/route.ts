import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createPayment } from '@/lib/zarinpal'

const bookingSchema = z.object({
  studioId:     z.string(),
  date:         z.string(),
  startTime:    z.string(),
  endTime:      z.string(),
  durationHours: z.number().positive(),
  type:         z.enum(['THEATER', 'OTHER']),
  notes:        z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'برای رزرو باید وارد شوید' }, { status: 401 })
  }

  try {
    const body   = await req.json()
    const parsed = bookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'اطلاعات وارد شده معتبر نیست' }, { status: 400 })
    }

    const { studioId, date, startTime, endTime, durationHours, type, notes } = parsed.data

    const studio = await db.studio.findUnique({ where: { id: studioId } })
    if (!studio) {
      return NextResponse.json({ error: 'پلاتو یافت نشد' }, { status: 404 })
    }

    const startOfDay = new Date(date + 'T00:00:00.000Z')
    const endOfDay   = new Date(date + 'T23:59:59.999Z')

    const conflict = await db.booking.findFirst({
      where: {
        studioId,
        startTime,
        date:   { gte: startOfDay, lte: endOfDay },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
    })

    if (conflict) {
      return NextResponse.json({ error: 'این زمان قبلاً رزرو شده است' }, { status: 409 })
    }

    const totalPrice = Math.round(studio.pricePerHour * durationHours)

    const booking = await db.booking.create({
      data: {
        userId: session.user.id,
        studioId,
        date:   new Date(date + 'T00:00:00.000Z'),
        startTime,
        endTime,
        durationHours,
        type,
        status: 'PENDING',
        totalPrice,
        paymentStatus: 'UNPAID',
        notes,
      },
    })

    if (type === 'THEATER') {
      const callbackUrl = `${process.env.NEXTAUTH_URL}/booking/confirmation?bookingId=${booking.id}`
      const payment = await createPayment(
        totalPrice,
        `رزرو ${studio.name} — ${date}`,
        callbackUrl
      )

      if (!payment.success) {
        await db.booking.delete({ where: { id: booking.id } })
        return NextResponse.json({ error: 'خطا در اتصال به درگاه پرداخت' }, { status: 502 })
      }

      await db.booking.update({
        where: { id: booking.id },
        data:  { zarinpalRef: payment.authority },
      })

      return NextResponse.json({ bookingId: booking.id, paymentUrl: payment.paymentUrl })
    }

    return NextResponse.json({ bookingId: booking.id, paymentUrl: null })
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
