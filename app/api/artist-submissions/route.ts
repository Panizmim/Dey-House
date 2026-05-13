import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, city, phone, email, website, instagram, artField } = body

    if (!firstName || !lastName || !phone || !email || !artField) {
      return NextResponse.json({ error: 'فیلدهای اجباری پر نشده‌اند' }, { status: 400 })
    }

    await db.artistSubmission.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        artField,
        bio: [city, website, instagram].filter(Boolean).join(' | ') || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
