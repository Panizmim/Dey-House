import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const galleries = await db.gallery.findMany({
      where:   { isActive: true },
      orderBy: { startDate: 'desc' },
    })
    return NextResponse.json(galleries)
  } catch (error) {
    console.error('Galleries error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
