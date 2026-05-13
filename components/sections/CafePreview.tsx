'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toPersianNum } from '@/lib/utils'

type Item = { name: string; price: number; tab: string }

const items: Item[] = [
  /* ── قهوه ── */
  { name: 'اسپرسو',          price: 225000, tab: 'قهوه' },
  { name: 'آمریکانو',         price: 240000, tab: 'قهوه' },
  { name: 'لته',              price: 305000, tab: 'قهوه' },
  { name: 'کاپوچینو',         price: 290000, tab: 'قهوه' },
  { name: 'کارامل ماکیاتو',   price: 335000, tab: 'قهوه' },
  { name: 'موکا',             price: 335000, tab: 'قهوه' },
  { name: 'کورتادو',          price: 260000, tab: 'قهوه' },
  { name: 'آیس آمریکانو',     price: 240000, tab: 'قهوه' },
  { name: 'آیس لته',          price: 305000, tab: 'قهوه' },
  { name: 'آیس کارامل ماکیاتو', price: 335000, tab: 'قهوه' },
  { name: 'آیس موکا',         price: 335000, tab: 'قهوه' },
  /* ── چای ── */
  { name: 'چای سیاه',         price: 110000, tab: 'چای' },
  { name: 'چای دودی',         price: 140000, tab: 'چای' },
  { name: 'چای هلویی',        price: 180000, tab: 'چای' },
  { name: 'کوئین بری',        price: 220000, tab: 'چای' },
  { name: 'استرابری کیس',     price: 200000, tab: 'چای' },
  { name: 'رویال جاسمین',     price: 200000, tab: 'چای' },
  { name: 'ویکتوریا سان ست',  price: 180000, tab: 'چای' },
  { name: 'پینک رز',          price: 200000, tab: 'چای' },
  { name: 'هات چاکلت',        price: 350000, tab: 'چای' },
  { name: 'وایت چاکلت',       price: 250000, tab: 'چای' },
  { name: 'چای ماسالا',       price: 180000, tab: 'چای' },
  { name: 'چای کرک',          price: 200000, tab: 'چای' },
  /* ── نوشیدنی سرد ── */
  { name: 'اسپرسو مارتینی',   price: 220000, tab: 'نوشیدنی سرد' },
  { name: 'پیناکولادا',       price: 250000, tab: 'نوشیدنی سرد' },
  { name: 'لیموناد',          price: 150000, tab: 'نوشیدنی سرد' },
  { name: 'موهیتو',           price: 230000, tab: 'نوشیدنی سرد' },
  { name: 'رد موهیتو',        price: 230000, tab: 'نوشیدنی سرد' },
  { name: 'سان ست',           price: 230000, tab: 'نوشیدنی سرد' },
  { name: 'سودا لیمو',        price: 260000, tab: 'نوشیدنی سرد' },
  { name: 'کوکا . فانتا . اسپرایت', price: 36000, tab: 'نوشیدنی سرد' },
  { name: 'آب معدنی',         price: 20000,  tab: 'نوشیدنی سرد' },
  /* ── غذا ── */
  { name: 'باقالی بو',                              price: 340000, tab: 'غذا' },
  { name: 'سیب‌زمینی',                             price: 390000, tab: 'غذا' },
  { name: 'بشقاب حمص',                              price: 310000, tab: 'غذا' },
  { name: 'دسر سیب کارامل',                         price: 305000, tab: 'غذا' },
  { name: 'سالاد سزار',                             price: 640000, tab: 'غذا' },
  { name: 'سالاد سبز',                              price: 560000, tab: 'غذا' },
  { name: 'سالاد پروتئین',                          price: 590000, tab: 'غذا' },
  { name: 'ساندویچ مرغ باربیکیو + ساید سیب‌زمینی', price: 680000, tab: 'غذا' },
  { name: 'ساندویچ وج + ساید سیب‌زمینی',           price: 630000, tab: 'غذا' },
  { name: 'ساندویچ تخم‌مرغ + ساید گوجه و خیار',    price: 510000, tab: 'غذا' },
  { name: 'پاستا آلفردو',                           price: 810000, tab: 'غذا' },
  { name: 'پاستا اسفناج',                           price: 940000, tab: 'غذا' },
  { name: 'پاستا وج',                               price: 740000, tab: 'غذا' },
  { name: 'بشقاب سوسیس',                           price: 640000, tab: 'غذا' },
  { name: 'بشقاب مرغ گریل',                        price: 430000, tab: 'غذا' },
]

const FEATURED: Item[] = [
  { name: 'اسپرسو',          price: 225000, tab: 'همه' },
  { name: 'کاپوچینو',        price: 290000, tab: 'همه' },
  { name: 'آیس لته',         price: 305000, tab: 'همه' },
  { name: 'چای دودی',        price: 140000, tab: 'همه' },
  { name: 'موهیتو',          price: 230000, tab: 'همه' },
  { name: 'پیناکولادا',      price: 250000, tab: 'همه' },
  { name: 'سالاد سزار',      price: 640000, tab: 'همه' },
  { name: 'پاستا آلفردو',    price: 810000, tab: 'همه' },
  { name: 'ساندویچ مرغ باربیکیو + ساید سیب‌زمینی', price: 680000, tab: 'همه' },
]

const TABS = ['همه', 'قهوه', 'چای', 'نوشیدنی سرد', 'غذا']

function formatPrice(price: number) {
  const thousands = Math.floor(price / 1000)
  return `${toPersianNum(thousands)}،۰۰۰ ت`
}

export function CafePreview() {
  const [active, setActive] = useState('همه')
  const filtered = active === 'همه' ? FEATURED : items.filter((i) => i.tab === active)

  return (
    <section className="bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-container mx-auto px-6 md:px-8 lg:px-12 py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-[800] text-neutral-900">منوی کافه</h2>
          <Link
            href="/cafe"
            className="text-sm text-neutral-500 border border-neutral-200 rounded-lg px-4 py-2 hover:border-brand hover:text-brand transition-colors duration-200"
          >
            مشاهده همه
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={
                active === tab
                  ? 'px-4 py-1.5 rounded-full text-sm font-bold bg-brand text-white border border-brand transition-all duration-200 whitespace-nowrap'
                  : 'px-4 py-1.5 rounded-full text-sm text-neutral-700 bg-white border border-neutral-200 hover:border-brand hover:text-brand transition-all duration-200 whitespace-nowrap cursor-pointer'
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="bg-white flex items-center justify-between gap-3 px-4 py-3"
              style={{ border: '1px solid #EFEFEF', borderRadius: '8px' }}
            >
              <span className="font-[600] text-neutral-900 text-sm leading-relaxed">{item.name}</span>
              <span className="text-brand font-[700] text-sm whitespace-nowrap shrink-0">
                {formatPrice(item.price)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
