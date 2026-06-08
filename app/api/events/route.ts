import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const typeGradients: Record<string, string> = {
  'نمایشگاه': 'linear-gradient(135deg, #1a3a2a, #2d5a3a)',
  'تئاتر':    'linear-gradient(135deg, #1a0a2a, #2d1a4a)',
  'ادبی':     'linear-gradient(135deg, #0a1a2a, #1a2d4a)',
  'ورکشاپ':   'linear-gradient(135deg, #2a1a0a, #4a2d1a)',
  'موسیقی':   'linear-gradient(135deg, #2a2a0a, #4a4a1a)',
}

function formatPersianDate(date: Date) {
  return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function GET() {
  try {
    const events = await db.event.findMany({
      where:   { isArchived: false },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(
      events.map((e) => ({
        id:          e.id,
        slug:        e.slug,
        title:       e.title,
        type:        e.type,
        date:        formatPersianDate(new Date(e.date)),
        time:        e.time,
        location:    e.location ?? '',
        description: e.description ?? '',
        isActive:    e.isActive,
        isFeatured:  e.isFeatured,
        imageUrl:    e.imageUrl ?? undefined,
        gradient:    typeGradients[e.type] ?? 'linear-gradient(135deg, #1a1a2a, #2d2d4a)',
        images:      [] as string[],
        imageGradients: [] as string[],
      }))
    )
  } catch {
    return NextResponse.json({ error: 'خطا در بارگذاری رویدادها' }, { status: 500 })
  }
}
