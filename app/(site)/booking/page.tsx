'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'

const USAGE_TYPES = [
  { value: 'THEATER',     label: 'تمرین تئاتر',    desc: 'رزرو آنلاین با پرداخت درگاه' },
  { value: 'WORKSHOP',    label: 'کارگاه و ورکشاپ', desc: 'هماهنگی با تیم خانه دی' },
  { value: 'FILMING',     label: 'فیلمبرداری',      desc: 'هماهنگی با تیم خانه دی' },
  { value: 'YOGA',        label: 'یوگا و ورزش',     desc: 'هماهنگی با تیم خانه دی' },
  { value: 'PHOTOGRAPHY', label: 'عکاسی',            desc: 'هماهنگی با تیم خانه دی' },
  { value: 'OTHER',       label: 'سایر',             desc: 'هماهنگی با تیم خانه دی' },
]

const DURATION_OPTIONS = [
  { value: 1,   label: '۱ ساعت' },
  { value: 2,   label: '۲ ساعت' },
  { value: 3,   label: '۳ ساعت' },
  { value: 4,   label: '۴ ساعت' },
  { value: 5,   label: '۵ ساعت' },
  { value: 6,   label: '۶ ساعت' },
]

const contactSchema = z.object({
  name:    z.string().min(2, 'نام معتبر نیست'),
  email:   z.string().email('ایمیل معتبر نیست'),
  phone:   z.string().regex(/^09[0-9]{9}$/, 'موبایل معتبر نیست'),
  message: z.string().optional(),
})
type ContactForm = z.infer<typeof contactSchema>

type Studio = { id: string; name: string; description: string | null; capacity: number; pricePerHour: number; imageUrl: string | null }
type Slot   = { time: string; available: boolean }

const STEPS = ['نوع کاربری', 'پلاتو', 'تاریخ', 'زمان', 'تأیید']

