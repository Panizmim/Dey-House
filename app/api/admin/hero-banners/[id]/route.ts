import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  return !!(session && session.user.role === 'ADMIN')
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const body = await req.json()
    const banner = await db.heroBanner.update({
      where: { id: params.id },
      data: {
        showText: body.showText !== undefined ? body.showText : undefined,
        isActive: body.isActive !== undefined ? body.isActive : undefined,
        order:    body.order    !== undefined ? body.order    : undefined,
      },
    })
    return NextResponse.json(banner)
  } catch (error) {
    console.error('HeroBanner update error:', error)
    return NextResponse.json({ error: 'خطا در ویرایش بنر' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    await db.heroBanner.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('HeroBanner delete error:', error)
    return NextResponse.json({ error: 'خطا در حذف بنر' }, { status: 500 })
  }
}
