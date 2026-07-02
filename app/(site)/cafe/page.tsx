'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { ChevronDown } from '@/components/ui/icons'
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

type Category = { id: string; name: string; order: number }

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
    const top = el.getBoundingClientRect().top + window.scrollY - 130
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }, 50)
}

/* ─── پاپ‌آپ ─── */
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
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,8,6,0.7)', backdropFilter: 'blur(8px)', animation: 'pdpFadeIn 200ms ease' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[360px] overflow-hidden"
        style={{
          maxHeight: '88vh', overflowY: 'auto',
          animation: 'pdpSlideUp 280ms cubic-bezier(0.22,1,0.36,1)',
          position: 'relative', borderRadius: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* بستن */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, left: 12, zIndex: 10,
            width: 30, height: 30, borderRadius: '50%', border: 'none',
            background: item.imageUrl ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.07)',
            color: item.imageUrl ? 'white' : '#555',
            cursor: 'pointer', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: item.imageUrl ? 'blur(4px)' : 'none',
          }}
        >
          ✕
        </button>

        {/* تصویر */}
        {item.imageUrl && (
          <div className="relative w-full" style={{ aspectRatio: '1/1', background: gradient }}>
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
          </div>
        )}

        {/* محتوا */}
        <div style={{ padding: '24px 24px 32px', paddingTop: item.imageUrl ? 20 : 52 }}>
          <h2 style={{
            fontSize: 22, fontWeight: 900, color: '#171717',
            lineHeight: 1.3, marginBottom: 10, textAlign: 'right',
            letterSpacing: '-0.02em',
          }}>
            {item.name}
          </h2>

          {item.description && (
            <p style={{
              fontSize: 14, color: '#888', lineHeight: 1.9,
              fontWeight: 300, marginBottom: 20, textAlign: 'right',
            }}>
              {item.description}
            </p>
          )}

          {/* قیمت */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 18px', background: '#F7F4F1', borderRadius: 12,
            marginTop: !item.description ? 8 : 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontSize: 26, fontWeight: 900, color: '#8C2020', letterSpacing: '-0.03em' }}>
                {item.price.toLocaleString('fa-IR')}
              </span>
              <span style={{ fontSize: 12, color: '#B8B0A8', fontWeight: 500 }}>تومان</span>
            </div>
            <span style={{ fontSize: 12, color: '#AAA', fontWeight: 400 }}>قیمت</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pdpFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pdpSlideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>,
    document.body,
  )
}

/* ─── کارت آیتم ─── */
function MenuItemCard({
  item, index, onClick, isLast,
}: {
  item: MenuItem; index: number; onClick: () => void; isLast: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center w-full text-right"
      style={{
        gap: 16, padding: '18px 0',
        background: 'transparent', border: 'none',
        borderBottom: isLast ? 'none' : '1px solid #F0EDE9',
        cursor: 'pointer',
        opacity: hovered ? 0.6 : 1,
        transition: 'opacity 180ms',
      }}
    >
      {/* تصویر — راست در RTL */}
      {item.imageUrl && (
        <div style={{
          width: 70, height: 70, flexShrink: 0,
          overflow: 'hidden', position: 'relative',
          background: placeholderGradients[index % 6],
        }}>
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        </div>
      )}

      {/* متن */}
      <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.4, marginBottom: item.description ? 5 : 0 }}>
          {item.name}
        </p>
        {item.description && (
          <p style={{
            fontSize: 12, color: '#A0A0A0', fontWeight: 300, lineHeight: 1.7,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          } as React.CSSProperties}>
            {item.description}
          </p>
        )}
      </div>

      {/* قیمت — چپ در RTL */}
      <div style={{ flexShrink: 0, textAlign: 'left', minWidth: 58 }}>
        <span style={{ display: 'block', fontSize: 16, fontWeight: 900, color: '#8C2020', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {item.price.toLocaleString('fa-IR')}
        </span>
        <span style={{ fontSize: 10, color: '#C4BDB6', fontWeight: 400 }}>تومان</span>
      </div>
    </button>
  )
}

function SkeletonCard() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 0', borderBottom: '1px solid #F0EDE9' }}>
      <div style={{ flex: 1 }}>
        <div className="animate-pulse" style={{ height: 15, background: '#F0EDE9', borderRadius: 4, width: '42%', marginBottom: 8 }} />
        <div className="animate-pulse" style={{ height: 12, background: '#F0EDE9', borderRadius: 4, width: '68%' }} />
      </div>
      <div className="animate-pulse" style={{ height: 18, width: 56, background: '#F0EDE9', borderRadius: 4, flexShrink: 0 }} />
    </div>
  )
}

