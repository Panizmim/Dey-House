/** ثابت‌ها و توابع کمکی شماره‌های تماس — بدون وابستگی به دیتابیس (قابل استفاده در کلاینت) */

export type SitePhone = {
  key:       string
  label:     string
  number:    string
  isVisible: boolean
}

/** شماره‌های پیش‌فرض — تا وقتی ادمین چیزی ذخیره نکرده، همین‌ها نمایش داده می‌شوند */
export const DEFAULT_PHONES: SitePhone[] = [
  { key: 'cafe',    label: 'کافه',  number: '09020282145', isVisible: true },
  { key: 'studio',  label: 'پلاتو', number: '09020282145', isVisible: true },
  { key: 'gallery', label: 'گالری', number: '09020282145', isVisible: true },
]

/** تبدیل ارقام لاتین به فارسی برای نمایش */
export function toFaDigits(value: string): string {
  return value.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])
}