export default function BookingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [step,       setStep]       = useState(0)
  const [usageType,  setUsageType]  = useState('')
  const [studioId,   setStudioId]   = useState('')
  const [date,       setDate]       = useState('')
  const [startTime,  setStartTime]  = useState('')
  const [duration,   setDuration]   = useState(2)
  const [submitting, setSubmitting] = useState(false)
  const [contactDone, setContactDone] = useState(false)

  const isTheater = usageType === 'THEATER'

  const { data: studiosRaw } = useQuery({
    queryKey: ['studios'],
    queryFn:  () => fetch('/api/studios').then((r) => r.json()),
    enabled:  step >= 1,
  })
  const studios: Studio[] = Array.isArray(studiosRaw) ? studiosRaw : []

  const { data: slotsData, isLoading: slotsLoading } = useQuery<{ slots: Slot[] }>({
    queryKey: ['slots', studioId, date],
    queryFn:  () => fetch(`/api/bookings/slots?studioId=${studioId}&date=${date}`).then((r) => r.json()),
    enabled:  !!(studioId && date && step === 3),
  })

  const slots = slotsData?.slots ?? []
  const selectedStudio = studios.find((s) => s.id === studioId)

  function calcEndTime(start: string, hours: number): string {
    const [h, m] = start.split(':').map(Number)
    const totalMin = h * 60 + m + hours * 60
    const eh = Math.floor(totalMin / 60)
    const em = totalMin % 60
    return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`
  }

  const endTime    = startTime ? calcEndTime(startTime, duration) : ''
  const totalPrice = selectedStudio ? selectedStudio.pricePerHour * duration : 0

  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) })

  async function submitContact(data: ContactForm) {
    setSubmitting(true)
    await fetch('/api/contact-requests', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...data, usageType }),
    })
    setSubmitting(false)
    setContactDone(true)
  }

  async function submitBooking() {
    if (!session) { router.push(`/login?callbackUrl=/booking`); return }
    setSubmitting(true)

    const res = await fetch('/api/bookings', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ studioId, date, startTime, endTime, durationHours: duration, type: 'THEATER' }),
    })

    const json = await res.json()
    setSubmitting(false)

    if (!res.ok) { alert(json.error ?? 'خطا در ثبت رزرو'); return }
    if (json.paymentUrl) { window.location.href = json.paymentUrl }
  }

  if (!isTheater && step === 1 && usageType) {
    if (contactDone) {
      return (
        <>
          <PageHero title="رزرو پلاتو" subtitle="فضاهای حرفه‌ای خانه دی را رزرو کنید" />
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md px-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">درخواست ثبت شد</h2>
              <p className="text-neutral-600 text-base leading-relaxed">
                تیم خانه دی در اسرع وقت با شما تماس خواهد گرفت.
              </p>
            </div>
          </div>
        </>
      )
    }

    return (
      <>
        <PageHero title="رزرو پلاتو" subtitle="فضاهای حرفه‌ای خانه دی را رزرو کنید" />
        <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
          <div className="bg-white rounded-card shadow-card p-8 w-full max-w-md">
            <h2 className="text-lg font-bold text-neutral-900 mb-1">اطلاعات تماس</h2>
            <p className="text-neutral-500 text-sm mb-6">
              تیم خانه دی با شما تماس می‌گیرد و تاریخ و شرایط را هماهنگ می‌کند.
            </p>
            <form onSubmit={handleSubmit(submitContact)} className="space-y-4">
              {([
                { name: 'name',    label: 'نام و نام خانوادگی', placeholder: 'نام کامل', dir: 'rtl' },
                { name: 'email',   label: 'ایمیل',               placeholder: 'example@email.com', dir: 'ltr' },
                { name: 'phone',   label: 'موبایل',              placeholder: '09123456789', dir: 'ltr' },
              ] as const).map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{f.label}</label>
                  <input
                    {...register(f.name)}
                    placeholder={f.placeholder}
                    dir={f.dir}
                    className="w-full px-4 py-2.5 rounded-btn border border-neutral-200 focus:outline-none focus:border-brand text-sm"
                  />
                  {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]?.message}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">توضیحات (اختیاری)</label>
                <textarea
                  {...register('message')}
                  rows={3}
                  placeholder="جزئیات بیشتر درباره نیازتان..."
                  className="w-full px-4 py-2.5 rounded-btn border border-neutral-200 focus:outline-none focus:border-brand text-sm resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex-1 border border-neutral-200 text-neutral-700 font-medium py-2.5 rounded-btn hover:bg-neutral-50 transition-colors text-sm"
                >
                  بازگشت
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-brand hover:bg-brand-hover text-white font-medium py-2.5 rounded-btn transition-colors disabled:opacity-60 text-sm"
                >
                  {submitting ? 'در حال ارسال...' : 'ارسال درخواست'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    )
  }

  const canNext = [
    !!usageType,
    !!studioId,
    !!date,
    !!startTime,
    true,
  ][step]

  function goNext() {
    if (step === 0 && !isTheater) { setStep(1); return }
    setStep((s) => s + 1)
  }

  return (
    <>
      <PageHero title="رزرو پلاتو" subtitle="فضاهای حرفه‌ای خانه دی را رزرو کنید" />
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Stepper */}
        <div className="flex items-center gap-0 mb-10 justify-between">
          {(isTheater ? STEPS : ['نوع کاربری', 'اطلاعات تماس']).map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                  i < step  ? 'bg-brand text-white' :
                  i === step ? 'bg-brand text-white ring-4 ring-brand/20' :
                  'bg-neutral-100 text-neutral-400'
                )}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={cn(
                  'text-xs text-center whitespace-nowrap',
                  i === step ? 'text-brand font-medium' : 'text-neutral-400'
                )}>
                  {label}
                </span>
              </div>
              {i < (isTheater ? STEPS.length : 2) - 1 && (
                <div className={cn('h-px flex-1 mx-1 mt-[-12px]', i < step ? 'bg-brand' : 'bg-neutral-200')} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: نوع کاربری */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">نوع استفاده از پلاتو</h2>
            <p className="text-neutral-500 text-sm mb-6">برای چه منظوری پلاتو رزرو می‌کنید؟</p>
            <div className="grid grid-cols-2 gap-3">
              {USAGE_TYPES.map((u) => (
                <button
                  key={u.value}
                  onClick={() => setUsageType(u.value)}
                  className={cn(
                    'p-4 rounded-card border-2 text-right transition-all',
                    usageType === u.value
                      ? 'border-brand bg-brand-light'
                      : 'border-neutral-200 hover:border-neutral-300'
                  )}
                >
                  <p className="font-medium text-neutral-900 text-sm">{u.label}</p>
                  <p className="text-neutral-400 text-xs mt-1">{u.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: پلاتو (only theater flow) */}
        {step === 1 && isTheater && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">انتخاب پلاتو</h2>
            <p className="text-neutral-500 text-sm mb-6">یکی از پلاتوهای فعال را انتخاب کنید</p>
            {studios.length === 0 ? (
              <p className="text-neutral-400 text-center py-8">در حال بارگذاری...</p>
            ) : (
              <div className="space-y-3">
                {studios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStudioId(s.id)}
                    className={cn(
                      'w-full p-4 rounded-card border-2 text-right transition-all flex items-center gap-4',
                      studioId === s.id
                        ? 'border-brand bg-brand-light'
                        : 'border-neutral-200 hover:border-neutral-300'
                    )}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">{s.name}</p>
                      {s.description && <p className="text-neutral-500 text-sm mt-1">{s.description}</p>}
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs text-neutral-400">ظرفیت: {s.capacity} نفر</span>
                        <span className="text-xs font-medium text-brand">
                          {s.pricePerHour.toLocaleString('fa-IR')} <span className="font-bold">تومان</span>/ساعت
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: تاریخ */}
        {step === 2 && isTheater && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">انتخاب تاریخ</h2>
            <p className="text-neutral-500 text-sm mb-6">تاریخ رزرو را انتخاب کنید</p>
            <div className="bg-white rounded-card border border-neutral-200 p-6">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-btn border border-neutral-200 focus:outline-none focus:border-brand text-neutral-900 text-center text-lg"
              />
              {date && (
                <p className="text-center text-sm text-neutral-500 mt-3">
                  تاریخ انتخابی: {new Date(date).toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: زمان */}
        {step === 3 && isTheater && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">انتخاب زمان</h2>
            <p className="text-neutral-500 text-sm mb-6">ساعت شروع و مدت رزرو را انتخاب کنید</p>

            {slotsLoading ? (
              <p className="text-center text-neutral-400 py-8">در حال بارگذاری زمان‌های آزاد...</p>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => slot.available && setStartTime(slot.time)}
                      className={cn(
                        'py-2 rounded-btn text-sm font-medium transition-all border-2',
                        !slot.available
                          ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed border-transparent'
                          : startTime === slot.time
                          ? 'bg-brand text-white border-brand'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-brand'
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>

                {startTime && (
                  <div>
                    <p className="text-sm font-medium text-neutral-700 mb-2">مدت زمان رزرو</p>
                    <div className="flex gap-2 flex-wrap">
                      {DURATION_OPTIONS.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => setDuration(d.value)}
                          className={cn(
                            'px-4 py-2 rounded-btn text-sm border-2 transition-all',
                            duration === d.value
                              ? 'bg-brand text-white border-brand'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:border-brand'
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                    {endTime && (
                      <p className="text-sm text-neutral-500 mt-3">
                        از ساعت <strong>{startTime}</strong> تا <strong>{endTime}</strong>
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 4: تأیید */}
        {step === 4 && isTheater && (
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-6">تأیید و پرداخت</h2>
            <div className="bg-white rounded-card border border-neutral-200 divide-y divide-neutral-100">
              {[
                { label: 'پلاتو',      value: selectedStudio?.name ?? '' },
                { label: 'تاریخ',      value: new Date(date).toLocaleDateString('fa-IR') },
                { label: 'ساعت شروع',  value: startTime },
                { label: 'ساعت پایان', value: endTime },
                { label: 'مدت',        value: `${duration} ساعت` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center px-5 py-3">
                  <span className="text-neutral-500 text-sm">{row.label}</span>
                  <span className="text-neutral-900 font-medium text-sm">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-5 py-4 bg-brand-light rounded-b-card">
                <span className="font-bold text-neutral-900">مبلغ قابل پرداخت</span>
                <span className="font-heavy text-brand text-lg">{totalPrice.toLocaleString('fa-IR')} <span className="font-bold">تومان</span></span>
              </div>
            </div>

            {!session && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-btn px-4 py-3">
                <p className="text-amber-700 text-sm">برای تکمیل رزرو باید وارد حساب کاربری شوید.</p>
              </div>
            )}
          </div>
        )}

        {/* دکمه‌های ناوبری */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 border border-neutral-200 text-neutral-700 font-medium py-3 rounded-btn hover:bg-neutral-50 transition-colors"
            >
              بازگشت
            </button>
          )}

          {step < (isTheater ? 4 : 1) ? (
            <button
              disabled={!canNext}
              onClick={goNext}
              className="flex-1 bg-brand hover:bg-brand-hover text-white font-medium py-3 rounded-btn transition-colors disabled:opacity-40"
            >
              مرحله بعد
            </button>
          ) : isTheater ? (
            <button
              disabled={submitting}
              onClick={submitBooking}
              className="flex-1 bg-brand hover:bg-brand-hover text-white font-medium py-3 rounded-btn transition-colors disabled:opacity-60"
            >
              {submitting ? 'در حال انتقال...' : 'پرداخت و تکمیل رزرو'}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
