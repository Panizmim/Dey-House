import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toPersianNum(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return String(num).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)])
}

export function formatPrice(price: number): string {
  return toPersianNum(price.toLocaleString('en-US')) + ' تومان'
}

export function toJalali(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Tehran',
  }).format(date)
}

export function toJalaliShort(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tehran',
  }).format(date)
}

export function toTehranTime(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tehran',
    hour12: false,
  }).format(date)
}
