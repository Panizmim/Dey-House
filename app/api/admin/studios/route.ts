import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return false
  return true
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const studios = await db.studio.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(studios)
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const body = await req.json()
    const { name, description, capacity, pricePerHour, imageUrl } = body
    const studio = await db.studio.create({
      data: {
        name,
        description:  description || null,
        capacity:     Number(capacity),
        pricePerHour: Number(pricePerHour),
        imageUrl:     imageUrl || null,
        isActive:     true,
      },
    })
    return NextResponse.json(studio)
  } catch {
    return NextResponse.json({ error: 'خطا در ایجاد پلاتو' }, { status: 500 })
  }
}
