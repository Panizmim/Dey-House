'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, ImageOff, X, ChevronUp, ChevronDown } from '@/components/ui/icons'
import toast from 'react-hot-toast'
import CafeItemModal, { type CafeMenuItem } from '@/components/admin/CafeItemModal'

type CafeCategory = { id: string; name: string; order: number }

/* ── Category Modal ── */
function CategoryModal({
  cat,
  onClose,
  onSaved,
}: {
  cat: CafeCategory | null
  onClose: () => void
  onSaved: () => void
}) {
  const [name,   setName]   = useState(cat?.name ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!name.trim()) { toast.error('نام دسته‌بندی الزامی است'); return }
    setSaving(true)
    try {
      const url    = cat ? `/api/admin/cafe-categories/${cat.id}` : '/api/admin/cafe-categories'
      const method = cat ? 'PUT' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error((data as { error?: string }).error || 'خطا')
      toast.success(cat ? 'دسته‌بندی ویرایش شد' : 'دسته‌بندی اضافه شد')
      onSaved()
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'خطا در ذخیره')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#171717' }}>
            {cat ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#717171' }}>
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">
          <label style={{ fontSize: 13, fontWeight: 600, color: '#404040', display: 'block', marginBottom: 6 }}>
            نام دسته‌بندی *
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="مثال: نوشیدنی گرم"
            className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:border-[#801A00] transition-colors"
          />
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#F0F0F0]">
          <button
            onClick={onClose}
            style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #E5E5E5', background: 'white', fontSize: 13, cursor: 'pointer' }}
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            style={{
              padding: '7px 16px', borderRadius: 8, border: 'none',
              background: '#801A00', color: 'white', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', opacity: (saving || !name.trim()) ? 0.5 : 1,
            }}
          >
            {saving ? 'در حال ذخیره...' : cat ? 'ذخیره تغییرات' : 'افزودن'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Badges / Toggles ── */
function CategoryBadge({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      fontSize: 11, fontWeight: 500, background: '#F3F4F6', color: '#6B7280', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

function AvailabilityToggle({ item, onToggle }: { item: CafeMenuItem; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
        fontSize: 12, fontWeight: 600,
        background: item.isAvailable ? '#D1FAE5' : '#F3F4F6',
        color:      item.isAvailable ? '#065F46' : '#6B7280',
        transition: 'all 0.15s',
      }}
    >
      <span style={{
        display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
        background: item.isAvailable ? '#10B981' : '#9CA3AF',
      }} />
      {item.isAvailable ? 'موجود' : 'ناموجود'}
    </button>
  )
}

/* ── Page ── */
export default function AdminCafePage() {
  const [items,        setItems]        = useState<CafeMenuItem[]>([])
  const [categories,   setCategories]   = useState<CafeCategory[]>([])
  const [loading,      setLoading]      = useState(true)
  const [activeTab,    setActiveTab]    = useState('همه')
  const [itemModal,    setItemModal]    = useState(false)
  const [editingItem,  setEditingItem]  = useState<CafeMenuItem | null>(null)
  const [catModal,     setCatModal]     = useState(false)
  const [editingCat,   setEditingCat]   = useState<CafeCategory | null>(null)

  async function fetchAll() {
    setLoading(true)
    try {
      const [itemsRes, catsRes] = await Promise.all([
        fetch('/api/admin/cafe-menu'),
        fetch('/api/admin/cafe-categories'),
      ])
      const [itemsData, catsData] = await Promise.all([itemsRes.json(), catsRes.json()])
      setItems(Array.isArray(itemsData) ? itemsData : [])
      setCategories(Array.isArray(catsData) ? catsData : [])
    } catch {
      toast.error('خطا در بارگذاری')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const allTabs = [{ id: '__all__', name: 'همه', order: -1 }, ...categories]
  const displayed = activeTab === 'همه'
    ? items
    : items.filter((i) => i.category === activeTab).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  async function toggleAvailability(item: CafeMenuItem) {
    const res = await fetch(`/api/admin/cafe-menu/${item.id}/toggle`, { method: 'PATCH' })
    if (res.ok) fetchAll()
    else toast.error('خطا در تغییر وضعیت')
  }

  async function deleteItem(item: CafeMenuItem) {
    if (!window.confirm(`آیا مطمئنید می‌خواهید «${item.name}» را حذف کنید؟`)) return
    const res = await fetch(`/api/admin/cafe-menu/${item.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('آیتم حذف شد'); fetchAll() }
    else toast.error('خطا در حذف آیتم')
  }

  async function deleteCategory(cat: CafeCategory) {
    const count = items.filter((i) => i.category === cat.name).length
    const msg = count > 0
      ? `این دسته‌بندی دارای ${count} آیتم است. آیا مطمئنید؟`
      : `آیا دسته‌بندی «${cat.name}» حذف شود؟`
    if (!window.confirm(msg)) return
    const res = await fetch(`/api/admin/cafe-categories/${cat.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('دسته‌بندی حذف شد')
      if (activeTab === cat.name) setActiveTab('همه')
      fetchAll()
    } else toast.error('خطا در حذف دسته‌بندی')
  }

  async function moveCategory(catId: string, dir: 'up' | 'down') {
    const idx = categories.findIndex((c) => c.id === catId)
    if (dir === 'up' && idx === 0) return
    if (dir === 'down' && idx === categories.length - 1) return
    const newCats = [...categories]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    ;[newCats[idx], newCats[swap]] = [newCats[swap], newCats[idx]]
    const updated = newCats.map((c, i) => ({ ...c, order: i + 1 }))
    setCategories(updated)
    await fetch('/api/admin/cafe-categories/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders: updated.map(({ id, order }) => ({ id, order })) }),
    })
  }

  async function moveItem(itemId: string, dir: 'up' | 'down') {
    const catItems = displayed
    const idx = catItems.findIndex((i) => i.id === itemId)
    if (dir === 'up' && idx === 0) return
    if (dir === 'down' && idx === catItems.length - 1) return
    const newItems = [...catItems]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    ;[newItems[idx], newItems[swap]] = [newItems[swap], newItems[idx]]
    const orders = newItems.map((item, i) => ({ id: item.id, order: i + 1 }))
    setItems((prev) => {
      const others = prev.filter((i) => i.category !== activeTab)
      return [...others, ...newItems.map((item, i) => ({ ...item, order: i + 1 }))]
    })
    await fetch('/api/admin/cafe-menu/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders }),
    })
  }

  const isFiltered = activeTab !== 'همه'

  return (
    <div>
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717' }}>مدیریت منوی کافه</h1>
          <p style={{ fontSize: 13, color: '#717171', marginTop: 2 }}>
            {items.length} آیتم در {categories.length} دسته‌بندی
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditingCat(null); setCatModal(true) }}
            className="flex items-center gap-2"
            style={{
              padding: '9px 16px', borderRadius: 8,
              border: '1px solid #E5E5E5', background: 'white',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#404040',
            }}
          >
            <Plus size={15} />
            افزودن دسته‌بندی
          </button>
          <button
            onClick={() => { setEditingItem(null); setItemModal(true) }}
            className="flex items-center gap-2"
            style={{
              padding: '9px 18px', borderRadius: 8, border: 'none',
              background: '#801A00', color: 'white', fontSize: 14,
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            افزودن آیتم جدید
          </button>
        </div>
      </div>

      {/* تب‌های دسته‌بندی */}
      <div className="flex gap-2 pb-2 mb-5" style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
        {allTabs.map((cat, tabIdx) => {
          const isActive = activeTab === cat.name
          const isAll    = cat.id === '__all__'
          const realIdx  = tabIdx - 1 // چون اول "همه" داریم
          return (
            <div
              key={cat.id}
              onClick={() => setActiveTab(cat.name)}
              style={{
                flexShrink: 0, borderRadius: 20, fontSize: 13, cursor: 'pointer',
                fontWeight: isActive ? 700 : 400, transition: 'all 0.15s',
                background: isActive ? '#801A00' : 'white',
                color:      isActive ? 'white' : '#404040',
                border:     isActive ? 'none' : '1px solid #E5E5E5',
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '6px 12px', whiteSpace: 'nowrap',
              }}
            >
              {/* دکمه‌های ترتیب دسته‌بندی */}
              {!isAll && (
                <span style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveCategory(cat.id, 'up') }}
                    disabled={realIdx === 0}
                    style={{
                      background: 'none', border: 'none', cursor: realIdx === 0 ? 'default' : 'pointer',
                      padding: 0, lineHeight: 1, display: 'flex', color: 'inherit',
                      opacity: realIdx === 0 ? 0.25 : 0.7,
                    }}
                  >
                    <ChevronUp size={11} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveCategory(cat.id, 'down') }}
                    disabled={realIdx === categories.length - 1}
                    style={{
                      background: 'none', border: 'none', cursor: realIdx === categories.length - 1 ? 'default' : 'pointer',
                      padding: 0, lineHeight: 1, display: 'flex', color: 'inherit',
                      opacity: realIdx === categories.length - 1 ? 0.25 : 0.7,
                    }}
                  >
                    <ChevronDown size={11} />
                  </button>
                </span>
              )}

              <span>
                {cat.name}
                {!isAll && (
                  <span style={{ marginRight: 4, fontSize: 11, opacity: isActive ? 0.8 : 0.5 }}>
                    ({items.filter((i) => i.category === cat.name).length})
                  </span>
                )}
              </span>

              {!isAll && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); setEditingCat(cat as CafeCategory); setCatModal(true) }}
                    title="ویرایش دسته‌بندی"
                    style={{ display: 'flex', cursor: 'pointer', opacity: isActive ? 0.8 : 0.5 }}
                  >
                    <Pencil size={12} />
                  </span>
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); deleteCategory(cat as CafeCategory) }}
                    title="حذف دسته‌بندی"
                    style={{ display: 'flex', cursor: 'pointer', color: isActive ? 'rgba(255,255,255,0.8)' : '#DC2626' }}
                  >
                    <Trash2 size={12} />
                  </span>
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* راهنمای ترتیب آیتم‌ها */}
      {isFiltered && !loading && displayed.length > 1 && (
        <div style={{ marginBottom: 12, padding: '8px 12px', background: '#FDF5F5', borderRadius: 8, fontSize: 12, color: '#801A00' }}>
          برای تغییر ترتیب آیتم‌ها از دکمه‌های ↑↓ در ستون عملیات استفاده کنید
        </div>
      )}

      {/* جدول */}
      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEFEF' }}>
                {['تصویر', 'نام', 'دسته', 'قیمت', 'وضعیت', 'عملیات'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 12, color: '#717171', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #EFEFEF' }}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} style={{ padding: '14px 16px' }}>
                        <div className="animate-pulse rounded" style={{ height: 16, background: '#F3F4F6', width: j === 0 ? 40 : '70%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center', fontSize: 14, color: '#717171' }}>
                    هیچ آیتمی در این دسته وجود ندارد
                  </td>
                </tr>
              ) : (
                displayed.map((item, itemIdx) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: '1px solid #EFEFEF' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#FAFAFA' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      {item.imageUrl ? (
                        <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 6, overflow: 'hidden' }}>
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div style={{ width: 40, height: 40, borderRadius: 6, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageOff size={16} color="#B0B0B0" />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}>{item.name}</span>
                      {item.description && <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{item.description}</p>}
                    </td>
                    <td style={{ padding: '12px 16px' }}><CategoryBadge label={item.category} /></td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#801A00' }}>
                        {item.price.toLocaleString('fa-IR')} تومان
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <AvailabilityToggle item={item} onToggle={() => toggleAvailability(item)} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="flex items-center gap-2">
                        {/* دکمه‌های ترتیب — فقط وقتی دسته‌بندی مشخص انتخاب شده */}
                        {isFiltered && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <button
                              onClick={() => moveItem(item.id, 'up')}
                              disabled={itemIdx === 0}
                              title="انتقال به بالا"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 22, height: 18, borderRadius: 4,
                                border: '1px solid #E5E5E5', background: 'white',
                                cursor: itemIdx === 0 ? 'default' : 'pointer',
                                opacity: itemIdx === 0 ? 0.3 : 1, color: '#717171',
                              }}
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              onClick={() => moveItem(item.id, 'down')}
                              disabled={itemIdx === displayed.length - 1}
                              title="انتقال به پایین"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 22, height: 18, borderRadius: 4,
                                border: '1px solid #E5E5E5', background: 'white',
                                cursor: itemIdx === displayed.length - 1 ? 'default' : 'pointer',
                                opacity: itemIdx === displayed.length - 1 ? 0.3 : 1, color: '#717171',
                              }}
                            >
                              <ChevronDown size={12} />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => { setEditingItem(item); setItemModal(true) }}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: '1px solid #E5E5E5', background: 'white', fontSize: 12, color: '#717171', cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#801A00'; e.currentTarget.style.borderColor = '#801A00' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#717171'; e.currentTarget.style.borderColor = '#E5E5E5' }}
                        >
                          <Pencil size={13} /> ویرایش
                        </button>
                        <button
                          onClick={() => deleteItem(item)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: '1px solid #FEE2E2', background: 'white', fontSize: 12, color: '#DC2626', cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'white' }}
                        >
                          <Trash2 size={13} /> حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && displayed.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid #EFEFEF', background: '#FAFAFA' }}>
            <p style={{ fontSize: 12, color: '#9CA3AF' }}>نمایش {displayed.length} از {items.length} آیتم</p>
          </div>
        )}
      </div>

      {itemModal && (
        <CafeItemModal
          open={itemModal}
          item={editingItem}
          categories={categories.map((c) => c.name)}
          onClose={() => setItemModal(false)}
          onSave={fetchAll}
        />
      )}

      {catModal && (
        <CategoryModal
          cat={editingCat}
          onClose={() => setCatModal(false)}
          onSaved={fetchAll}
        />
      )}
    </div>
  )
}
