'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Archive, ArchiveRestore } from '@/components/ui/icons'
import toast from 'react-hot-toast'
import EventModal, { type EventRow } from '@/components/admin/EventModal'
import DataTable, { type Column } from '@/components/admin/DataTable'

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return <span style={{ background: bg, color, borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{label}</span>
}

export default function AdminEventsPage() {
  const [events, setEvents]       = useState<EventRow[]>([])
  const [loading, setLoading]     = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<EventRow | null>(null)

  async function fetchEvents() {
    setLoading(true)
    const res  = await fetch('/api/admin/events')
    const data = await res.json()
    setEvents(data)
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  function openAdd() {
    setEditEvent(null)
    setModalOpen(true)
  }

  function openEdit(event: EventRow) {
    setEditEvent(event)
    setModalOpen(true)
  }

  async function toggleArchive(event: EventRow) {
    const action = event.isArchived ? 'فعال‌سازی' : 'آرشیو'
    if (!window.confirm(`آیا مطمئن هستید که می‌خواهید این رویداد را ${action} کنید؟`)) return
    const res = await fetch(`/api/admin/events/${event.id}/archive`, { method: 'PATCH' })
    if (res.ok) { toast.success(`رویداد ${action} شد`); fetchEvents() }
    else toast.error('خطا در عملیات')
  }

  const columns: Column<EventRow>[] = [
    {
      key: 'title',
      label: 'رویداد',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.imageUrl && (
            <img
              src={row.imageUrl}
              alt={row.title}
              style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
            />
          )}
          <span style={{ fontWeight: 600 }}>{row.title}</span>
        </div>
      ),
    },
    { key: 'type', label: 'نوع' },
    {
      key: 'date',
      label: 'تاریخ',
      render: (row) => new Date(row.date).toLocaleDateString('fa-IR'),
    },
    { key: 'location', label: 'مکان', render: (row) => row.location ?? '—' },
    {
      key: 'isArchived',
      label: 'وضعیت',
      render: (row) => row.isArchived
        ? <Badge label="آرشیو" bg="#F3F4F6" color="#6B7280" />
        : <Badge label="فعال"  bg="#D1FAE5" color="#065F46" />,
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
            onClick={() => toggleArchive(row)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: '1px solid #E5E5E5', background: 'white', fontSize: 13, cursor: 'pointer' }}
          >
            {row.isArchived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
            {row.isArchived ? 'فعال‌سازی' : 'آرشیو'}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717' }}>رویدادها</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2"
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#8B1E1E', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={16} />
          افزودن رویداد جدید
        </button>
      </div>

      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 8, overflow: 'hidden' }}>
        <DataTable columns={columns} data={events} loading={loading} emptyMessage="هیچ رویدادی ثبت نشده" />
      </div>

      <EventModal
        open={modalOpen}
        event={editEvent}
        onClose={() => setModalOpen(false)}
        onSaved={() => fetchEvents()}
      />
    </div>
  )
}