/* ─── صفحه اصلی ─── */
export default function CafePage() {
  const [items,          setItems]          = useState<MenuItem[]>([])
  const [categories,     setCategories]     = useState<Category[]>([])
  const [loading,        setLoading]        = useState(true)
  const [activeSection,  setActiveSection]  = useState('')
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())
  const [selected,       setSelected]       = useState<{ item: MenuItem; index: number } | null>(null)
  const navScrollRef = useRef<HTMLDivElement>(null)

  function toggleCategory(id: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function openAndScroll(id: string) {
    setOpenCategories((prev) => { const next = new Set(prev); next.add(id); return next })
    setActiveSection(id)
    scrollToSection(id)
  }

  useEffect(() => {
    const nav = navScrollRef.current
    if (!nav) return
    const activeBtn = nav.querySelector<HTMLElement>(`[data-cat="${activeSection}"]`)
    if (!activeBtn) return
    const target = activeBtn.offsetLeft - nav.offsetWidth / 2 + activeBtn.offsetWidth / 2
    nav.scrollTo({ left: target, behavior: 'smooth' })
  }, [activeSection])

  useEffect(() => {
    Promise.all([
      fetch('/api/cafe-menu').then((r) => r.json()),
      fetch('/api/cafe-categories').then((r) => r.json()),
    ])
      .then(([menuData, catData]: [MenuItem[], Category[]]) => {
        setItems(Array.isArray(menuData) ? menuData : [])
        setCategories(Array.isArray(catData) ? catData : [])
        if (Array.isArray(catData) && catData.length > 0) setActiveSection(catData[0].id)
      })
      .catch(() => {})
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
  }, [loading, categories])

  const itemsByCategory = (catName: string) =>
    items.filter((i) => i.category === catName)

  const LAST_CATS = ['تاپینگ', 'نوشیدنی ساده']

  const visibleCategories = loading
    ? categories
    : categories
        .filter((cat) => itemsByCategory(cat.name).length > 0)
        .sort((a, b) => {
          const aLast = LAST_CATS.includes(a.name) ? 1 : 0
          const bLast = LAST_CATS.includes(b.name) ? 1 : 0
          return aLast - bLast
        })

  return (
    <div className="min-h-screen bg-white">
      <PageHero title="منوی کافه" />

      {/* نوار هشدار حساسیت */}
      <div style={{ borderBottom: '1px solid #F0EDE9', padding: '10px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#B0A89E', fontWeight: 300, fontStyle: 'italic' }}>
          در صورتی که حساسیت غذایی دارید به ویتر اطلاع دهید
        </p>
      </div>

      {/* ── ناوبار موبایل — underline tab ── */}
      <div className="lg:hidden sticky z-40 bg-white" style={{ top: 60, borderBottom: '1px solid #F0EDE9' }}>
        <div ref={navScrollRef} className="flex overflow-x-auto no-scrollbar" style={{ padding: '0 16px' }}>
          {visibleCategories.map((cat) => {
            const isActive = activeSection === cat.id
            return (
              <button
                key={cat.id}
                data-cat={cat.id}
                onClick={() => openAndScroll(cat.id)}
                style={{
                  flexShrink: 0, padding: '13px 14px',
                  background: 'transparent', border: 'none',
                  borderBottom: isActive ? '2px solid #8C2020' : '2px solid transparent',
                  fontSize: 13, fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#8C2020' : '#999',
                  cursor: 'pointer', transition: 'all 150ms',
                  whiteSpace: 'nowrap', marginBottom: -1,
                }}
              >
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 py-10 flex gap-14">

        {/* ── Sidebar دسکتاپ ── */}
        <aside className="hidden lg:block flex-shrink-0" style={{ width: 190 }}>
          <div style={{ position: 'sticky', top: 100 }}>
            {visibleCategories.map((cat) => {
              const isActive = activeSection === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => openAndScroll(cat.id)}
                  className="w-full text-right"
                  style={{
                    padding: '11px 0', background: 'transparent',
                    border: 'none', borderBottom: '1px solid #F0EDE9',
                    cursor: 'pointer', fontSize: 13,
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? '#8C2020' : '#707070',
                    transition: 'color 150ms',
                  }}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        </aside>

        {/* ── محتوا ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {visibleCategories.map((cat) => {
            const isOpen   = openCategories.has(cat.id)
            const catItems = loading
              ? Array.from({ length: 5 })
              : itemsByCategory(cat.name)

            return (
              <section key={cat.id} id={cat.id} className="scroll-mt-36" style={{ marginBottom: isOpen ? 56 : 0 }}>

                {/* هدر accordion */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between"
                  style={{
                    padding: '16px 0', background: 'transparent', border: 'none',
                    borderBottom: isOpen ? 'none' : '1px solid #F0EDE9',
                    borderTop: '1px solid #F0EDE9',
                    cursor: 'pointer',
                  }}
                >
                  <h2 style={{ fontSize: 17, fontWeight: 900, color: '#1A1A1A', letterSpacing: '-0.01em' }}>
                    {cat.name}
                  </h2>
                  <ChevronDown
                    size={17}
                    style={{
                      color: '#1A1A1A', flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 250ms ease',
                    }}
                  />
                </button>

                {/* آیتم‌ها — accordion body */}
                <div style={{
                  maxHeight: isOpen ? '4000px' : '0',
                  overflow: 'hidden',
                  transition: isOpen ? 'max-height 420ms ease' : 'max-height 250ms ease',
                }}>
                  <div style={{ borderBottom: '1px solid #F0EDE9', paddingBottom: 0 }}>
                    {loading
                      ? (catItems as unknown[]).map((_, idx) => <SkeletonCard key={idx} />)
                      : (catItems as MenuItem[]).map((item, idx) => (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            index={idx}
                            onClick={() => setSelected({ item, index: idx })}
                            isLast={idx === (catItems as MenuItem[]).length - 1}
                          />
                        ))
                    }
                  </div>
                </div>
              </section>
            )
          })}
        </main>
      </div>

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
