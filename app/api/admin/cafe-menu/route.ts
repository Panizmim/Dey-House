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
  const items = await db.cafeMenuItem.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const body = await req.json()
    const { name, price, category, description } = body
    const item = await db.cafeMenuItem.create({
      data: { name, price: Number(price), category, description: description || null, isAvailable: true },
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: 'خطا در ایجاد آیتم' }, { status: 500 })
  }
}
