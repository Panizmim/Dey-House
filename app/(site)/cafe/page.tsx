'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'

/* ─── داده‌های منو ─── */
const menuData: Record<string, { name: string; price: string }[]> = {
  'نوشیدنی گرم بر پایه اسپرسو': [
    { name: 'اسپرسو',          price: '۲۲۵٬۰۰۰' },
    { name: 'آمریکانو',         price: '۲۴۰٬۰۰۰' },
    { name: 'لته',             price: '۳۰۵٬۰۰۰' },
    { name: 'کاپوچینو',         price: '۲۹۰٬۰۰۰' },
    { name: 'کارامل ماکیاتو',   price: '۳۳۵٬۰۰۰' },
    { name: 'موکا',             price: '۳۳۵٬۰۰۰' },
    { name: 'کورتادو',          price: '۲۶۰٬۰۰۰' },
  ],
  'نوشیدنی سرد بر پایه اسپرسو': [
    { name: 'آیس آمریکانو',         price: '۲۴۰٬۰۰۰' },
    { name: 'آیس لته',              price: '۳۰۵٬۰۰۰' },
    { name: 'آیس کارامل ماکیاتو',   price: '۳۳۵٬۰۰۰' },
    { name: 'آیس موکا',             price: '۳۳۵٬۰۰۰' },
  ],
  'چای و دمنوش': [
    { name: 'چای سیاه',        price: '۱۱۰٬۰۰۰' },
    { name: 'چای دودی',        price: '۱۴۰٬۰۰۰' },
    { name: 'چای هلویی',       price: '۱۸۰٬۰۰۰' },
    { name: 'کوئین بری',       price: '۲۲۰٬۰۰۰' },
    { name: 'استرابری کیس',    price: '۲۰۰٬۰۰۰' },
    { name: 'رویال جاسمین',    price: '۲۰۰٬۰۰۰' },
    { name: 'ویکتوریا سان ست', price: '۱۸۰٬۰۰۰' },
    { name: 'پینک رز',         price: '۲۰۰٬۰۰۰' },
  ],
  'نوشیدنی گرم': [
    { name: 'هات چاکلت',  price: '۳۵۰٬۰۰۰' },
    { name: 'وایت چاکلت', price: '۲۵۰٬۰۰۰' },
    { name: 'چای ماسالا', price: '۱۸۰٬۰۰۰' },
    { name: 'چای کرک',    price: '۲۰۰٬۰۰۰' },
  ],
  'نوشیدنی سرد': [
    { name: 'اسپرسو مارتینی', price: '۲۲۰٬۰۰۰' },
    { name: 'پیناکولادا',     price: '۲۵۰٬۰۰۰' },
    { name: 'لیموناد',        price: '۱۵۰٬۰۰۰' },
    { name: 'موهیتو',         price: '۲۳۰٬۰۰۰' },
    { name: 'رد موهیتو',      price: '۲۳۰٬۰۰۰' },
    { name: 'سان ست',         price: '۲۳۰٬۰۰۰' },
    { name: 'سودا لیمو',      price: '۲۶۰٬۰۰۰' },
  ],
  'نوشیدنی ساده': [
    { name: 'کوکا . فانتا . اسپرایت', price: '۳۶٬۰۰۰' },
    { name: 'آب معدنی',               price: '۲۰٬۰۰۰' },
  ],
  'میان وعده': [
    { name: 'باقالی بو',       price: '۳۴۰٬۰۰۰' },
    { name: 'سیب‌زمینی',      price: '۳۹۰٬۰۰۰' },
    { name: 'بشقاب حمص',      price: '۳۱۰٬۰۰۰' },
    { name: 'دسر سیب کارامل', price: '۳۰۵٬۰۰۰' },
  ],
  'سالاد': [
    { name: 'سالاد سزار',    price: '۶۴۰٬۰۰۰' },
    { name: 'سالاد سبز',     price: '۵۶۰٬۰۰۰' },
    { name: 'سالاد پروتئین', price: '۵۹۰٬۰۰۰' },
  ],
  'ساندویچ': [
    { name: 'ساندویچ مرغ باربیکیو + ساید سیب‌زمینی',  price: '۶۸۰٬۰۰۰' },
    { name: 'ساندویچ وج + ساید سیب‌زمینی',            price: '۶۳۰٬۰۰۰' },
    { name: 'ساندویچ تخم‌مرغ + ساید گوجه و خیار',     price: '۵۱۰٬۰۰۰' },
  ],
  'پاستا': [
    { name: 'پاستا آلفردو', price: '۸۱۰٬۰۰۰' },
    { name: 'پاستا اسفناج', price: '۹۴۰٬۰۰۰' },
    { name: 'پاستا وج',     price: '۷۴۰٬۰۰۰' },
  ],
  'بشقاب': [
    { name: 'بشقاب سوسیس',    price: '۶۴۰٬۰۰۰' },
    { name: 'بشقاب مرغ گریل', price: '۴۳۰٬۰۰۰' },
  ],
  'تاپینگ': [
    { name: 'سس آلفردو', price: '۱۲۰٬۰۰۰' },
  ],
}

