import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return false
  return true
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const { role } = await req.json()
    if (!['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'نقش نامعتبر' }, { status: 400 })
    }
    const user = await db.user.update({
      where: { id: params.id },
      data: { role },
    })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'خطا در تغییر نقش' }, { status: 500 })
  }
}
