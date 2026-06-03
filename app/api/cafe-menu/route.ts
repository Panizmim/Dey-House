import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const items = await db.cafeMenuItem.findMany({
      where:   { isAvailable: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
