'use client'

import { useEffect, useState } from 'react'
import { Phone, Check } from '@/components/ui/icons'
import toast from 'react-hot-toast'

type SitePhone = {
  key:       string
  label:     string
  number:    string
  isVisible: boolean
}

/** ارقام فارسی/عربی را به لاتین تبدیل می‌کند تا ادمین بتواند هر جور تایپ کند */
function toEnDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

function VisibilityToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
        fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
        background: visible ? '#D1FAE5' : '#F3F4F6',
        color:      visible ? '#065F46' : '#6B7280',
        transition: 'all 0.15s',
      }}
    >
      <span style={{
        display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
        background: visible ? '#10B981' : '#9CA3AF',
      }} />
      {visible ? 'نمایش در سایت' : 'مخفی'}
    </button>
  )
}

export default function AdminSettingsPage() {
  const [phones,  setPhones]  = useState<SitePhone[]>([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    async function fetchPhones() {
      try {
        const res  = await fetch('/api/admin/site-phones')
        const data = await res.json()
        setPhones(Array.isArray(data) ? data : [])
      } catch {
        toast.error('خطا در بارگذاری شماره‌ها')
      } finally {
        setLoading(false)
      }
    }
    fetchPhones()
  }, [])

  function updatePhone(key: string, patch: Partial<SitePhone>) {
    setPhones((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch } : p)))
  }

  async function save() {
    const invalid = phones.find((p) => p.number.trim() !== '' && !/^0\d{10}$/.test(p.number.trim()))
    if (invalid) {
      toast.error(`شماره «${invalid.label}» باید ۱۱ رقم و با ۰ شروع شود`)
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/site-phones', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phones }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error ?? 'خطا در ذخیره شماره‌ها')
        return
      }
      setPhones(Array.isArray(data) ? data : phones)
      toast.success('شماره‌های تماس ذخیره شد')
    } catch {
      toast.error('خطا در ذخیره شماره‌ها')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {/* هدر */}
      <div className="mb-6">
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717' }}>شماره‌های تماس</h1>
        <p style={{ fontSize: 13, color: '#717171', marginTop: 2 }}>
          این شماره‌ها در فوتر سایت و صفحه «تماس با ما» نمایش داده می‌شوند
        </p>
      </div>

      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 10, padding: 20 }}>
        {loading ? (
          <p style={{ fontSize: 13, color: '#A0A0A0', padding: '20px 0', textAlign: 'center' }}>
            در حال بارگذاری…
          </p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {phones.map((phone) => (
                <div key={phone.key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#404040', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Phone size={15} color="#A0A0A0" />
                      {phone.label}
                    </label>
                    <VisibilityToggle
                      visible={phone.isVisible}
                      onToggle={() => updatePhone(phone.key, { isVisible: !phone.isVisible })}
                    />
                  </div>
                  <input
                    value={phone.number}
                    onChange={(e) => updatePhone(phone.key, { number: toEnDigits(e.target.value).replace(/[^\d]/g, '') })}
                    dir="ltr"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="09020282145"
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8,
                      border: '1px solid #E5E5E5', fontSize: 14, color: '#171717',
                      outline: 'none', fontFamily: 'inherit', letterSpacing: '0.02em',
                      background: phone.isVisible ? 'white' : '#FAFAFA',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#801A00' }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = '#E5E5E5' }}
                  />
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, color: '#A0A0A0', marginTop: 16, lineHeight: 1.8 }}>
              شماره خالی یا مخفی، در سایت نمایش داده نمی‌شود.
            </p>

            <button
              onClick={save}
              disabled={saving}
              style={{
                marginTop: 20, display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 8, border: 'none',
                background: saving ? '#C9A0A0' : '#801A00', color: 'white',
                fontSize: 14, fontWeight: 700, cursor: saving ? 'default' : 'pointer',
                fontFamily: 'inherit', transition: 'background 150ms',
              }}
            >
              <Check size={16} color="white" />
              {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
