import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  fullName:     z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  phone:        z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست'),
  email:        z.string().email('ایمیل معتبر نیست'),
  website:      z.string().optional(),
  instagram:    z.string().optional(),
  artField:     z.string().min(1, 'رشته هنری را انتخاب کنید'),
  notes:        z.string().optional(),
  portfolioUrl: z.string().optional(),
  artworkItems: z.array(z.object({ url: z.string(), description: z.string() })).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'اطلاعات وارد شده معتبر نیست' }, { status: 400 })
    }

    const { fullName, phone, email, website, instagram, artField, notes, portfolioUrl, artworkItems } = parsed.data

    const bio = [website, instagram].filter(Boolean).join(' | ') || null

    await db.artistSubmission.create({
      data: {
        name:        fullName,
        email,
        phone,
        artField,
        bio,
        notes:       notes || null,
        artworkUrls: JSON.stringify(artworkItems ?? []),
        resumeUrl:   portfolioUrl || null,
        status:      'PENDING',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Artist submission error:', error)
    return NextResponse.json({ error: 'خطا در ثبت درخواست' }, { status: 500 })
  }
}
