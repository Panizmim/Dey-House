import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const booking = await db.booking.findUnique({
    where:   { id: params.id },
    include: { studio: true },
  })

  if (!booking)                          return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (booking.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  return NextResponse.json(booking)
}