const categories = [
  { id: 'cat-espresso-hot',  title: 'نوشیدنی گرم بر پایه اسپرسو', subtitle: 'Hot espresso drinks' },
  { id: 'cat-espresso-cold', title: 'نوشیدنی سرد بر پایه اسپرسو', subtitle: 'Cold espresso drinks' },
  { id: 'cat-tea',           title: 'چای و دمنوش',                 subtitle: 'Tea and herbal infusions' },
  { id: 'cat-hot',           title: 'نوشیدنی گرم',                 subtitle: 'Hot drinks' },
  { id: 'cat-cold',          title: 'نوشیدنی سرد',                 subtitle: 'Cold drinks' },
  { id: 'cat-simple',        title: 'نوشیدنی ساده',                subtitle: 'Simple drinks' },
  { id: 'cat-snacks',        title: 'میان وعده',                   subtitle: 'Appetizers' },
  { id: 'cat-salad',         title: 'سالاد',                       subtitle: 'Salads' },
  { id: 'cat-sandwich',      title: 'ساندویچ',                     subtitle: 'Sandwiches' },
  { id: 'cat-pasta',         title: 'پاستا',                       subtitle: 'Pasta' },
  { id: 'cat-plate',         title: 'بشقاب',                       subtitle: 'Main plates' },
  { id: 'cat-topping',       title: 'تاپینگ',                      subtitle: 'Toppings' },
]

const placeholderGradients = [
  'linear-gradient(135deg, #f5e6d3, #e8c9a0)',
  'linear-gradient(135deg, #d3e8f5, #a0c9e8)',
  'linear-gradient(135deg, #d3f5e6, #a0e8c9)',
  'linear-gradient(135deg, #f5d3e8, #e8a0c9)',
  'linear-gradient(135deg, #e8f5d3, #c9e8a0)',
  'linear-gradient(135deg, #f5f5d3, #e8e8a0)',
]

/* ─── scrollToSection ─── */
function scrollToSection(id: string) {
  setTimeout(() => {
    const el = document.getElementById(id)
    if (!el) return
    // navbar: 60px + sticky tab bar موبایل: ~52px = 120px
    const OFFSET = 120
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }, 50)
}

/* ─── MenuItemCard ─── */
function MenuItemCard({ item, index }: { item: { name: string; price: string }; index: number }) {
  const gradient = placeholderGradients[index % 6]
  return (
    <div className="flex items-center gap-3 p-3 border border-[#EFEFEF] rounded-lg bg-white">
      <div
        className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
        style={{ background: gradient }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#171717] leading-tight mb-1 truncate">
          {item.name}
        </p>
        <p className="text-xs text-[#B0B0B0] font-light">خانه دی</p>
      </div>
      <div className="flex-shrink-0 text-left">
        <span className="text-sm font-black text-[#8B1E1E]">{item.price}</span>
        <span className="text-xs text-[#999] font-bold mr-1">تومان</span>
      </div>
    </div>
  )
}

/* ─── Page ─── */
export default function CafePage() {
  const [activeSection, setActiveSection] = useState(categories[0].id)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      {
        rootMargin: '-130px 0px -60% 0px',
        threshold: 0,
      }
    )

    categories.forEach((cat) => {
      const el = document.getElementById(cat.id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white">

      <PageHero
        title="منوی کافه خانه دی"
        subtitle="برای زندگی تازه‌ای که هنوز نزیسته‌ایم"
      />

      {/* نکته حساسیت غذایی */}
      <div className="bg-[#FDF5F5] border-b border-[#F0D5D5] py-3 px-6 text-center">
        <p className="text-xs text-[#8B1E1E]">
          در صورتی که حساسیت غذایی دارید به ویتر اطلاع دهید
        </p>
      </div>

      {/* ─── ناوبار افقی موبایل ─── */}
      <div className="lg:hidden sticky z-40 bg-white border-b border-[#EFEFEF]" style={{ top: '60px' }}>
        <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveSection(cat.id); scrollToSection(cat.id) }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
                activeSection === cat.id
                  ? 'bg-[#8B1E1E] border-[#8B1E1E] text-white'
                  : 'bg-white border-[#EFEFEF] text-[#404040]'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* ─── layout اصلی ─── */}
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex gap-8">

        {/* ─── Sidebar (desktop) ─── */}
        <aside className="hidden lg:block w-[220px] flex-shrink-0">
          <div style={{ position: 'sticky', top: '88px', alignSelf: 'start' }}>
            {categories.map((cat) => {
              const isActive = activeSection === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveSection(cat.id); scrollToSection(cat.id) }}
                  className="w-full text-right transition-all duration-150 hover:bg-[#FAFAFA]"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    background: isActive ? '#FDF5F5' : 'transparent',
                    borderRight: isActive ? '3px solid #8B1E1E' : '3px solid transparent',
                    border: 'none',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isActive ? '#8B1E1E' : '#171717' }}>
                    {cat.title}
                  </span>
                  <span style={{ fontSize: '11px', color: '#B0B0B0', fontWeight: 300, direction: 'ltr', textAlign: 'right' }}>
                    {cat.subtitle}
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* ─── محتوای اصلی ─── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {categories.map((cat, catIdx) => (
            <div key={cat.id}>
              <section id={cat.id} className="mb-12 scroll-mt-36">

                {/* عنوان دسته */}
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-black text-[#171717]">{cat.title}</h2>
                    <p
                      className="text-xs text-[#B0B0B0] font-light mt-0.5"
                      style={{ direction: 'ltr', textAlign: 'right' }}
                    >
                      {cat.subtitle}
                    </p>
                  </div>
                  <div className="flex-1 h-px bg-[#EFEFEF]" />
                </div>

                {/* گرید آیتم‌ها */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(menuData[cat.title] ?? []).map((item, idx) => (
                    <MenuItemCard key={item.name} item={item} index={idx} />
                  ))}
                </div>
              </section>

              {/* جداکننده صندلی بین نوشیدنی‌ها و خوراکی‌ها */}
              {catIdx === 5 && (
                <div className="relative w-full my-4" style={{ height: 80 }}>
                  <Image
                    src="/images/chair.png"
                    alt=""
                    fill
                    className="object-contain object-right"
                  />
                </div>
              )}
            </div>
          ))}
        </main>

      </div>
    </div>
  )
}
