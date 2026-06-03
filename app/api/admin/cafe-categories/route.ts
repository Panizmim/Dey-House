import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  return !!(session && session.user.role === 'ADMIN')
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const cats = await db.cafeCategory.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(cats)
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const { name } = await req.json()
    if (!name?.trim()) return NextResponse.json({ error: 'نام الزامی است' }, { status: 400 })
    const maxOrder = await db.cafeCategory.aggregate({ _max: { order: true } })
    const cat = await db.cafeCategory.create({
      data: { name: name.trim(), order: (maxOrder._max.order ?? 0) + 1 },
    })
    return NextResponse.json(cat)
  } catch {
    return NextResponse.json({ error: 'این دسته‌بندی قبلاً وجود دارد' }, { status: 409 })
  }
}
