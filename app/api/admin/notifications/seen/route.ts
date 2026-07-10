import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

const SECTIONS = ['users', 'bookings']

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const { section } = await req.json()
  if (!SECTIONS.includes(section)) return NextResponse.json({ error: 'بخش نامعتبر' }, { status: 400 })

  await db.adminSeen.upsert({
    where: { userId_section: { userId: session.user.id, section } },
    update: { seenAt: new Date() },
    create: { userId: session.user.id, section, seenAt: new Date() },
  })

  return NextResponse.json({ ok: true })
}
