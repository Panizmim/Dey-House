'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2 } from '@/components/ui/icons'
import toast from 'react-hot-toast'
import WorkshopModal, { type WorkshopRow } from '@/components/admin/WorkshopModal'
import DataTable, { type Column } from '@/components/admin/DataTable'

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return <span style={{ background: bg, color, borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{label}</span>
}

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<WorkshopRow[]>([])
  const [loading,   setLoading]   = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem,  setEditItem]  = useState<WorkshopRow | null>(null)

  async function fetchWorkshops() {
    setLoading(true)
    const res  = await fetch('/api/admin/workshops')
    const data = await res.json()
    setWorkshops(data)
    setLoading(false)
  }

  useEffect(() => { fetchWorkshops() }, [])

  function openAdd() { setEditItem(null); setModalOpen(true) }
  function openEdit(w: WorkshopRow) { setEditItem(w); setModalOpen(true) }

  async function deleteWorkshop(w: WorkshopRow) {
    if (!window.confirm(`آیا مطمئن هستید که می‌خواهید ورکشاپ «${w.title}» را حذف کنید؟`)) return
    const res = await fetch(`/api/admin/workshops/${w.id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('ورکشاپ حذف شد'); fetchWorkshops() }
    else toast.error('خطا در حذف ورکشاپ')
  }

  const columns: Column<WorkshopRow>[] = [
    {
      key: 'title',
      label: 'ورکشاپ',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.imageUrl && (
            <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
              <Image src={row.imageUrl} alt={row.title} fill className="object-cover" />
            </div>
          )}
          <span style={{ fontWeight: 600 }}>{row.title}</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'تاریخ برگزاری',
      render: (row) => new Date(row.date).toLocaleDateString('fa-IR'),
    },
    {
      key: 'description',
      label: 'توضیحات',
      render: (row) => (
        <span style={{ color: '#717171', fontSize: 13 }}>
          {row.description ? row.description.slice(0, 60) + (row.description.length > 60 ? '...' : '') : '—'}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'وضعیت',
      render: (row) => row.isActive
        ? <Badge label="فعال"     bg="#D1FAE5" color="#065F46" />
        : <Badge label="غیرفعال" bg="#FEF3C7" color="#92400E" />,
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: '1px solid #E5E5E5', background: 'white', fontSize: 13, cursor: 'pointer' }}
          >
            <Pencil size={13} />
            ویرایش
          </button>
          <button
            onClick={() => deleteWorkshop(row)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: 13, cursor: 'pointer' }}
          >
            <Trash2 size={13} />
            حذف
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717' }}>ورکشاپ‌ها</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2"
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#801A00', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={16} />
          افزودن ورکشاپ جدید
        </button>
      </div>

      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 8, overflow: 'hidden' }}>
        <DataTable columns={columns} data={workshops} loading={loading} emptyMessage="هیچ ورکشاپی ثبت نشده" />
      </div>

      <WorkshopModal
        open={modalOpen}
        workshop={editItem}
        onClose={() => setModalOpen(false)}
        onSaved={() => fetchWorkshops()}
      />
    </div>
  )
}
