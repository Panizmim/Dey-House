import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { notifyAdmins } from '@/lib/notify'

export const dynamic = 'force-dynamic'

async function checkAdmin() {
  const session = await auth()
  return !!(session && session.user.role === 'ADMIN')
}

type TargetInput = {
  channel:  string
  value:    string
  label?:   string
  isActive?: boolean
}

/** ارقام فارسی/عربی را به لاتین تبدیل می‌کند */
function toEnDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const targets = await db.adminNotifyTarget.findMany({ orderBy: [{ channel: 'asc' }, { order: 'asc' }] })

  return NextResponse.json({
    targets,
    // آیا کلیدهای سرویس روی سرور تنظیم شده‌اند؟ (خود کلید هرگز برنمی‌گردد)
    smsReady:   Boolean(process.env.KAVENEGAR_API_KEY),
    emailReady: Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL_FROM),
  })
}

export async function PUT(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  try {
    const body = await req.json()
    const input: TargetInput[] = Array.isArray(body?.targets) ? body.targets : []

    const cleaned = input
      .map((t) => ({
        channel:  t.channel === 'EMAIL' ? 'EMAIL' : 'SMS',
        value:    t.channel === 'EMAIL'
          ? String(t.value ?? '').trim().toLowerCase()
          : toEnDigits(String(t.value ?? '')).replace(/[^\d]/g, ''),
        label:    String(t.label ?? '').trim(),
        isActive: t.isActive !== false,
      }))
      .filter((t) => t.value !== '')

    for (const target of cleaned) {
      if (target.channel === 'SMS' && !/^0\d{10}$/.test(target.value)) {
        return NextResponse.json(
          { error: `شماره «${target.value}» معتبر نیست — باید ۱۱ رقم و با ۰ شروع شود` },
          { status: 400 },
        )
      }
      if (target.channel === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target.value)) {
        return NextResponse.json({ error: `ایمیل «${target.value}» معتبر نیست` }, { status: 400 })
      }
    }

    // تکراری‌ها را حذف کن (کلید یکتا channel + value است)
    const unique = cleaned.filter(
      (t, i) => cleaned.findIndex((o) => o.channel === t.channel && o.value === t.value) === i,
    )

    await db.$transaction([
      db.adminNotifyTarget.deleteMany({
        where: { NOT: unique.map((t) => ({ channel: t.channel, value: t.value })) },
      }),
      ...unique.map((t, index) =>
        db.adminNotifyTarget.upsert({
          where:  { channel_value: { channel: t.channel, value: t.value } },
          update: { label: t.label, isActive: t.isActive, order: index },
          create: { ...t, order: index },
        }),
      ),
    ])

    const targets = await db.adminNotifyTarget.findMany({ orderBy: [{ channel: 'asc' }, { order: 'asc' }] })
    return NextResponse.json({ targets })
  } catch (error) {
    console.error('AdminNotifyTarget update error:', error)
    return NextResponse.json({ error: 'خطا در ذخیره مقصدها' }, { status: 500 })
  }
}

/** ارسال پیام آزمایشی به همه مقصدهای فعال */
export async function POST() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const active = await db.adminNotifyTarget.count({ where: { isActive: true } })
  if (active === 0) {
    return NextResponse.json({ error: 'هیچ مقصد فعالی ثبت نشده است' }, { status: 400 })
  }

  await notifyAdmins({
    title: 'پیام آزمایشی',
    rows: [
      ['وضعیت', 'اطلاع‌رسانی رزرو فعال است'],
      ['زمان',  new Date().toLocaleString('fa-IR')],
    ],
  })

  return NextResponse.json({ success: true, message: 'پیام آزمایشی ارسال شد — صندوق پیام را بررسی کنید' })
}
