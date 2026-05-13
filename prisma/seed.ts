import { PrismaClient } from '@prisma/client'
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

  console.log('✓ Seed completed')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
