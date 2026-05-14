import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  name:            z.string().min(2).optional(),
  phone:           z.string().regex(/^09[0-9]{9}$/).optional(),
  currentPassword: z.string().optional(),
  newPassword:     z.string().min(8).optional(),
  image:           z.string().url().optional(),
})

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'داده‌های ورودی نامعتبر' }, { status: 400 })

  const { name, phone, currentPassword, newPassword, image } = parsed.data

  const updateData: Record<string, unknown> = {}
  if (name)  updateData.name  = name
  if (phone) updateData.phone = phone
  if (image) updateData.image = image

  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: 'رمز فعلی الزامی است' }, { status: 400 })
    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (!user?.password) return NextResponse.json({ error: 'خطا در تأیید هویت' }, { status: 400 })
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) return NextResponse.json({ error: 'رمز فعلی اشتباه است' }, { status: 400 })
    updateData.password = await bcrypt.hash(newPassword, 12)
  }

  await db.user.update({ where: { id: session.user.id }, data: updateData })

  return NextResponse.json({ ok: true })
}
