'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'

type MenuItem = {
  id:          string
  name:        string
  price:       number
  category:    string
  description: string | null
  imageUrl:    string | null
  isAvailable: boolean
}

const categories = [
  { id: 'cat-espresso-hot',  title: 'نوشیدنی گرم بر پایه اسپرسو' },
  { id: 'cat-espresso-cold', title: 'نوشیدنی سرد بر پایه اسپرسو' },
  { id: 'cat-tea',           title: 'چای و دمنوش'                 },
  { id: 'cat-hot',           title: 'نوشیدنی گرم'                 },
  { id: 'cat-cold',          title: 'نوشیدنی سرد'                 },
  { id: 'cat-simple',        title: 'نوشیدنی ساده'                },
  { id: 'cat-snacks',        title: 'میان وعده'                   },
  { id: 'cat-salad',         title: 'سالاد'                       },
  { id: 'cat-sandwich',      title: 'ساندویچ'                     },
  { id: 'cat-pasta',         title: 'پاستا'                       },
  { id: 'cat-plate',         title: 'بشقاب'                       },
  { id: 'cat-topping',       title: 'تاپینگ'                      },
]

const catTitleToId: Record<string, string> = {
  'نوشیدنی گرم بر پایه اسپرسو': 'cat-espresso-hot',
  'نوشیدنی سرد بر پایه اسپرسو': 'cat-espresso-cold',
  'چای و دمنوش':                 'cat-tea',
  'نوشیدنی گرم':                 'cat-hot',
  'نوشیدنی سرد':                 'cat-cold',
  'نوشیدنی ساده':                'cat-simple',
  'میان وعده':                   'cat-snacks',
  'سالاد':                       'cat-salad',
  'ساندویچ':                     'cat-sandwich',
  'پاستا':                       'cat-pasta',
  'بشقاب':                       'cat-plate',
  'تاپینگ':                      'cat-topping',
}

const placeholderGradients = [
  'linear-gradient(135deg, #f5e6d3, #e8c9a0)',
  'linear-gradient(135deg, #d3e8f5, #a0c9e8)',
  'linear-gradient(135deg, #d3f5e6, #a0e8c9)',
  'linear-gradient(135deg, #f5d3e8, #e8a0c9)',
  'linear-gradient(135deg, #e8f5d3, #c9e8a0)',
  'linear-gradient(135deg, #f5f5d3, #e8e8a0)',
]

function scrollToSection(id: string) {
  setTimeout(() => {
    const el = document.getElementById(id)
    if (!el) return
    const OFFSET = 120
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }, 50)
}

function MenuItemCard({ item, index }: { item: MenuItem; index: number }) {
  const gradient = placeholderGradients[index % 6]
  return (
    <div className="flex items-center gap-3 p-3 border border-[#EFEFEF] rounded-lg bg-white">
      <div
        className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
        style={{ background: gradient, position: 'relative' }}
      >
        {item.imageUrl && (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#171717] leading-tight mb-1 truncate">
          {item.name}
        </p>
        {item.description && (
          <p className="text-xs text-[#717171] font-light" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{item.description}</p>
        )}
      </div>
      <div className="flex-shrink-0 text-left">
        <span className="text-sm font-black text-[#801A00]">
          {item.price.toLocaleString('fa-IR')}
        </span>
        <span className="text-xs text-[#999] font-bold mr-1">تومان</span>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 p-3 border border-[#EFEFEF] rounded-lg bg-white">
      <div className="w-20 h-20 rounded-lg animate-pulse" style={{ background: '#F0F0F0', flexShrink: 0 }} />
      <div className="flex-1">
        <div className="h-4 rounded animate-pulse mb-2" style={{ background: '#F0F0F0', width: '60%' }} />
        <div className="h-3 rounded animate-pulse" style={{ background: '#F0F0F0', width: '40%' }} />
      </div>
      <div className="h-4 w-16 rounded animate-pulse" style={{ background: '#F0F0F0' }} />
    </div>
  )
}

export default function CafePage() {
  const [items,         setItems]         = useState<MenuItem[]>([])
  const [loading,       setLoading]       = useState(true)
  const [activeSection, setActiveSection] = useState(categories[0].id)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    fetch('/api/cafe-menu')
      .then((r) => r.json())
      .then((data: MenuItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading) return
    observerRef.current?.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        }
      },
      { rootMargin: '-130px 0px -60% 0px', threshold: 0 },
    )
    categories.forEach((cat) => {
      const el = document.getElementById(cat.id)
      if (el) observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [loading])

  const itemsByCategory = (catTitle: string) =>
    items.filter((i) => i.category === catTitle)

  const visibleCategories = loading
    ? categories
    : categories.filter((cat) => itemsByCategory(cat.title).length > 0)

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="منوی کافه"
      />

      <div className="bg-[#FDF5F5] border-b border-[#F0D5D5] py-3 px-6 text-center">
        <p className="text-xs text-[#801A00]">
          در صورتی که حساسیت غذایی دارید به ویتر اطلاع دهید
        </p>
      </div>

      {/* ناوبار افقی موبایل */}
      <div className="lg:hidden sticky z-40 bg-white border-b border-[#EFEFEF]" style={{ top: '60px' }}>
        <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveSection(cat.id); scrollToSection(cat.id) }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
                activeSection === cat.id
                  ? 'bg-[#801A00] border-[#801A00] text-white'
                  : 'bg-white border-[#EFEFEF] text-[#404040]'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8 flex gap-8">

        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-[220px] flex-shrink-0">
          <div style={{ position: 'sticky', top: '88px', alignSelf: 'start' }}>
            {visibleCategories.map((cat) => {
              const isActive = activeSection === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveSection(cat.id); scrollToSection(cat.id) }}
                  className="w-full text-right transition-all duration-150 hover:bg-[#FAFAFA]"
                  style={{
                    padding: '10px 14px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', gap: '2px',
                    background: isActive ? '#FDF5F5' : 'transparent',
                    borderRight: isActive ? '3px solid #801A00' : '3px solid transparent',
                    border: 'none',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isActive ? '#801A00' : '#171717' }}>
                    {cat.title}
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* محتوای اصلی */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {visibleCategories.map((cat) => {
            const catItems = loading
              ? Array.from({ length: 4 })
              : itemsByCategory(cat.title)

            return (
              <div key={cat.id}>
                <section id={cat.id} className="mb-12 scroll-mt-36">
                  <div className="flex items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-black text-[#171717]">{cat.title}</h2>
                    </div>
                    <div className="flex-1 h-px bg-[#EFEFEF]" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {loading
                      ? catItems.map((_, idx) => <SkeletonCard key={idx} />)
                      : (catItems as MenuItem[]).map((item, idx) => (
                          <MenuItemCard key={item.id} item={item} index={idx} />
                        ))
                    }
                  </div>
                </section>

                {catTitleToId[cat.title] === 'cat-simple' && (
                  <div className="relative w-full my-4" style={{ height: 80 }}>
                    <Image src="/images/chair.png" alt="" fill className="object-contain object-right" />
                  </div>
                )}
              </div>
            )
          })}
        </main>

      </div>
    </div>
  )
}
