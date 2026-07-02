import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  return !!(session && session.user.role === 'ADMIN')
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const banners = await db.heroBanner.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json(banners)
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const { imageUrl, mobileImageUrl, showText, order } = await req.json()
    const banner = await db.heroBanner.create({
      data: {
        imageUrl,
        mobileImageUrl: mobileImageUrl ?? null,
        showText: showText ?? true,
        order:    order    ?? 0,
      },
    })
    revalidatePath('/')
    return NextResponse.json(banner)
  } catch (error) {
    console.error('HeroBanner create error:', error)
    return NextResponse.json({ error: 'خطا در ایجاد بنر' }, { status: 500 })
  }
}
