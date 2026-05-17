import jalaali from 'jalaali-js'

export const PERSIAN_MONTHS = [
  'فروردین','اردیبهشت','خرداد','تیر',
  'مرداد','شهریور','مهر','آبان',
  'آذر','دی','بهمن','اسفند',
]

export const PERSIAN_DAYS = ['ش','ی','د','س','چ','پ','ج']

export const TIME_SLOTS = [
  '۹:۰۰','۱۰:۰۰','۱۱:۰۰','۱۲:۰۰',
  '۱۳:۰۰','۱۴:۰۰','۱۵:۰۰','۱۶:۰۰',
  '۱۷:۰۰','۱۸:۰۰','۱۹:۰۰','۲۰:۰۰',
]

export interface JalaliDate {
  jy: number
  jm: number
  jd: number
}

export function toJalali(date: Date): JalaliDate {
  return jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function fromJalali(jy: number, jm: number, jd: number): Date {
  const g = jalaali.toGregorian(jy, jm, jd)
  return new Date(g.gy, g.gm - 1, g.gd)
}

export function daysInJalaliMonth(jy: number, jm: number): number {
  return jalaali.jalaaliMonthLength(jy, jm)
}

export function firstDayOfJalaliMonth(jy: number, jm: number): number {
  const date = fromJalali(jy, jm, 1)
  // شنبه=0، یکشنبه=1، ...، جمعه=6
  return (date.getDay() + 1) % 7
}

export function toPersian(num: number | string): string {
  return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d])
}

export function todayJalali(): JalaliDate {
  return toJalali(new Date())
}

export function jalaliToDisplay(date: Date): string {
  const j = toJalali(date)
  return `${toPersian(j.jd)} ${PERSIAN_MONTHS[j.jm - 1]} ${toPersian(j.jy)}`
}
