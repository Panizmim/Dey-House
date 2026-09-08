import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { notifyAdmins } from '@/lib/notify'

const contactSchema = z.object({
  name:      z.string().min(1),
  email:     z.string().optional().default(''),
  phone:     z.string().optional().default(''),
  usageType: z.string(),
  message:   z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'اطلاعات وارد شده معتبر نیست' }, { status: 400 })
    }

    const request = await db.contactRequest.create({ data: parsed.data })

    await notifyAdmins({
      title: 'درخواست رزرو جدید',
      rows: [
        ['نام',      request.name],
        ['موبایل',   request.phone || '—'],
        ['ایمیل',    request.email || '—'],
        ['نوع',      request.usageType],
        ['توضیحات',  request.message?.slice(0, 120) || '—'],
      ],
      adminPath: '/admin/contact-requests',
    })

    return NextResponse.json({
      success: true,
      message: 'درخواست شما ثبت شد. تیم خانه دی با شما تماس خواهد گرفت.',
    })
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
