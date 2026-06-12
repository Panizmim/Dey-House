'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { X } from '@/components/ui/icons'

const loginSchema = z.object({
  email:    z.string().email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
})

type LoginForm = z.infer<typeof loginSchema>

interface Props {
  open:    boolean
  onClose: () => void
}

export function LoginModal({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [showPass,    setShowPass]    = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  useEffect(() => {
    if (!open) { reset(); setServerError(''); setShowPass(false) }
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

  async function onSubmit(data: LoginForm) {
    setServerError('')
    const result = await signIn('credentials', {
      email:    data.email,
      password: data.password,
      redirect: false,
    })
    if (!result) { setServerError('خطا در ارتباط با سرور'); return }
    if (result.error) { setServerError('ایمیل یا رمز عبور اشتباه است'); return }
    if (result.ok) { onClose(); window.location.reload() }
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
        className="relative w-full bg-white rounded-2xl shadow-2xl"
        style={{ maxWidth: 400, padding: '36px 32px 32px' }}
      >
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          style={{ width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', color: '#717171' }}
          aria-label="بستن"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-center mb-6" style={{ color: '#171717' }}>
          ورود به حساب کاربری
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label className="block text-sm font-medium mb-1" style={{ color: '#404040' }}>رمز عبور</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="رمز عبور"
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

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <p className="text-red-600 text-sm">{serverError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60"
            style={{ background: '#801A00', fontSize: 15 }}
          >
            {isSubmitting ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: '#717171' }}>
          حساب ندارید؟{' '}
          <Link href="/register" onClick={onClose} className="font-medium hover:underline" style={{ color: '#801A00' }}>
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  )
}
