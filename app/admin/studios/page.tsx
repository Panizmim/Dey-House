'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Pencil, ImageOff, Users } from '@/components/ui/icons'
import toast from 'react-hot-toast'
import StudioModal, { type Studio } from '@/components/admin/StudioModal'

function ActiveToggle({ studio, onToggle }: { studio: Studio; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
        fontSize: 12, fontWeight: 600,
        background: studio.isActive ? '#D1FAE5' : '#F3F4F6',
        color:      studio.isActive ? '#065F46' : '#6B7280',
        transition: 'all 0.15s',
      }}
    >
      <span style={{
        display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
        background: studio.isActive ? '#10B981' : '#9CA3AF',
      }} />
      {studio.isActive ? 'فعال' : 'غیرفعال'}
    </button>
  )
}

export default function AdminStudiosPage() {
  const [studios,       setStudios]       = useState<Studio[]>([])
  const [loading,       setLoading]       = useState(true)
  const [modalOpen,     setModalOpen]     = useState(false)
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null)

  async function fetchStudios() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/studios')
      const data = await res.json()
      setStudios(Array.isArray(data) ? data : [])
    } catch {
      toast.error('خطا در بارگذاری پلاتوها')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudios() }, [])

  async function toggleActive(studio: Studio) {
    const res = await fetch(`/api/admin/studios/${studio.id}/toggle`, { method: 'PATCH' })
    if (res.ok) fetchStudios()
    else toast.error('خطا در تغییر وضعیت')
  }

  return (
    <div>
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717' }}>مدیریت پلاتوها</h1>
          <p style={{ fontSize: 13, color: '#717171', marginTop: 2 }}>
            {studios.length} پلاتو — قیمت و گالری تصاویر از همین‌جا قابل ویرایش است
          </p>
        </div>
      </div>

      {/* جدول */}
      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEFEF' }}>
                {['تصویر', 'نام', 'ظرفیت', 'قیمت (ساعتی)', 'وضعیت', 'عملیات'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 12, color: '#717171', textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #EFEFEF' }}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} style={{ padding: '14px 16px' }}>
                        <div className="animate-pulse rounded" style={{ height: 16, background: '#F3F4F6', width: j === 0 ? 40 : '70%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : studios.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center', fontSize: 14, color: '#717171' }}>
                    پلاتویی یافت نشد
                  </td>
                </tr>
              ) : (
                studios.map((studio) => (
                  <tr
                    key={studio.id}
                    style={{ borderBottom: '1px solid #EFEFEF' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#FAFAFA' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      {studio.images[0] ? (
                        <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 6, overflow: 'hidden' }}>
                          <Image src={studio.images[0]} alt={studio.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div style={{ width: 40, height: 40, borderRadius: 6, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageOff size={16} color="#B0B0B0" />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}>{studio.name}</span>
                      {studio.description && <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{studio.description}</p>}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span className="flex items-center gap-1" style={{ fontSize: 13, color: '#404040' }}>
                        <Users size={13} color="#A0A0A0" />
                        {studio.capacity.toLocaleString('fa-IR')} نفر
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#801A00' }}>
                        {studio.pricePerHour.toLocaleString('fa-IR')} تومان
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <ActiveToggle studio={studio} onToggle={() => toggleActive(studio)} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => { setEditingStudio(studio); setModalOpen(true) }}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 6, border: '1px solid #E5E5E5', background: 'white', fontSize: 12, color: '#717171', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#801A00'; e.currentTarget.style.borderColor = '#801A00' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#717171'; e.currentTarget.style.borderColor = '#E5E5E5' }}
                      >
                        <Pencil size={13} /> ویرایش
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && studios.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid #EFEFEF', background: '#FAFAFA' }}>
            <p style={{ fontSize: 12, color: '#9CA3AF' }}>نمایش {studios.length} پلاتو</p>
          </div>
        )}
      </div>

      {modalOpen && editingStudio && (
        <StudioModal
          open={modalOpen}
          studio={editingStudio}
          onClose={() => setModalOpen(false)}
          onSave={fetchStudios}
        />
      )}
    </div>
  )
}
