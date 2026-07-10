import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

const SECTIONS = ['users', 'bookings'] as const

async function checkAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET() {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const seenRows = await db.adminSeen.findMany({
    where: { userId: session.user.id, section: { in: [...SECTIONS] } },
  })
  const seenMap = new Map(seenRows.map((r) => [r.section, r.seenAt]))

  // اولین بار — پایه رو «همین الان» ثبت می‌کنیم تا چیزهای قبلی جدید حساب نشن
  const missingSections = SECTIONS.filter((s) => !seenMap.has(s))
  if (missingSections.length > 0) {
    const now = new Date()
    await db.adminSeen.createMany({
      data: missingSections.map((section) => ({ userId: session.user.id, section, seenAt: now })),
      skipDuplicates: true,
    })
    missingSections.forEach((s) => seenMap.set(s, now))
  }

  const [users, bookings] = await Promise.all([
    db.user.count({ where: { createdAt: { gt: seenMap.get('users') } } }),
    db.booking.count({ where: { createdAt: { gt: seenMap.get('bookings') } } }),
  ])

  return NextResponse.json({ users, bookings })
}
