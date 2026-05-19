import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(1),
  lastName:  z.string().min(1),
  phone:     z.string().min(1),
  email:     z.string().email(),
  artField:  z.string().min(1),
  instagram: z.string().optional(),
  website:   z.string().optional(),
  bio:       z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'اطلاعات ناقص است' }, { status: 400 })
    }

    const { firstName, lastName, phone, email, artField, bio } = parsed.data

    await db.artistSubmission.create({
      data: {
        name:        `${firstName} ${lastName}`,
        email,
        phone,
        artField,
        bio:         bio || null,
        artworkUrls: '[]',
        resumeUrl:   null,
        status:      'PENDING',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Artist submission error:', error)
    return NextResponse.json({ error: 'خطا در ثبت درخواست' }, { status: 500 })
  }
}
