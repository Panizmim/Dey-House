import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return false
  return true
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
