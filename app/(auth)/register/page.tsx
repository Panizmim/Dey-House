'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

export default function RegisterPage() {
  const router = useRouter()
  const [showPass, setShowPass]     = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading]       = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterForm) {
    setLoading(true)
    setServerError('')

    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:     data.name,
          email:    data.email,
          phone:    data.phone,
          password: data.password,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setServerError(result.error ?? 'خطا در ثبت‌نام')
        return
      }

      const signInResult = await signIn('credentials', {
        email:    data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        setServerError('ثبت‌نام موفق بود. لطفاً وارد شوید.')
        router.push('/login')
        return
      }

      router.push('/dashboard')
    } catch {
      setServerError('خطای شبکه. لطفاً دوباره تلاش کنید')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-card shadow-card p-8">
      <h1 className="text-xl font-bold text-neutral-900 mb-6 text-center">ایجاد حساب کاربری</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">نام و نام خانوادگی</label>
          <input
            {...register('name')}
            placeholder="نام کامل"
            className="w-full px-4 py-2.5 rounded-btn border border-neutral-200 focus:outline-none focus:border-brand text-sm"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">ایمیل</label>
          <input
            {...register('email')}
            type="email"
            placeholder="example@email.com"
            className="w-full px-4 py-2.5 rounded-btn border border-neutral-200 focus:outline-none focus:border-brand text-sm"
            dir="ltr"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">شماره موبایل</label>
          <input
            {...register('phone')}
            placeholder="09123456789"
            className="w-full px-4 py-2.5 rounded-btn border border-neutral-200 focus:outline-none focus:border-brand text-sm"
            dir="ltr"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">رمز عبور</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPass ? 'text' : 'password'}
              placeholder="حداقل ۸ کاراکتر"
              className="w-full px-4 py-2.5 rounded-btn border border-neutral-200 focus:outline-none focus:border-brand text-sm pl-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
            >
              {showPass ? 'پنهان' : 'نمایش'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">تکرار رمز عبور</label>
          <input
            {...register('confirmPassword')}
            type={showPass ? 'text' : 'password'}
            placeholder="رمز عبور را دوباره وارد کنید"
            className="w-full px-4 py-2.5 rounded-btn border border-neutral-200 focus:outline-none focus:border-brand text-sm"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-btn px-4 py-2.5">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand-hover text-white font-medium py-2.5 rounded-btn transition-colors disabled:opacity-60"
        >
          {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600 mt-6">
        حساب دارید؟{' '}
        <Link href="/login" className="text-brand hover:underline font-medium">
          وارد شوید
        </Link>
      </p>
    </div>
  )
}
