import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  return !!(session && session.user.role === 'ADMIN')
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const { orders } = await req.json() as { orders: { id: string; order: number }[] }
    await Promise.all(orders.map(({ id, order }) =>
      db.cafeCategory.update({ where: { id }, data: { order } })
    ))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'خطا در ذخیره ترتیب' }, { status: 500 })
  }
}
