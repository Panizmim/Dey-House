'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ImageOff } from 'lucide-react'
import toast from 'react-hot-toast'
import CafeItemModal, { type CafeMenuItem } from '@/components/admin/CafeItemModal'

const CATEGORIES = [
  'همه',
  'نوشیدنی گرم بر پایه اسپرسو', 'نوشیدنی سرد بر پایه اسپرسو', 'چای و دمنوش',
  'نوشیدنی گرم', 'نوشیدنی سرد', 'نوشیدنی ساده',
  'میان وعده', 'سالاد', 'ساندویچ', 'پاستا', 'بشقاب', 'تاپینگ',
]

function CategoryBadge({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      fontSize: 11, fontWeight: 500,
      background: '#F3F4F6', color: '#6B7280',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

function AvailabilityToggle({ item, onToggle }: { item: CafeMenuItem; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      title={item.isAvailable ? 'کلیک برای ناموجود کردن' : 'کلیک برای موجود کردن'}
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

export default function AdminCafePage() {
  const [items, setItems]             = useState<CafeMenuItem[]>([])
  const [loading, setLoading]         = useState(true)
  const [activeTab, setActiveTab]     = useState('همه')
  const [modalOpen, setModalOpen]     = useState(false)
  const [editingItem, setEditingItem] = useState<CafeMenuItem | null>(null)

  async function fetchItems() {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/cafe-menu')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      toast.error('خطا در بارگذاری آیتم‌ها')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const displayed = activeTab === 'همه'
    ? items
    : items.filter((i) => i.category === activeTab)

  function openAdd() {
    setEditingItem(null)
    setModalOpen(true)
  }

  function openEdit(item: CafeMenuItem) {
    setEditingItem(item)
    setModalOpen(true)
  }

  async function toggleAvailability(item: CafeMenuItem) {
    const res = await fetch(`/api/admin/cafe-menu/${item.id}/toggle`, { method: 'PATCH' })
    if (res.ok) fetchItems()
    else toast.error('خطا در تغییر وضعیت')
  }

  async function deleteItem(item: CafeMenuItem) {
    if (!window.confirm(`آیا مطمئنید می‌خواهید «${item.name}» را حذف کنید؟`)) return
    const res = await fetch(`/api/admin/cafe-menu/${item.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('آیتم حذف شد'); fetchItems() }
    else toast.error('خطا در حذف آیتم')
  }

  return (
    <div>
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717' }}>مدیریت منوی کافه</h1>
          <p style={{ fontSize: 13, color: '#717171', marginTop: 2 }}>
            {items.length} آیتم در {CATEGORIES.length - 1} دسته‌بندی
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2"
          style={{
            padding: '9px 18px', borderRadius: 8, border: 'none',
            background: '#8B1E1E', color: 'white', fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          افزودن آیتم جدید
        </button>
      </div>

      {/* تب‌های دسته‌بندی */}
      <div
        className="flex gap-2 pb-2 mb-5"
        style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 20,
              fontSize: 13, fontWeight: activeTab === cat ? 700 : 400,
              cursor: 'pointer', transition: 'all 0.15s',
              background: activeTab === cat ? '#8B1E1E' : 'white',
              color:      activeTab === cat ? 'white' : '#404040',
              border:     activeTab === cat ? 'none' : '1px solid #E5E5E5',
            }}
          >
            {cat}
            {cat !== 'همه' && (
              <span style={{
                marginRight: 4, fontSize: 11,
                opacity: activeTab === cat ? 0.8 : 0.5,
              }}>
                ({items.filter((i) => i.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* جدول */}
      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEFEF' }}>
                {['تصویر', 'نام', 'دسته', 'قیمت', 'وضعیت', 'عملیات'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 16px', fontSize: 12,
                      color: '#717171', textAlign: 'right',
                      fontWeight: 600, whiteSpace: 'nowrap',
                    }}
                  >
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
                        <div
                          className="animate-pulse rounded"
                          style={{ height: 16, background: '#F3F4F6', width: j === 0 ? 40 : '70%' }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : displayed.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ padding: '48px 16px', textAlign: 'center', fontSize: 14, color: '#717171' }}
                  >
                    هیچ آیتمی در این دسته وجود ندارد
                  </td>
                </tr>
              ) : (
                displayed.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: '1px solid #EFEFEF' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#FAFAFA' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    {/* تصویر */}
                    <td style={{ padding: '12px 16px' }}>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div style={{
                          width: 40, height: 40, borderRadius: 6,
                          background: '#F3F4F6', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <ImageOff size={16} color="#B0B0B0" />
                        </div>
                      )}
                    </td>

                    {/* نام */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}>{item.name}</span>
                      {item.description && (
                        <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{item.description}</p>
                      )}
                    </td>

                    {/* دسته */}
                    <td style={{ padding: '12px 16px' }}>
                      <CategoryBadge label={item.category} />
                    </td>

                    {/* قیمت */}
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#8B1E1E' }}>
                        {item.price.toLocaleString('fa-IR')} تومان
                      </span>
                    </td>

                    {/* وضعیت */}
                    <td style={{ padding: '12px 16px' }}>
                      <AvailabilityToggle item={item} onToggle={() => toggleAvailability(item)} />
                    </td>

                    {/* عملیات */}
                    <td style={{ padding: '12px 16px' }}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          title="ویرایش"
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '5px 10px', borderRadius: 6,
                            border: '1px solid #E5E5E5', background: 'white',
                            fontSize: 12, color: '#717171', cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#8B1E1E'; e.currentTarget.style.borderColor = '#8B1E1E' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#717171'; e.currentTarget.style.borderColor = '#E5E5E5' }}
                        >
                          <Pencil size={13} />
                          ویرایش
                        </button>
                        <button
                          onClick={() => deleteItem(item)}
                          title="حذف"
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '5px 10px', borderRadius: 6,
                            border: '1px solid #FEE2E2', background: 'white',
                            fontSize: 12, color: '#DC2626', cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'white' }}
                        >
                          <Trash2 size={13} />
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* فوتر جدول */}
        {!loading && displayed.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid #EFEFEF', background: '#FAFAFA' }}>
            <p style={{ fontSize: 12, color: '#9CA3AF' }}>
              نمایش {displayed.length} از {items.length} آیتم
            </p>
          </div>
        )}
      </div>

      <CafeItemModal
        open={modalOpen}
        item={editingItem}
        onClose={() => setModalOpen(false)}
        onSave={() => fetchItems()}
      />
    </div>
  )
}
