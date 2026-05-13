import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const studios = await db.studio.findMany({
      where:   { isActive: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(studios)
  } catch (error) {
    console.error('Studios error:', error)
    return NextResponse.json({ error: 'خطا در دریافت پلاتوها' }, { status: 500 })
  }
}
