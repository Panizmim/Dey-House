import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPayment } from '@/lib/zarinpal'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const authority  = searchParams.get('Authority')
  const status     = searchParams.get('Status')
  const bookingId  = searchParams.get('bookingId')

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  if (!bookingId || !authority) {
    return NextResponse.redirect(`${baseUrl}/payment/failure?reason=invalid`)
  }

  const booking = await db.booking.findUnique({
    where:   { id: bookingId },
    include: { studio: true },
  })

  if (!booking) {
    return NextResponse.redirect(`${baseUrl}/payment/failure?reason=not_found`)
  }

  if (status !== 'OK') {
    await db.booking.update({
      where: { id: bookingId },
      data:  { status: 'CANCELLED', paymentStatus: 'UNPAID' },
    })
    return NextResponse.redirect(`${baseUrl}/payment/failure?reason=cancelled&bookingId=${bookingId}`)
  }

  const result = await verifyPayment(authority, booking.totalPrice)

  if (!result.success) {
    await db.booking.update({
      where: { id: bookingId },
      data:  { status: 'CANCELLED', paymentStatus: 'UNPAID' },
    })
    return NextResponse.redirect(`${baseUrl}/payment/failure?reason=verify_failed&bookingId=${bookingId}`)
  }

  await db.booking.update({
    where: { id: bookingId },
    data: {
      status:       'CONFIRMED',
      paymentStatus: 'PAID',
      zarinpalRef:  String(result.refId ?? ''),
    },
  })

  const params = new URLSearchParams({
    refId:      String(result.refId ?? ''),
    bookingId,
    studioName: booking.studio.name,
    date:       booking.date.toLocaleDateString('fa-IR'),
    startTime:  booking.startTime,
    endTime:    booking.endTime,
    totalPrice: String(booking.totalPrice),
  })

  return NextResponse.redirect(`${baseUrl}/payment/success?${params}`)
}
