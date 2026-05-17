import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createPayment } from '@/lib/zarinpal'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'ابتدا وارد حساب خود شوید' }, { status: 401 })
    }

    const { studioId, date, startTime, endTime, durationHours, type, notes } = await req.json()

    if (!studioId || !date || !startTime || !endTime || !durationHours || !type) {
      return NextResponse.json({ error: 'اطلاعات ناقص است' }, { status: 400 })
    }

    const studio = await db.studio.findUnique({ where: { id: studioId } })
    if (!studio || !studio.isActive) {
      return NextResponse.json({ error: 'پلاتو یافت نشد' }, { status: 404 })
    }

    const totalPrice = Math.round(studio.pricePerHour * durationHours)

    const booking = await db.booking.create({
      data: {
        userId:       session.user.id,
        studioId,
        date:         new Date(date),
        startTime,
        endTime,
        durationHours,
        type,
        totalPrice,
        status:       'PENDING',
        paymentStatus: 'UNPAID',
        notes:        notes ?? null,
      },
    })

    const baseUrl    = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const callbackUrl = `${baseUrl}/api/payment/verify?bookingId=${booking.id}`

    const description = `رزرو ${studio.name} — ${startTime} تا ${endTime}`
    const result = await createPayment(totalPrice, description, callbackUrl)

    if (!result.success || !result.authority) {
      await db.booking.delete({ where: { id: booking.id } })
      return NextResponse.json({ error: 'خطا در اتصال به درگاه پرداخت' }, { status: 502 })
    }

    await db.booking.update({
      where: { id: booking.id },
      data:  { authority: result.authority },
    })

    return NextResponse.json({ paymentUrl: result.paymentUrl })
  } catch (err) {
    console.error('payment/request error:', err)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
