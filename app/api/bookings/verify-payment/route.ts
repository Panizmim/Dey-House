import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { verifyPayment } from '@/lib/zarinpal'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'احراز هویت لازم است' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const bookingId  = searchParams.get('bookingId')
  const authority  = searchParams.get('Authority')
  const status     = searchParams.get('Status')

  if (!bookingId || !authority) {
    return NextResponse.json({ error: 'پارامترهای ناقص' }, { status: 400 })
  }

  try {
    const booking = await db.booking.findUnique({ where: { id: bookingId } })

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: 'رزرو یافت نشد' }, { status: 404 })
    }

    if (status !== 'OK') {
      await db.booking.update({
        where: { id: bookingId },
        data:  { status: 'CANCELLED' },
      })
      return NextResponse.json({ success: false, message: 'پرداخت لغو شد' })
    }

    const result = await verifyPayment(authority, booking.totalPrice)

    if (result.success) {
      await db.booking.update({
        where: { id: bookingId },
        data:  {
          status:        'CONFIRMED',
          paymentStatus: 'PAID',
          zarinpalRef:   String(result.refId ?? authority),
        },
      })
      return NextResponse.json({ success: true, refId: result.refId })
    }

    await db.booking.update({
      where: { id: bookingId },
      data:  { status: 'CANCELLED' },
    })
    return NextResponse.json({ success: false, message: 'تأیید پرداخت ناموفق بود' })
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
