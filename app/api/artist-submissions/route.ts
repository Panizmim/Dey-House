import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      firstName, lastName, phone, email, website, instagram,
      artField, portfolioUrl, artworkItems,
    } = body

    if (!firstName || !lastName || !phone || !email || !artField) {
      return NextResponse.json({ error: 'فیلدهای اجباری پر نشده‌اند' }, { status: 400 })
    }

    const bio = [website, instagram].filter(Boolean).join(' | ') || null

    await db.artistSubmission.create({
      data: {
        name:        `${firstName} ${lastName}`,
        email,
        phone,
        artField,
        bio,
        resumeUrl:   portfolioUrl ?? null,
        artworkUrls: JSON.stringify(artworkItems ?? []),
        status:      'PENDING',
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
