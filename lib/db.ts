import { PrismaClient, Prisma } from '@prisma/client'
import { logger } from '@/lib/logger'

// eslint-disable-next-line no-var
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createClient() {
  const client = new PrismaClient({
    log: [
      { level: 'error', emit: 'event' },
      { level: 'warn',  emit: 'event' },
      { level: 'query', emit: 'event' },
    ],
  })

  client.$on('error', (e: Prisma.LogEvent) => {
    logger.db(`خطای دیتابیس — ${e.target}`, { message: e.message })
  })

  client.$on('warn', (e: Prisma.LogEvent) => {
    logger.db(`هشدار دیتابیس`, { message: e.message })
  })

  // کوئری‌های کند (بیشتر از ۲ ثانیه) را لاگ می‌کند
  client.$on('query', (e: Prisma.QueryEvent) => {
    if (e.duration > 2000) {
      logger.db(`کوئری کند (${e.duration}ms)`, { query: e.query })
    }
  })

  return client
}

export const db = globalThis.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
