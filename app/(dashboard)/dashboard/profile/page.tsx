'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Pencil, Eye, EyeOff, Lock, User, Phone, Mail } from '@/components/ui/icons'
import toast from 'react-hot-toast'

/* ────────────────────────────── helpers ───────────────────────────────── */

function Field({
  label, icon, value, onChange, disabled, type = 'text', dir, placeholder,
}: {
  label: string
  icon: React.ReactNode
  value: string
  onChange?: (v: string) => void
  disabled?: boolean
  type?: string
  dir?: 'ltr' | 'rtl'
  placeholder?: string
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, color: '#717171', marginBottom: 6, fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)',
          color: '#A0A0A0', display: 'flex', pointerEvents: 'none',
        }}>
          {icon}
        </span>
        <input
          type={type}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          style={{
            width: '100%', border: '1px solid #E5E5E5', borderRadius: 12,
            padding: '12px 44px 12px 16px', fontSize: 14, color: disabled ? '#A0A0A0' : '#171717',
            background: disabled ? '#FAFAFA' : 'white',
            outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms',
            fontFamily: 'YekanBakh, Tahoma, sans-serif',
          }}
          onFocus={(e) => { if (!disabled) e.currentTarget.style.borderColor = '#801A00' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5' }}
        />
      </div>
    </div>
  )
}

