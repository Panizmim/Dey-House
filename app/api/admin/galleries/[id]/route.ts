import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') return false
  return true
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const body = await req.json()
    const { title, artistName, description, startDate, endDate, status, coverImage, isActive, images, venueImages } = body

    const gallery = await db.gallery.update({
      where: { id: params.id },
      data: {
        title,
        artistName,
        description: description || null,
        startDate:   new Date(startDate),
        endDate:     new Date(endDate),
        status:      status || 'UPCOMING',
        coverImage:  coverImage || null,
        isActive:    isActive !== undefined ? !!isActive : undefined,
        images:      images      !== undefined ? images      : undefined,
        venueImages: venueImages !== undefined ? venueImages : undefined,
      },
    })
    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Gallery update error:', error)
    return NextResponse.json({ error: 'خطا در ویرایش نمایشگاه' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    await db.gallery.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Gallery delete error:', error)
    return NextResponse.json({ error: 'خطا در حذف نمایشگاه' }, { status: 500 })
  }
}
