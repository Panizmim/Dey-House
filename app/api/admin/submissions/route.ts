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
  const status = searchParams.get('status')

  const where = status ? { status } : {}
  const submissions = await db.artistSubmission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(submissions)
}
