import { db } from '@/lib/db'
import { DEFAULT_PHONES, type SitePhone } from '@/lib/site-phones'

/** همه شماره‌ها (شامل مخفی‌ها) — برای پنل ادمین */
export async function getAllSitePhones(): Promise<SitePhone[]> {
  try {
    const rows = await db.sitePhone.findMany({ orderBy: [{ order: 'asc' }] })
    if (rows.length === 0) return DEFAULT_PHONES
    return rows.map(({ key, label, number, isVisible }) => ({ key, label, number, isVisible }))
  } catch {
    // اگر دیتابیس در دسترس نبود، سایت نباید از کار بیفتد
    return DEFAULT_PHONES
  }
}

/** شماره‌های قابل نمایش روی سایت (فوتر و صفحه تماس) */
export async function getSitePhones(): Promise<SitePhone[]> {
  const phones = await getAllSitePhones()
  return phones.filter((p) => p.isVisible && p.number.trim() !== '')
}
