import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return false
  return true
}

function slugify(name: string) {
  return name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9؀-ۿ-]/g, '')
}

async function uniqueSlug(name: string, studioId: string) {
  const base = slugify(name)
  let slug = base
  let i = 2
  while (await db.studio.findFirst({ where: { slug, NOT: { id: studioId } } })) {
    slug = `${base}-${i}`
    i++
  }
  return slug
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const body = await req.json()
    const { name, description, capacity, pricePerHour, images, isActive } = body

    const current = await db.studio.findUnique({ where: { id: params.id }, select: { name: true } })
    if (!current) return NextResponse.json({ error: 'پلاتو یافت نشد' }, { status: 404 })

    const slug = name !== current.name ? await uniqueSlug(name, params.id) : undefined

    const studio = await db.studio.update({
      where: { id: params.id },
      data: {
        name,
        ...(slug && { slug }),
        description:  description || null,
        capacity:     Number(capacity),
        pricePerHour: Number(pricePerHour),
        images:       Array.isArray(images) ? images.slice(0, 5) : [],
        ...(isActive !== undefined && { isActive: !!isActive }),
      },
    })
    return NextResponse.json(studio)
  } catch {
    return NextResponse.json({ error: 'خطا در ویرایش پلاتو' }, { status: 500 })
  }
}
