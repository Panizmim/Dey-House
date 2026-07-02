import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cats = await db.cafeCategory.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(cats)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
