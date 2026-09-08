'use client'

import { useEffect, useState } from 'react'
import { Phone, Mail, Check, Plus, Trash2, AlertCircle } from '@/components/ui/icons'
import toast from 'react-hot-toast'

type Channel = 'SMS' | 'EMAIL'

type Target = {
  id?:      string
  channel:  Channel
  value:    string
  label:    string
  isActive: boolean
  /** کلید موقت برای ردیف‌های تازه‌ای که هنوز ذخیره نشده‌اند */
  tempKey?: string
}

/** ارقام فارسی/عربی را به لاتین تبدیل می‌کند تا ادمین بتواند هر جور تایپ کند */
function toEnDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

function rowKey(t: Target) {
  return t.id ?? t.tempKey ?? `${t.channel}-${t.value}`
}

function ActiveToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
        fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'inherit',
        background: active ? '#D1FAE5' : '#F3F4F6',
        color:      active ? '#065F46' : '#6B7280',
        transition: 'all 0.15s',
      }}
    >
      <span style={{
        display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
        background: active ? '#10B981' : '#9CA3AF',
      }} />
      {active ? 'فعال' : 'غیرفعال'}
    </button>
  )
}

function ReadyBadge({ ready, text }: { ready: boolean; text: string }) {
  if (ready) return null
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 6, background: '#FEF3C7',
      color: '#92400E', fontSize: 11, fontWeight: 600,
    }}>
      <AlertCircle size={12} color="#92400E" />
      {text}
    </span>
  )
}

