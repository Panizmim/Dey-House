import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getAllSitePhones } from '@/lib/site-phones.server'
import { type SitePhone } from '@/lib/site-phones'

export const dynamic = 'force-dynamic'

async function checkAdmin() {
  const session = await auth()
  return !!(session && session.user.role === 'ADMIN')
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  return NextResponse.json(await getAllSitePhones())
}

export async function PUT(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  try {
    const body = await req.json()
    const phones: SitePhone[] = Array.isArray(body?.phones) ? body.phones : []

    if (phones.length === 0) {
      return NextResponse.json({ error: 'حداقل یک شماره لازم است' }, { status: 400 })
    }

    for (const phone of phones) {
      const number = String(phone.number ?? '').trim()
      const label  = String(phone.label  ?? '').trim()
      if (!label) {
        return NextResponse.json({ error: 'عنوان شماره نمی‌تواند خالی باشد' }, { status: 400 })
      }
      if (number && !/^0\d{10}$/.test(number)) {
        return NextResponse.json(
          { error: `شماره «${label}» معتبر نیست — باید ۱۱ رقم و با ۰ شروع شود` },
          { status: 400 },
        )
      }
    }

    await db.$transaction(
      phones.map((phone, index) => {
        const data = {
          label:     String(phone.label).trim(),
          number:    String(phone.number ?? '').trim(),
          isVisible: phone.isVisible !== false,
          order:     index,
        }
        return db.sitePhone.upsert({
          where:  { key: String(phone.key) },
          update: data,
          create: { key: String(phone.key), ...data },
        })
      }),
    )

    // فوتر (لِی‌اوت سایت) و صفحه تماس باید دوباره ساخته شوند
    revalidatePath('/', 'layout')
    revalidatePath('/contact')

    return NextResponse.json(await getAllSitePhones())
  } catch (error) {
    console.error('SitePhone update error:', error)
    return NextResponse.json({ error: 'خطا در ذخیره شماره‌ها' }, { status: 500 })
  }
}
