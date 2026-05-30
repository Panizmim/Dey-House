export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { logger } = await import('@/lib/logger')

    logger.info('سرور Next.js راه‌اندازی شد', { env: process.env.NODE_ENV })

    process.on('uncaughtException', (err: Error) => {
      logger.error('خطای ناخواسته سرور', { name: err.name, message: err.message, stack: err.stack })
    })

    process.on('unhandledRejection', (reason: unknown) => {
      const msg = reason instanceof Error ? reason.message : String(reason)
      logger.error('Promise رد نشده', { reason: msg })
    })
  }
}