export default function AdminNotificationsPage() {
  const [targets, setTargets] = useState<Target[]>([])
  const [smsReady,   setSmsReady]   = useState(true)
  const [emailReady, setEmailReady] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    async function fetchTargets() {
      try {
        const res  = await fetch('/api/admin/notify-targets')
        const data = await res.json()
        setTargets(Array.isArray(data?.targets) ? data.targets : [])
        setSmsReady(data?.smsReady !== false)
        setEmailReady(data?.emailReady !== false)
      } catch {
        toast.error('خطا در بارگذاری مقصدها')
      } finally {
        setLoading(false)
      }
    }
    fetchTargets()
  }, [])

  function addTarget(channel: Channel) {
    setTargets((prev) => [
      ...prev,
      { channel, value: '', label: '', isActive: true, tempKey: `tmp-${Date.now()}-${Math.random()}` },
    ])
  }

  function updateTarget(key: string, patch: Partial<Target>) {
    setTargets((prev) => prev.map((t) => (rowKey(t) === key ? { ...t, ...patch } : t)))
  }

  function removeTarget(key: string) {
    setTargets((prev) => prev.filter((t) => rowKey(t) !== key))
  }

  async function save() {
    const filled = targets.filter((t) => t.value.trim() !== '')

    const badPhone = filled.find((t) => t.channel === 'SMS' && !/^0\d{10}$/.test(t.value.trim()))
    if (badPhone) {
      toast.error(`شماره «${badPhone.value}» باید ۱۱ رقم و با ۰ شروع شود`)
      return
    }
    const badEmail = filled.find(
      (t) => t.channel === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.value.trim()),
    )
    if (badEmail) {
      toast.error(`ایمیل «${badEmail.value}» معتبر نیست`)
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/notify-targets', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ targets: filled }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error ?? 'خطا در ذخیره مقصدها')
        return
      }
      setTargets(Array.isArray(data?.targets) ? data.targets : filled)
      toast.success('مقصدهای اطلاع‌رسانی ذخیره شد')
    } catch {
      toast.error('خطا در ذخیره مقصدها')
    } finally {
      setSaving(false)
    }
  }

  async function sendTest() {
    setTesting(true)
    try {
      const res  = await fetch('/api/admin/notify-targets', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error ?? 'ارسال پیام آزمایشی ناموفق بود')
        return
      }
      toast.success(data?.message ?? 'پیام آزمایشی ارسال شد')
    } catch {
      toast.error('ارسال پیام آزمایشی ناموفق بود')
    } finally {
      setTesting(false)
    }
  }

  const smsTargets   = targets.filter((t) => t.channel === 'SMS')
  const emailTargets = targets.filter((t) => t.channel === 'EMAIL')

  function renderSection(
    channel: Channel,
    rows: Target[],
    title: string,
    hint: string,
    ready: boolean,
    readyText: string,
    Icon: typeof Phone,
    placeholder: string,
  ) {
    return (
      <div style={{ background: 'white', border: '1px solid #EFEFEF', borderRadius: 10, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Icon size={16} color="#801A00" />
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#171717' }}>{title}</h2>
          <ReadyBadge ready={ready} text={readyText} />
        </div>
        <p style={{ fontSize: 12, color: '#A0A0A0', marginBottom: 16 }}>{hint}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map((target) => {
            const key = rowKey(target)
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  value={target.value}
                  onChange={(e) =>
                    updateTarget(key, {
                      value: channel === 'SMS'
                        ? toEnDigits(e.target.value).replace(/[^\d]/g, '')
                        : e.target.value.trim(),
                    })
                  }
                  dir="ltr"
                  inputMode={channel === 'SMS' ? 'numeric' : 'email'}
                  maxLength={channel === 'SMS' ? 11 : 120}
                  placeholder={placeholder}
                  style={{
                    flex: 1, minWidth: 0, padding: '10px 12px', borderRadius: 8,
                    border: '1px solid #E5E5E5', fontSize: 14, color: '#171717',
                    outline: 'none', fontFamily: 'inherit', letterSpacing: '0.02em',
                    background: target.isActive ? 'white' : '#FAFAFA',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#801A00' }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = '#E5E5E5' }}
                />
                <input
                  value={target.label}
                  onChange={(e) => updateTarget(key, { label: e.target.value })}
                  placeholder="برچسب (اختیاری)"
                  style={{
                    width: 130, padding: '10px 12px', borderRadius: 8,
                    border: '1px solid #E5E5E5', fontSize: 13, color: '#404040',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#801A00' }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = '#E5E5E5' }}
                />
                <ActiveToggle
                  active={target.isActive}
                  onToggle={() => updateTarget(key, { isActive: !target.isActive })}
                />
                <button
                  type="button"
                  onClick={() => removeTarget(key)}
                  title="حذف"
                  style={{
                    display: 'flex', alignItems: 'center', padding: 8, borderRadius: 8,
                    border: '1px solid #F0EDE9', background: 'white', cursor: 'pointer',
                  }}
                >
                  <Trash2 size={15} color="#B0B0B0" />
                </button>
              </div>
            )
          })}

          {rows.length === 0 && (
            <p style={{ fontSize: 13, color: '#B0B0B0', padding: '6px 0' }}>
              هنوز مقصدی اضافه نشده است.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => addTarget(channel)}
          style={{
            marginTop: 14, display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8, border: '1px dashed #D5D5D5',
            background: 'white', color: '#801A00', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <Plus size={14} color="#801A00" />
          افزودن
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {/* هدر */}
      <div className="mb-6">
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#171717' }}>اطلاع‌رسانی رزرو</h1>
        <p style={{ fontSize: 13, color: '#717171', marginTop: 2 }}>
          با ثبت هر رزرو پلاتو، درخواست تماس، یا درخواست همکاری هنرمند، به این مقصدها پیام می‌رود
        </p>
      </div>

      {loading ? (
        <p style={{ fontSize: 13, color: '#A0A0A0', padding: '20px 0', textAlign: 'center' }}>
          در حال بارگذاری…
        </p>
      ) : (
        <>
          {renderSection(
            'SMS', smsTargets,
            'پیامک',
            'شماره موبایل‌هایی که پیامک رزرو دریافت می‌کنند',
            smsReady, 'کلید کاوه‌نگار روی سرور تنظیم نشده',
            Phone, '09121234567',
          )}

          {renderSection(
            'EMAIL', emailTargets,
            'ایمیل',
            'ایمیل‌هایی که جزئیات کامل رزرو را دریافت می‌کنند',
            emailReady, 'کلید Resend روی سرور تنظیم نشده',
            Mail, 'admin@deyhouse.com',
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={save}
              disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 8, border: 'none',
                background: saving ? '#C9A0A0' : '#801A00', color: 'white',
                fontSize: 14, fontWeight: 700, cursor: saving ? 'default' : 'pointer',
                fontFamily: 'inherit', transition: 'background 150ms',
              }}
            >
              <Check size={16} color="white" />
              {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
            </button>

            <button
              onClick={sendTest}
              disabled={testing}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 8, border: '1px solid #E5E5E5',
                background: 'white', color: '#404040',
                fontSize: 14, fontWeight: 700, cursor: testing ? 'default' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {testing ? 'در حال ارسال…' : 'ارسال پیام آزمایشی'}
            </button>
          </div>

          <p style={{ fontSize: 12, color: '#A0A0A0', marginTop: 16, lineHeight: 1.9 }}>
            مقصد غیرفعال پیامی دریافت نمی‌کند. اگر ارسال پیام با خطا مواجه شود، ثبت رزرو کاربر
            متوقف نمی‌شود و خطا در لاگ سرور ثبت می‌گردد.
          </p>
        </>
      )}
    </div>
  )
}
