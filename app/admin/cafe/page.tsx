'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '@/components/admin/Modal'

type MenuItem = { id: string; name: string; price: number; category: string; isAvailable: boolean; description: string | null }

const CATEGORIES = [
  'نوشیدنی گرم بر پایه اسپرسو', 'نوشیدنی سرد بر پایه اسپرسو', 'چای و دمنوش',
  'نوشیدنی گرم', 'نوشیدنی سرد', 'نوشیدنی ساده',
  'میان وعده', 'سالاد', 'ساندویچ', 'پاستا', 'بشقاب', 'تاپینگ',
]

export default function AdminCafePage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [items, setItems]                   = useState<MenuItem[]>([])
  const [loading, setLoading]               = useState(true)
  const [editingPrice, setEditingPrice]     = useState<Record<string, string>>({})
  const [addModal, setAddModal]             = useState(false)
  const [addForm, setAddForm]               = useState({ name: '', price: '', description: '' })
  const [saving, setSaving]                 = useState(false)

  async function fetchItems() {
    setLoading(true)
    const res  = await fetch('/api/admin/cafe-menu')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const categoryItems = items.filter((i) => i.category === activeCategory)

  async function savePrice(id: string) {
    const raw = editingPrice[id]
    if (!raw) return
    const price = parseInt(raw, 10)
    if (isNaN(price)) { toast.error('قیمت نامعتبر'); return }
    const res = await fetch(`/api/admin/cafe-menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price }),
    })
    if (res.ok) {
      toast.success('قیمت ذخیره شد')
      setEditingPrice((p) => { const n = { ...p }; delete n[id]; return n })
      fetchItems()
    } else {
      toast.error('خطا در ذخیره')
    }
  }

  async function toggleAvailability(item: MenuItem) {
    const res = await fetch(`/api/admin/cafe-menu/${item.id}/toggle`, { method: 'PATCH' })
    if (res.ok) { toast.success('وضعیت بروز شد'); fetchItems() }
    else toast.error('خطا')
  }

  async function deleteItem(id: string) {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این آیتم را حذف کنید؟')) return
    const res = await fetch(`/api/admin/cafe-menu/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('آیتم حذف شد'); fetchItems() }
    else toast.error('خطا در حذف')
  }

  async function addItem() {
    if (!addForm.name || !addForm.price) { toast.error('نام و قیمت الزامی هستند'); return }
    setSaving(true)
    const res = await fetch('/api/admin/cafe-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: addForm.name, price: parseInt(addForm.price, 10), category: activeCategory, description: addForm.description || null }),
    })
    setSaving(false)
    if (res.ok) {
      toast.success('آیتم اضافه شد')
      setAddModal(false)
      setAddForm({ name: '', price: '', description: '' })
      fetchItems()
    } else {
      toast.error('خطا در افزودن')
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717', marginBottom: 20 }}>منوی کافه</h1>

      {/* تب‌های دسته‌بندی */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: activeCategory === cat ? '#8B1E1E' : 'white',
              color: activeCategory === cat ? 'white' : '#404040',
              border: activeCategory === cat ? 'none' : '1px solid #EFEFEF',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* جدول آیتم‌ها */}
      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEFEF' }}>
                {['نام', 'قیمت (تومان)', 'وضعیت', 'عملیات'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 12, color: '#717171', textAlign: 'right', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #EFEFEF' }}>
                    {[1,2,3,4].map((j) => (
                      <td key={j} style={{ padding: '12px 16px' }}>
                        <div className="animate-pulse rounded" style={{ height: 16, background: '#F3F4F6', width: '70%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : categoryItems.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', fontSize: 14, color: '#717171' }}>هیچ آیتمی در این دسته وجود ندارد</td></tr>
              ) : (
                categoryItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #EFEFEF' }}>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#171717' }}>{item.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {editingPrice[item.id] !== undefined ? (
                        <input
                          type="number"
                          value={editingPrice[item.id]}
                          onChange={(e) => setEditingPrice((p) => ({ ...p, [item.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && savePrice(item.id)}
                          onBlur={() => savePrice(item.id)}
                          style={{ width: 120, padding: '4px 8px', borderRadius: 6, border: '1px solid #8B1E1E', fontSize: 14, outline: 'none' }}
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => setEditingPrice((p) => ({ ...p, [item.id]: String(item.price) }))}
                          style={{ cursor: 'pointer', fontSize: 14, color: '#171717', textDecoration: 'underline dotted' }}
                          title="کلیک برای ویرایش"
                        >
                          {item.price.toLocaleString('fa-IR')}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => toggleAvailability(item)}
                        style={{
                          padding: '4px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          background: item.isAvailable ? '#D1FAE5' : '#F3F4F6',
                          color:      item.isAvailable ? '#065F46' : '#6B7280',
                        }}
                      >
                        {item.isAvailable ? 'موجود' : 'ناموجود'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="flex items-center gap-1"
                        style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #FEE2E2', background: 'white', color: '#DC2626', fontSize: 13, cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={() => setAddModal(true)}
        className="flex items-center gap-2"
        style={{ padding: '8px 16px', borderRadius: 8, border: '1px dashed #8B1E1E', background: 'white', color: '#8B1E1E', fontSize: 14, cursor: 'pointer' }}
      >
        <Plus size={16} />
        افزودن آیتم به {activeCategory}
      </button>

      {/* Modal افزودن */}
      <Modal
        open={addModal}
        title="افزودن آیتم جدید"
        onClose={() => setAddModal(false)}
        footer={
          <>
            <button onClick={() => setAddModal(false)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #E5E5E5', background: 'white', fontSize: 14, cursor: 'pointer' }}>انصراف</button>
            <button onClick={addItem} disabled={saving} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#8B1E1E', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'در حال ذخیره...' : 'افزودن'}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#404040', marginBottom: 6 }}>نام آیتم *</label>
            <input className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="مثال: اسپرسو" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#404040', marginBottom: 6 }}>قیمت (تومان) *</label>
            <input type="number" className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm" value={addForm.price} onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))} placeholder="مثال: 225000" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#404040', marginBottom: 6 }}>توضیح (اختیاری)</label>
            <input className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm" value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))} placeholder="توضیح کوتاه" />
          </div>
          <p style={{ fontSize: 12, color: '#717171' }}>دسته‌بندی: {activeCategory}</p>
        </div>
      </Modal>
    </div>
  )
}
