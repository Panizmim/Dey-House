import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name:     z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  email:    z.string().email('ایمیل معتبر وارد کنید'),
  phone:    z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر وارد کنید'),
  password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => e.message).join('، ')
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const { name, email, phone, password } = parsed.data

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'این ایمیل قبلاً ثبت شده است' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: { name, email, phone, password: hashedPassword, role: 'USER' },
    })

    return NextResponse.json(
      { success: true, message: 'حساب با موفقیت ساخته شد', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'خطای سرور. لطفاً دوباره تلاش کنید' }, { status: 500 })
  }
}
