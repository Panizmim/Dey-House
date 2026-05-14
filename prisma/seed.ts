import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('Admin@1234', 12)
  await db.user.upsert({
    where:  { email: 'admin@deyhouse.ir' },
    update: { password: adminPassword },
    create: {
      name:     'مدیر سیستم',
      email:    'admin@deyhouse.ir',
      phone:    '09120000000',
      password: adminPassword,
      role:     'ADMIN',
    },
  })

  const studios = [
    {
      name:         'پلاتو آبی',
      description:  'فضای مناسب برای تمرین تئاتر و رقص — ۱۲۰ متر مربع با کف چوبی و آینه',
      capacity:     30,
      pricePerHour: 150000,
      isActive:     true,
    },
    {
      name:         'پلاتو قرمز',
      description:  'پلاتو اصلی خانه دی — ۱۸۰ متر مربع با تجهیزات نور و صدا',
      capacity:     60,
      pricePerHour: 250000,
      isActive:     true,
    },
  ]

  for (const studio of studios) {
    const existing = await db.studio.findFirst({ where: { name: studio.name } })
    if (!existing) {
      await db.studio.create({ data: studio })
    }
  }

  const menuItems: Prisma.CafeMenuItemCreateManyInput[] = [
      // نوشیدنی گرم بر پایه اسپرسو
      { name: 'اسپرسو',         price: 225000, category: 'نوشیدنی گرم بر پایه اسپرسو', order: 1, isAvailable: true },
      { name: 'آمریکانو',        price: 240000, category: 'نوشیدنی گرم بر پایه اسپرسو', order: 2, isAvailable: true },
      { name: 'لته',             price: 305000, category: 'نوشیدنی گرم بر پایه اسپرسو', order: 3, isAvailable: true },
      { name: 'کاپوچینو',        price: 290000, category: 'نوشیدنی گرم بر پایه اسپرسو', order: 4, isAvailable: true },
      { name: 'کارامل ماکیاتو',  price: 335000, category: 'نوشیدنی گرم بر پایه اسپرسو', order: 5, isAvailable: true },
      { name: 'موکا',            price: 335000, category: 'نوشیدنی گرم بر پایه اسپرسو', order: 6, isAvailable: true },
      { name: 'کورتادو',         price: 260000, category: 'نوشیدنی گرم بر پایه اسپرسو', order: 7, isAvailable: true },
      // نوشیدنی سرد بر پایه اسپرسو
      { name: 'آیس آمریکانو',        price: 240000, category: 'نوشیدنی سرد بر پایه اسپرسو', order: 1, isAvailable: true },
      { name: 'آیس لته',             price: 305000, category: 'نوشیدنی سرد بر پایه اسپرسو', order: 2, isAvailable: true },
      { name: 'آیس کارامل ماکیاتو',  price: 335000, category: 'نوشیدنی سرد بر پایه اسپرسو', order: 3, isAvailable: true },
      { name: 'آیس موکا',            price: 335000, category: 'نوشیدنی سرد بر پایه اسپرسو', order: 4, isAvailable: true },
      // چای و دمنوش
      { name: 'چای سیاه',       price: 110000, category: 'چای و دمنوش', order: 1, isAvailable: true },
      { name: 'چای دودی',       price: 140000, category: 'چای و دمنوش', order: 2, isAvailable: true },
      { name: 'چای هلویی',      price: 180000, category: 'چای و دمنوش', order: 3, isAvailable: true },
      { name: 'کوئین بری',      price: 220000, category: 'چای و دمنوش', order: 4, isAvailable: true },
      { name: 'استرابری کیس',   price: 200000, category: 'چای و دمنوش', order: 5, isAvailable: true },
      { name: 'رویال جاسمین',   price: 200000, category: 'چای و دمنوش', order: 6, isAvailable: true },
      { name: 'ویکتوریا سان ست', price: 180000, category: 'چای و دمنوش', order: 7, isAvailable: true },
      { name: 'پینک رز',        price: 200000, category: 'چای و دمنوش', order: 8, isAvailable: true },
      // نوشیدنی گرم
      { name: 'هات چاکلت',  price: 350000, category: 'نوشیدنی گرم', order: 1, isAvailable: true },
      { name: 'وایت چاکلت', price: 250000, category: 'نوشیدنی گرم', order: 2, isAvailable: true },
      { name: 'چای ماسالا', price: 180000, category: 'نوشیدنی گرم', order: 3, isAvailable: true },
      { name: 'چای کرک',    price: 200000, category: 'نوشیدنی گرم', order: 4, isAvailable: true },
      // نوشیدنی سرد
      { name: 'اسپرسو مارتینی', price: 220000, category: 'نوشیدنی سرد', order: 1, isAvailable: true },
      { name: 'پیناکولادا',     price: 250000, category: 'نوشیدنی سرد', order: 2, isAvailable: true },
      { name: 'لیموناد',        price: 150000, category: 'نوشیدنی سرد', order: 3, isAvailable: true },
      { name: 'موهیتو',         price: 230000, category: 'نوشیدنی سرد', order: 4, isAvailable: true },
      { name: 'رد موهیتو',      price: 230000, category: 'نوشیدنی سرد', order: 5, isAvailable: true },
      { name: 'سان ست',         price: 230000, category: 'نوشیدنی سرد', order: 6, isAvailable: true },
      { name: 'سودا لیمو',      price: 260000, category: 'نوشیدنی سرد', order: 7, isAvailable: true },
      // نوشیدنی ساده
      { name: 'کوکا . فانتا . اسپرایت', price: 36000, category: 'نوشیدنی ساده', order: 1, isAvailable: true },
      { name: 'آب معدنی',               price: 20000,  category: 'نوشیدنی ساده', order: 2, isAvailable: true },
      // میان وعده
      { name: 'باقالی بو',      price: 340000, category: 'میان وعده', order: 1, isAvailable: true },
      { name: 'سیب‌زمینی',     price: 390000, category: 'میان وعده', order: 2, isAvailable: true },
      { name: 'بشقاب حمص',     price: 310000, category: 'میان وعده', order: 3, isAvailable: true },
      { name: 'دسر سیب کارامل', price: 305000, category: 'میان وعده', order: 4, isAvailable: true },
      // سالاد
      { name: 'سالاد سزار',    price: 640000, category: 'سالاد', order: 1, isAvailable: true },
      { name: 'سالاد سبز',     price: 560000, category: 'سالاد', order: 2, isAvailable: true },
      { name: 'سالاد پروتئین', price: 590000, category: 'سالاد', order: 3, isAvailable: true },
      // ساندویچ
      { name: 'ساندویچ مرغ باربیکیو + ساید سیب‌زمینی', price: 680000, category: 'ساندویچ', order: 1, isAvailable: true },
      { name: 'ساندویچ وج + ساید سیب‌زمینی',           price: 630000, category: 'ساندویچ', order: 2, isAvailable: true },
      { name: 'ساندویچ تخم‌مرغ + ساید گوجه و خیار',    price: 510000, category: 'ساندویچ', order: 3, isAvailable: true },
      // پاستا
      { name: 'پاستا آلفردو', price: 810000, category: 'پاستا', order: 1, isAvailable: true },
      { name: 'پاستا اسفناج', price: 940000, category: 'پاستا', order: 2, isAvailable: true },
      { name: 'پاستا وج',     price: 740000, category: 'پاستا', order: 3, isAvailable: true },
      // بشقاب
      { name: 'بشقاب سوسیس',    price: 640000, category: 'بشقاب', order: 1, isAvailable: true },
      { name: 'بشقاب مرغ گریل', price: 430000, category: 'بشقاب', order: 2, isAvailable: true },
      // تاپینگ
      { name: 'سس آلفردو', price: 120000, category: 'تاپینگ', order: 1, isAvailable: true },
  ]

  const existingCount = await db.cafeMenuItem.count()
  if (existingCount === 0) {
    await db.cafeMenuItem.createMany({ data: menuItems })
  }

  console.log('✓ Seed completed')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
