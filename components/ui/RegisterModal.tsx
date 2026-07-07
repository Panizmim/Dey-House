'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { X } from '@/components/ui/icons'

const registerSchema = z.object({
  name:            z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  email:           z.string().email('ایمیل معتبر نیست'),
  phone:           z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست'),
  password:        z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'رمز عبور و تکرار آن باید یکسان باشند',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

interface Props {
  open:            boolean
  onClose:         () => void
  onSwitchToLogin: () => void
  onSuccess?:      () => void
}

export function RegisterModal({ open, onClose, onSwitchToLogin, onSuccess }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [showPass,    setShowPass]    = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading,     setLoading]     = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  useEffect(() => {
    if (!open) { reset(); setServerError(''); setShowPass(false); setLoading(false) }
  }, [open, reset])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  async function onSubmit(data: RegisterForm) {
    setLoading(true)
    setServerError('')
    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: data.name, email: data.email, phone: data.phone, password: data.password }),
      })
      const result = await res.json()
      if (!res.ok) { setServerError(result.error ?? 'خطا در ثبت‌نام'); return }

      const signInResult = await signIn('credentials', { email: data.email, password: data.password, redirect: false })
      if (signInResult?.error) { onSwitchToLogin(); return }
      onClose()
      if (onSuccess) onSuccess()
      else window.location.href = '/dashboard'
    } catch {
      setServerError('خطای شبکه. لطفاً دوباره تلاش کنید')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="relative w-full bg-white rounded-2xl shadow-2xl overflow-y-auto"
        style={{ maxWidth: 420, padding: '36px 32px 32px', maxHeight: '90vh' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', color: '#717171' }}
          aria-label="بستن"
        >
          <X size={18} />
        </button>

        <div className="flex justify-center mb-5">
          <Image
            src="/images/logo.primary color.png"
            alt="خانه دی"
            width={72}
            height={72}
            className="object-contain"
          />
        </div>

        <h2 className="text-xl font-bold text-center mb-6" style={{ color: '#171717' }}>
          ایجاد حساب کاربری
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#404040' }}>نام و نام خانوادگی</label>
            <input
              {...register('name')}
              placeholder="نام کامل"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-[#801A00] transition-colors"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#404040' }}>ایمیل</label>
            <input
              {...register('email')}
              type="email"
              placeholder="example@email.com"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-[#801A00] transition-colors"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#404040' }}>شماره موبایل</label>
            <input
              {...register('phone')}
              placeholder="09123456789"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-[#801A00] transition-colors"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#404040' }}>رمز عبور</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="حداقل ۸ کاراکتر"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-[#801A00] transition-colors pl-16"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: '#A0A0A0', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPass ? 'پنهان' : 'نمایش'}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#404040' }}>تکرار رمز عبور</label>
            <input
              {...register('confirmPassword')}
              type={showPass ? 'text' : 'password'}
              placeholder="رمز عبور را دوباره وارد کنید"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm outline-none focus:border-[#801A00] transition-colors"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <p className="text-red-600 text-sm">{serverError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60"
            style={{ background: '#801A00', fontSize: 15 }}
          >
            {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: '#717171' }}>
          حساب دارید؟{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-medium hover:underline"
            style={{ color: '#801A00', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'YekanBakh, Tahoma, sans-serif' }}
          >
            وارد شوید
          </button>
        </p>
      </div>
    </div>
  )
}
