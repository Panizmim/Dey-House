import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const gallery = await db.gallery.findUnique({ where: { slug: params.slug } })
    if (!gallery) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Gallery detail error:', error)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