function PasswordField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, color: '#717171', marginBottom: 6, fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)', color: '#A0A0A0', display: 'flex', pointerEvents: 'none' }}>
          <Lock size={16} />
        </span>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir="ltr"
          style={{
            width: '100%', border: '1px solid #E5E5E5', borderRadius: 12,
            padding: '12px 44px', fontSize: 14, color: '#171717',
            background: 'white', outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 150ms', fontFamily: 'monospace',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#801A00' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5' }}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          style={{
            position: 'absolute', top: '50%', left: 14, transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#A0A0A0', display: 'flex', padding: 0,
          }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

/* ────────────────────────────── page ─────────────────────────────────── */

export default function ProfilePage() {
  const { data: session, update } = useSession()

  /* اطلاعات پایه */
  const [editing,  setEditing]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [name,     setName]     = useState('')
  const [phone,    setPhone]    = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile,    setAvatarFile]    = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  /* تغییر رمز */
  const [pwSaving,  setPwSaving]  = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw,     setNewPw]     = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  useEffect(() => {
    if (session?.user) {
      setName((session.user as { name?: string | null }).name ?? '')
      setPhone((session.user as { phone?: string }).phone ?? '')
    }
  }, [session])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('حجم تصویر نباید بیشتر از ۲MB باشد'); return }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSaveProfile() {
    setSaving(true)
    try {
      let imageUrl: string | null = (session?.user?.image as string | null | undefined) ?? null

      if (avatarFile) {
        const fd = new FormData()
        fd.append('file', avatarFile)
        const up = await fetch('/api/user/upload', { method: 'POST', body: fd })
        if (!up.ok) {
          const err = await up.json().catch(() => ({}))
          toast.error(err.error ?? 'خطا در آپلود تصویر')
          return
        }
        const data = await up.json()
        imageUrl = data.url
      }

      const res = await fetch('/api/user/profile', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:  name.trim() || session?.user?.name,
          phone: phone || undefined,
          image: imageUrl,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error ?? 'خطا در ذخیره اطلاعات')
        return
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          name:  name.trim() || session?.user?.name,
          image: imageUrl,
        },
      })

      toast.success('اطلاعات با موفقیت ذخیره شد')
      setAvatarFile(null)
      setEditing(false)
    } catch (err) {
      console.error('Save error:', err)
      toast.error('خطای غیرمنتظره. دوباره تلاش کنید')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword() {
    if (!currentPw) { toast.error('رمز فعلی را وارد کنید'); return }
    if (newPw.length < 8) { toast.error('رمز جدید باید حداقل ۸ کاراکتر باشد'); return }
    if (newPw !== confirmPw) { toast.error('تکرار رمز مطابقت ندارد'); return }

    setPwSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      if (res.ok) {
        toast.success('رمز عبور با موفقیت تغییر کرد')
        setCurrentPw(''); setNewPw(''); setConfirmPw('')
      } else {
        const j = await res.json().catch(() => ({}))
        toast.error(j.error ?? 'خطا در تغییر رمز')
      }
    } finally {
      setPwSaving(false)
    }
  }

  const initials  = session?.user?.name?.[0] ?? 'U'
  const avatarSrc = avatarPreview ?? (session?.user?.image || null)
  const firstName = name.split(' ')[0] ?? ''
  const lastName  = name.split(' ').slice(1).join(' ') ?? ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ─── کارت اطلاعات پایه ─── */}
      <div style={{ background: 'white', borderRadius: 16, padding: 28 }}>

        {/* header کارت */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #F0F0F0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* آواتار */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt="آواتار"
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: '#801A00', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 700,
                }}>
                  {initials}
                </div>
              )}
              {editing && (
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    position: 'absolute', bottom: 0, left: 0,
                    width: 24, height: 24, borderRadius: '50%',
                    background: '#171717', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Pencil size={12} color="white" />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </div>

            <div>
              <p style={{ fontSize: 16, fontWeight: 900, color: '#171717' }}>
                سلام {firstName}،
              </p>
              <p style={{ fontSize: 13, color: '#A0A0A0' }}>اطلاعات پروفایل شما اینجاست</p>
            </div>
          </div>

          <button
            onClick={() => { if (editing) handleSaveProfile(); else setEditing(true) }}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600,
              padding: editing ? '9px 20px' : '9px 16px',
              borderRadius: 8,
              background: editing ? '#801A00' : 'transparent',
              color: editing ? 'white' : '#717171',
              border: editing ? 'none' : 'none',
              cursor: saving ? 'wait' : 'pointer',
              transition: 'all 150ms',
              fontFamily: 'YekanBakh, Tahoma, sans-serif',
            }}
          >
            {saving ? 'در حال ذخیره...' : editing ? 'ذخیره تغییرات' : (
              <><Pencil size={15} /> ویرایش</>
            )}
          </button>
        </div>

        {/* فرم دو ستونه */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
          <Field
            label="نام"
            icon={<User size={16} />}
            value={firstName}
            onChange={(v) => setName(v + (lastName ? ' ' + lastName : ''))}
            disabled={!editing}
          />
          <Field
            label="نام خانوادگی"
            icon={<User size={16} />}
            value={lastName}
            onChange={(v) => setName(firstName + (v ? ' ' + v : ''))}
            disabled={!editing}
          />
          <Field
            label="ایمیل"
            icon={<Mail size={16} />}
            value={session?.user?.email ?? ''}
            disabled
            dir="ltr"
          />
          <Field
            label="شماره موبایل"
            icon={<Phone size={16} />}
            value={phone}
            onChange={setPhone}
            disabled={!editing}
            dir="ltr"
            placeholder="09120000000"
          />
        </div>

        {editing && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
            <button
              onClick={() => { setEditing(false); setAvatarFile(null); setAvatarPreview(null) }}
              style={{
                padding: '10px 20px', background: 'transparent',
                border: '1px solid #E5E5E5', borderRadius: 10,
                fontSize: 13, color: '#717171', cursor: 'pointer',
                fontFamily: 'YekanBakh, Tahoma, sans-serif',
              }}
            >
              انصراف
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              style={{
                padding: '10px 28px', background: '#801A00',
                border: 'none', borderRadius: 10,
                fontSize: 13, fontWeight: 700, color: 'white',
                cursor: saving ? 'wait' : 'pointer',
                fontFamily: 'YekanBakh, Tahoma, sans-serif',
              }}
            >
              {saving ? 'در حال ذخیره...' : 'ذخیره'}
            </button>
          </div>
        )}
      </div>

      {/* ─── کارت تغییر رمز عبور ─── */}
      <div style={{ background: 'white', borderRadius: 16, padding: 28 }}>
        <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F0F0F0' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#171717' }}>تغییر رمز عبور</h2>
          <p style={{ fontSize: 13, color: '#A0A0A0', marginTop: 4 }}>
            برای امنیت بیشتر رمز قوی انتخاب کنید
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 24px', marginBottom: 20 }}>
          <PasswordField
            label="رمز فعلی"
            value={currentPw}
            onChange={setCurrentPw}
            placeholder="رمز فعلی"
          />
          <PasswordField
            label="رمز جدید"
            value={newPw}
            onChange={setNewPw}
            placeholder="حداقل ۸ کاراکتر"
          />
          <PasswordField
            label="تکرار رمز جدید"
            value={confirmPw}
            onChange={setConfirmPw}
            placeholder="تکرار رمز جدید"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleChangePassword}
            disabled={pwSaving || !currentPw || !newPw || !confirmPw}
            style={{
              padding: '10px 28px', background: '#801A00',
              border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 700, color: 'white',
              cursor: pwSaving ? 'wait' : 'pointer',
              opacity: (!currentPw || !newPw || !confirmPw) ? 0.5 : 1,
              transition: 'opacity 150ms',
              fontFamily: 'YekanBakh, Tahoma, sans-serif',
            }}
          >
            {pwSaving ? 'در حال تغییر...' : 'تغییر رمز'}
          </button>
        </div>
      </div>

    </div>
  )
}
