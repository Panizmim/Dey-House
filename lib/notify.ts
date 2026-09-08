import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

/** کانال‌های اطلاع‌رسانی به ادمین */
export type NotifyChannel = 'SMS' | 'EMAIL'

export type AdminNotifyTarget = {
  id:       string
  channel:  NotifyChannel
  value:    string
  label:    string
  isActive: boolean
}

/** پیامی که برای ادمین فرستاده می‌شود */
export type AdminNotification = {
  /** عنوان کوتاه — موضوع ایمیل و خط اول پیامک */
  title: string
  /** ردیف‌های جزئیات، به شکل [برچسب، مقدار] */
  rows: [string, string][]
  /** لینک صفحه مربوطه در پنل ادمین (بدون دامنه) */
  adminPath?: string
}

const SMS_TIMEOUT_MS   = 8_000
const EMAIL_TIMEOUT_MS = 8_000

/** با تایم‌اوت fetch می‌کند تا ثبت رزرو به خاطر کندی سرویس پیام معطل نماند */
async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/** مقصدهای فعال یک کانال؛ اگر دیتابیس در دسترس نبود، آرایه خالی برمی‌گرداند */
async function getActiveTargets(channel: NotifyChannel): Promise<string[]> {
  try {
    const rows = await db.adminNotifyTarget.findMany({
      where:   { channel, isActive: true },
      orderBy: { order: 'asc' },
    })
    return rows.map((r) => r.value.trim()).filter(Boolean)
  } catch (error) {
    logger.error('خواندن مقصدهای اطلاع‌رسانی ادمین ناموفق بود', { channel, error: String(error) })
    return []
  }
}

/** متن پیامک — کوتاه، چون هر ۷۰ کاراکتر فارسی یک پیامک حساب می‌شود */
function buildSmsText(n: AdminNotification): string {
  const lines = n.rows.map(([label, value]) => `${label}: ${value}`)
  return [`خانه دی — ${n.title}`, ...lines].join('\n')
}

/** بدنه HTML ایمیل — راست‌چین و فارسی */
function buildEmailHtml(n: AdminNotification, siteUrl: string): string {
  const rows = n.rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:#707070;font-size:13px;width:120px;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#1A1A1A;font-size:14px;font-weight:700;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('')

  const button = n.adminPath
    ? `<a href="${siteUrl}${n.adminPath}" style="display:inline-block;margin-top:20px;padding:10px 22px;background:#801A00;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">مشاهده در پنل ادمین</a>`
    : ''

  return `<div dir="rtl" style="font-family:Tahoma,sans-serif;background:#F7F5F2;padding:28px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #F0EDE9;border-radius:12px;padding:26px;">
    <h1 style="margin:0 0 18px;font-size:17px;color:#801A00;">${escapeHtml(n.title)}</h1>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
    ${button}
  </div>
</div>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** ارسال پیامک با کاوه‌نگار */
async function sendSms(numbers: string[], text: string): Promise<void> {
  const apiKey = process.env.KAVENEGAR_API_KEY
  const sender = process.env.KAVENEGAR_SENDER

  if (!apiKey) {
    logger.warn('KAVENEGAR_API_KEY تنظیم نشده — پیامک ادمین ارسال نشد')
    return
  }

  const params = new URLSearchParams({ receptor: numbers.join(','), message: text })
  if (sender) params.set('sender', sender)

  const res = await fetchWithTimeout(
    `https://api.kavenegar.com/v1/${apiKey}/sms/send.json`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    params.toString(),
      cache:   'no-store',
    },
    SMS_TIMEOUT_MS,
  )

  if (!res.ok) {
    throw new Error(`کاوه‌نگار پاسخ ${res.status} داد: ${(await res.text()).slice(0, 200)}`)
  }
}

/** ارسال ایمیل با Resend */
async function sendEmail(recipients: string[], subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from   = process.env.NOTIFY_EMAIL_FROM

  if (!apiKey || !from) {
    logger.warn('RESEND_API_KEY یا NOTIFY_EMAIL_FROM تنظیم نشده — ایمیل ادمین ارسال نشد')
    return
  }

  const res = await fetchWithTimeout(
    'https://api.resend.com/emails',
    {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body:  JSON.stringify({ from, to: recipients, subject, html }),
      cache: 'no-store',
    },
    EMAIL_TIMEOUT_MS,
  )

  if (!res.ok) {
    throw new Error(`Resend پاسخ ${res.status} داد: ${(await res.text()).slice(0, 200)}`)
  }
}

/**
 * اطلاع‌رسانی به ادمین‌ها از طریق پیامک و ایمیل.
 * هرگز throw نمی‌کند — خطای سرویس پیام نباید ثبت رزرو کاربر را خراب کند.
 * هر کانال مستقل است؛ اگر یکی کلید نداشت یا شکست خورد، آن یکی فرستاده می‌شود.
 */
export async function notifyAdmins(notification: AdminNotification): Promise<void> {
  try {
    const siteUrl = (process.env.NEXTAUTH_URL ?? 'https://deyhouse.com').replace(/\/$/, '')

    const [smsNumbers, emails] = await Promise.all([
      getActiveTargets('SMS'),
      getActiveTargets('EMAIL'),
    ])

    if (smsNumbers.length === 0 && emails.length === 0) {
      logger.warn('هیچ مقصد فعالی برای اطلاع‌رسانی ادمین ثبت نشده است', { title: notification.title })
      return
    }

    const tasks: Promise<void>[] = []

    if (smsNumbers.length > 0) {
      tasks.push(sendSms(smsNumbers, buildSmsText(notification)))
    }
    if (emails.length > 0) {
      tasks.push(
        sendEmail(emails, `خانه دی — ${notification.title}`, buildEmailHtml(notification, siteUrl)),
      )
    }

    const results = await Promise.allSettled(tasks)
    for (const result of results) {
      if (result.status === 'rejected') {
        logger.error('ارسال اطلاع‌رسانی به ادمین ناموفق بود', {
          title:  notification.title,
          reason: String(result.reason),
        })
      }
    }
  } catch (error) {
    logger.error('اطلاع‌رسانی به ادمین با خطا مواجه شد', {
      title: notification.title,
      error: String(error),
    })
  }
}
