'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
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

/* ─── پاپ‌آپ جزئیات آیتم ─── */
function CafeItemPopup({ item, index, onClose }: { item: MenuItem; index: number; onClose: () => void }) {
  const gradient = placeholderGradients[index % 6]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', animation: 'fadeInOverlay 180ms ease' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ animation: 'slideUpCard 220ms cubic-bezier(0.34,1.56,0.64,1)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* تصویر / پلیس‌هولدر */}
        <div className="relative w-full" style={{ aspectRatio: '4/3', background: gradient, flexShrink: 0 }}>
          {item.imageUrl && (
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
          )}
          {/* دکمه بستن */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 12, left: 12,
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(0,0,0,0.45)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 18, lineHeight: 1,
            }}
            aria-label="بستن"
          >
            ✕
          </button>
          {/* badge موجودی */}
          {!item.isAvailable && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(0,0,0,0.6)', color: 'white',
              fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
            }}>
              ناموجود
            </div>
          )}
        </div>

        {/* اطلاعات */}
        <div className="p-5 flex flex-col gap-4">
          {/* نام */}
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#171717', lineHeight: 1.3 }}>
            {item.name}
          </h2>

          {/* توضیحات */}
          {item.description && (
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, fontWeight: 300 }}>
              {item.description}
            </p>
          )}

          {/* قیمت */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: '#FAFAFA', borderRadius: 12,
          }}>
            <span style={{ fontSize: 13, color: '#717171', fontWeight: 500 }}>قیمت</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#801A00' }}>
                {item.price.toLocaleString('fa-IR')}
              </span>
              <span style={{ fontSize: 12, color: '#999', fontWeight: 600 }}>تومان</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUpCard {
          from { opacity: 0; transform: translateY(24px) scale(0.97) }
          to   { opacity: 1; transform: translateY(0)    scale(1)    }
        }
      `}</style>
    </div>,
    document.body,
  )
}

/* ─── کارت آیتم ─── */
function MenuItemCard({ item, index, onClick }: { item: MenuItem; index: number; onClick: () => void }) {
  const gradient = placeholderGradients[index % 6]
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-3 border border-[#EFEFEF] rounded-lg bg-white text-right w-full transition-all duration-150 hover:border-[#D0A0A0] hover:shadow-sm active:scale-[0.98]"
      style={{ cursor: 'pointer' }}
    >
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
    </button>
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
  const [selected,      setSelected]      = useState<{ item: MenuItem; index: number } | null>(null)
  const navScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const nav = navScrollRef.current
    if (!nav) return
    const activeBtn = nav.querySelector<HTMLElement>(`[data-cat="${activeSection}"]`)
    if (!activeBtn) return
    const target = activeBtn.offsetLeft - nav.offsetWidth / 2 + activeBtn.offsetWidth / 2
    nav.scrollTo({ left: target, behavior: 'smooth' })
  }, [activeSection])

  useEffect(() => {
    fetch('/api/cafe-menu')
      .then((r) => r.json())
      .then((data: MenuItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading) return
    const OFFSET = 140
    function onScroll() {
      let active = ''
      for (const cat of categories) {
        const el = document.getElementById(cat.id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= OFFSET) active = cat.id
      }
      if (active) setActiveSection(active)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [loading])

  const itemsByCategory = (catTitle: string) =>
    items.filter((i) => i.category === catTitle)

  const visibleCategories = loading
    ? categories
    : categories.filter((cat) => itemsByCategory(cat.title).length > 0)

  return (
    <div className="min-h-screen bg-white">
      <PageHero title="منوی کافه" />

      <div className="bg-[#FDF5F5] border-b border-[#F0D5D5] py-3 px-6 text-center">
        <p className="text-xs text-[#801A00]">
          در صورتی که حساسیت غذایی دارید به ویتر اطلاع دهید
        </p>
      </div>

      {/* ناوبار افقی موبایل */}
      <div className="lg:hidden sticky z-40 bg-white border-b border-[#EFEFEF]" style={{ top: '60px' }}>
        <div ref={navScrollRef} className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              data-cat={cat.id}
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
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            index={idx}
                            onClick={() => setSelected({ item, index: idx })}
                          />
                        ))
                    }
                  </div>
                </section>

              </div>
            )
          })}
        </main>

      </div>

      {/* پاپ‌آپ جزئیات */}
      {selected && (
        <CafeItemPopup
          item={selected.item}
          index={selected.index}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
