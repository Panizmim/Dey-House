'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, X, ImagePlus } from '@/components/ui/icons'
import toast from 'react-hot-toast'

type HeroBanner = {
  id:       string
  imageUrl: string
  showText: boolean
  order:    number
  isActive: boolean
}

const BANNER_SIZE_HINT = '۱۹۲۰ × ۱۰۸۰ پیکسل — نسبت ۱۶:۹'

/* ─── Add Modal ─── */
function AddModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [file,     setFile]     = useState<File | null>(null)
  const [preview,  setPreview]  = useState<string | null>(null)
  const [showText, setShowText] = useState(true)
  const [saving,   setSaving]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File) {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSave() {
    if (!file) { toast.error('لطفاً یک تصویر انتخاب کنید'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'hero')
      toast.loading('در حال آپلود تصویر...', { id: 'hero-upload' })
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      toast.dismiss('hero-upload')
      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}))
        throw new Error((errData as { error?: string }).error || 'خطا در آپلود تصویر')
      }
      const { url } = await uploadRes.json()

      const res = await fetch('/api/admin/hero-banners', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ imageUrl: url, showText }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error || 'خطا در ذخیره')
      }
      toast.success('بنر اضافه شد')
      onSaved()
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'خطا در ذخیره')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#171717' }}>افزودن بنر هیرو</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#717171' }}>
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* آپلود تصویر */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label style={{ fontSize: 13, fontWeight: 600, color: '#404040' }}>تصویر بنر *</label>
              <span style={{ fontSize: 11, color: '#801A00', background: '#FDF5F5', padding: '2px 8px', borderRadius: 4 }}>
                {BANNER_SIZE_HINT}
              </span>
            </div>

            {preview ? (
              <div style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8 }} />
                <button
                  onClick={() => { setFile(null); setPreview(null) }}
                  style={{
                    position: 'absolute', top: 8, left: 8,
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.55)', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={14} color="white" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => inputRef.current?.click()}
                style={{
                  border: '1px dashed #E5E5E5', borderRadius: 8,
                  aspectRatio: '16/9', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#801A00'; e.currentTarget.style.background = '#FAFAFA' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.background = 'white' }}
              >
                <ImagePlus size={28} color="#B0B0B0" />
                <p style={{ fontSize: 13, color: '#717171', margin: 0 }}>انتخاب تصویر</p>
                <p style={{ fontSize: 11, color: '#B0B0B0', margin: 0 }}>{BANNER_SIZE_HINT}</p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*,.heic,.heif,.heics"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
            />
          </div>

          {/* حالت نمایش متن */}
          <div
            onClick={() => setShowText((v) => !v)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderRadius: 10,
              border: `1px solid ${showText ? '#801A00' : '#E5E5E5'}`,
              background: showText ? '#FDF5F5' : 'white',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: showText ? '#801A00' : '#404040', margin: 0 }}>
                {showText ? 'نمایش متن روی عکس' : 'فقط عکس (بدون متن)'}
              </p>
              <p style={{ fontSize: 11, color: '#A0A0A0', margin: '2px 0 0' }}>
                {showText
                  ? 'شعر «بَرای زندگیِ تازه‌ای کِه هَنوز نَزیستهِ‌ایم.» روی عکس نمایش داده می‌شود'
                  : 'فقط عکس آپلودشده نمایش داده می‌شود'}
              </p>
            </div>
            {/* toggle */}
            <div style={{
              width: 40, height: 22, borderRadius: 11,
              background: showText ? '#801A00' : '#D0D0D0',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 3,
                left: showText ? 20 : 3,
                width: 16, height: 16, borderRadius: '50%',
                background: 'white', transition: 'left 0.2s',
              }} />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#F0F0F0] flex justify-end gap-3">
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #E5E5E5', background: 'white', fontSize: 13, cursor: 'pointer' }}>
            انصراف
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !file}
            style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#801A00', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: (saving || !file) ? 0.5 : 1 }}
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ─── */
export default function AdminHeroPage() {
  const [banners,     setBanners]     = useState<HeroBanner[]>([])
  const [loading,     setLoading]     = useState(true)
  const [modalOpen,   setModalOpen]   = useState(false)

  async function fetchBanners() {
    setLoading(true)
    const res  = await fetch('/api/admin/hero-banners')
    const data = await res.json()
    setBanners(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchBanners() }, [])

  async function handleDelete(id: string) {
    if (!window.confirm('آیا از حذف این بنر مطمئن هستید؟')) return
    const res = await fetch(`/api/admin/hero-banners/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('بنر حذف شد'); fetchBanners() }
    else toast.error('خطا در حذف')
  }

  async function toggleField(id: string, field: 'showText' | 'isActive', current: boolean) {
    const res = await fetch(`/api/admin/hero-banners/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ [field]: !current }),
    })
    if (res.ok) fetchBanners()
    else toast.error('خطا در بروزرسانی')
  }

  return (
    <div dir="rtl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717', marginBottom: 4 }}>هیرو سکشن</h1>
          <p style={{ fontSize: 13, color: '#717171' }}>
            بنرهای اسلایدر صفحه اصلی را مدیریت کنید —{' '}
            <span style={{ color: '#801A00', fontWeight: 600 }}>سایز توصیه‌شده: {BANNER_SIZE_HINT}</span>
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2"
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#801A00', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <Plus size={16} />
          افزودن بنر
        </button>
      </div>

      {/* راهنما */}
      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#92400E' }}>
        ۱. بنرها به ترتیب افزودن نمایش داده می‌شوند. &nbsp;|&nbsp;
        ۲. حالت «با متن» شعر صفحه اصلی را روی عکس نمایش می‌دهد. &nbsp;|&nbsp;
        ۳. بنرهای غیرفعال در سایت نمایش داده نمی‌شوند.
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg" style={{ aspectRatio: '16/9', background: '#F3F4F6' }} />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#A0A0A0', fontSize: 14 }}>
          هیچ بنری ثبت نشده — از دکمه «افزودن بنر» استفاده کنید
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              style={{
                border: '1px solid #EFEFEF',
                borderRadius: 10,
                overflow: 'hidden',
                background: 'white',
                opacity: banner.isActive ? 1 : 0.55,
              }}
            >
              {/* تصویر */}
              <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                <Image src={banner.imageUrl} alt="" fill className="object-cover" />
                {/* badge حالت */}
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: banner.showText ? 'rgba(139,30,30,0.85)' : 'rgba(0,0,0,0.65)',
                  color: 'white', fontSize: 11, fontWeight: 600,
                  padding: '3px 8px', borderRadius: 4,
                }}>
                  {banner.showText ? 'با متن' : 'بدون متن'}
                </div>
                {!banner.isActive && (
                  <div style={{
                    position: 'absolute', top: 8, left: 8,
                    background: 'rgba(0,0,0,0.6)', color: '#FCA5A5',
                    fontSize: 11, fontWeight: 600,
                    padding: '3px 8px', borderRadius: 4,
                  }}>
                    غیرفعال
                  </div>
                )}
              </div>

              {/* اکشن‌ها */}
              <div className="flex items-center gap-2 px-3 py-2 flex-wrap">
                {/* تاگل با/بدون متن */}
                <button
                  onClick={() => toggleField(banner.id, 'showText', banner.showText)}
                  style={{
                    flex: 1, minWidth: 80,
                    padding: '5px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    border: '1px solid #E5E5E5', background: banner.showText ? '#FDF5F5' : 'white',
                    color: banner.showText ? '#801A00' : '#717171',
                  }}
                >
                  {banner.showText ? 'با متن ✓' : 'بدون متن'}
                </button>

                {/* تاگل فعال/غیرفعال */}
                <button
                  onClick={() => toggleField(banner.id, 'isActive', banner.isActive)}
                  style={{
                    flex: 1, minWidth: 80,
                    padding: '5px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    border: '1px solid #E5E5E5', background: banner.isActive ? '#F0FDF4' : 'white',
                    color: banner.isActive ? '#15803D' : '#717171',
                  }}
                >
                  {banner.isActive ? 'فعال ✓' : 'غیرفعال'}
                </button>

                {/* حذف */}
                <button
                  onClick={() => handleDelete(banner.id)}
                  style={{
                    padding: '5px 8px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                    border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#DC2626',
                    display: 'flex', alignItems: 'center', gap: 3,
                  }}
                >
                  <Trash2 size={12} /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <AddModal
          onClose={() => setModalOpen(false)}
          onSaved={fetchBanners}
        />
      )}
    </div>
  )
}
