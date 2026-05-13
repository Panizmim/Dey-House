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
    const { isRead } = await req.json()
    const request = await db.contactRequest.update({
      where: { id: params.id },
      data: { isRead: !!isRead },
    })
    return NextResponse.json(request)
  } catch {
    return NextResponse.json({ error: 'خطا در بروزرسانی' }, { status: 500 })
  }
}
