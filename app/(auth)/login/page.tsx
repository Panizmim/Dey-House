'use client'

import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const loginSchema = z.object({
  email:    z.string().email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/dashboard'

  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginForm) {
    setServerError('')
    const result = await signIn('credentials', {
      email:    data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setServerError('ایمیل یا رمز عبور اشتباه است')
      return
    }
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-card shadow-card p-8">
      <h1 className="text-xl font-bold text-neutral-900 mb-6 text-center">ورود به حساب کاربری</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">ایمیل</label>
          <input
            {...register('email')}
            type="email"
            placeholder="example@email.com"
            className="w-full px-4 py-2.5 rounded-btn border border-neutral-200 focus:outline-none focus:border-brand text-sm"
            dir="ltr"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">رمز عبور</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPass ? 'text' : 'password'}
              placeholder="رمز عبور"
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
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-btn px-4 py-2.5">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand hover:bg-brand-hover text-white font-medium py-2.5 rounded-btn transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'در حال ورود...' : 'ورود'}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600 mt-6">
        حساب ندارید؟{' '}
        <Link href="/register" className="text-brand hover:underline font-medium">
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
