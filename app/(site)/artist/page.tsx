'use client'

import { useState, useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, CheckCircle } from '@/components/ui/icons'
import PageHero from '@/components/ui/PageHero'

/* ─── Validation ─── */
const schema = z.object({
  fullName:  z.string().min(2, 'حداقل ۲ حرف'),
  phone:     z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست'),
  email:     z.string().email('ایمیل معتبر نیست'),
  website:   z.string().optional(),
  instagram: z.string().optional(),
  artField:  z.string().min(1, 'رشته هنری را انتخاب کنید'),
  artworks: z.array(z.object({ description: z.string() })).length(2),
  notes:    z.string().optional(),
})

type ArtistFormData = z.infer<typeof schema>

const artFields = [
  'نقاشی - طراحی',
  'عکاسی',
  'خطاطی - نقاشی خط',
  'چاپ دستی',
  'حجم',
  'هنرهای کاربردی',
]

/* ─── Input Component ─── */
function Field({
  label,
  error,
  children,
}: {
  label?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs text-neutral-500">{label}</span>}
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}

const inputClass =
  'w-full bg-white border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm text-[#171717] placeholder:text-[#B0B0B0] outline-none focus:border-[#801A00] transition-colors duration-200 font-[family-name:var(--font-yekan)]'

const textareaClass =
  'w-full bg-white border border-[#E5E5E5] rounded-lg px-4 py-3 text-[13px] text-[#171717] placeholder:text-[#B0B0B0] outline-none focus:border-[#801A00] transition-colors duration-200 resize-none font-[family-name:var(--font-yekan)]'

/* ─── Upload Zone ─── */
function UploadZone({
  accept,
  hint,
  onFile,
  fileName,
}: {
  accept: string
  hint: string
  onFile?: (f: File) => void
  fileName?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div>
      <div
        onClick={() => ref.current?.click()}
        className="border border-[#E5E5E5] rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:border-[#801A00] hover:bg-[#FAFAFA] p-10"
      >
        <Upload size={28} className="text-[#B0B0B0]" />
        <span className="text-[13px] text-[#717171]">
          {fileName ? fileName : 'Files +/↑'}
        </span>
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile?.(e.target.files[0])}
        />
      </div>
      <p className="text-[11px] text-[#B0B0B0] mt-2">{hint}</p>
    </div>
  )
}

/* ─── Artwork Upload ─── */
function ArtworkUploadZone({ fileName, onFile }: { fileName?: string; onFile: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div
      onClick={() => ref.current?.click()}
      className="border border-[#E5E5E5] rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 hover:border-[#801A00] hover:bg-[#FAFAFA]"
      style={{ height: '160px' }}
    >
      <span className="text-[13px] text-[#717171]">{fileName ? fileName : 'Files +/↑'}</span>
      <span className="text-[11px] text-[#B0B0B0]">Allowed types: PNG, JPG</span>
      <input
        ref={ref}
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </div>
  )
}

/* ─── Page ─── */
async function uploadFile(file: File, folder: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('folder', folder)
  const res = await fetch('/api/uploads', { method: 'POST', body: fd })
  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    throw new Error(j.error ?? 'خطا در آپلود فایل')
  }
  const { url } = await res.json()
  return url as string
}

export default function ArtistPage() {
  const [submitted, setSubmitted]           = useState(false)
  const [loading, setLoading]               = useState(false)
  const [portfolioFile, setPortfolioFile]   = useState<File | null>(null)
  const [portfolioName, setPortfolioName]   = useState<string>()
  const [portfolioError, setPortfolioError] = useState(false)
  const [artworkFiles, setArtworkFiles]   = useState<Record<number, File>>({})

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      artField: '',
      artworks: [{ description: '' }, { description: '' }],
    },
  })

  useFieldArray({ control, name: 'artworks' })

  const selectedField = watch('artField')

  const onSubmit = async (data: ArtistFormData) => {
    if (!portfolioFile) {
      setPortfolioError(true)
      return
    }
    setLoading(true)
    try {
      // آپلود پرتفولیو
      let portfolioUrl: string | undefined
      if (portfolioFile) {
        portfolioUrl = await uploadFile(portfolioFile, 'portfolios')
      }

      // آپلود نمونه کارها + توضیحات
      const artworkItems: { url: string; description: string }[] = []
      for (let i = 0; i < 2; i++) {
        const file = artworkFiles[i]
        const description = data.artworks[i]?.description ?? ''
        if (file || description) {
          const url = file ? await uploadFile(file, 'artworks') : ''
          artworkItems.push({ url, description })
        }
      }

      const res = await fetch('/api/artist-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, portfolioUrl, artworkItems }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error ?? 'خطای سرور')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطا در ارسال فرم'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  const hero = (
    <PageHero
      title="همکاری هنرمندان"
      subtitle="آثار خود را با خانه دی به اشتراک بگذارید"
    />
  )

  if (submitted) {
    return (
      <>
        {hero}
        <div className="flex items-center justify-center px-6 py-16">
          <div
            className="flex items-start gap-3 rounded-lg p-4 max-w-md w-full"
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}
          >
            <CheckCircle size={20} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
            <p className="text-[14px] text-[#15803D] leading-relaxed">
              درخواست شما با موفقیت ثبت شد. تیم خانه دی در اسرع وقت با شما تماس خواهد گرفت.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {hero}
      <div className="bg-white pb-16">
      <div className="mx-auto px-6" style={{ maxWidth: '680px', paddingTop: '48px' }}>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

          {/* ─── بخش ۱ — معرفی ─── */}
          <h1 className="text-right font-[900] text-[#171717] mb-1" style={{ fontSize: '22px' }}>
            هنرمند عزیز، سلام!
          </h1>
          <h2 className="text-right font-[700] text-[#171717] mb-2" style={{ fontSize: '18px' }}>
            ابتدا خودتان را معرفی کنید.
          </h2>
          <p className="text-right text-[#717171] mb-6" style={{ fontSize: '13px', lineHeight: '1.7' }}>
            اطلاعات فردی و هنری شما به صورت درپشت انجام مراحل بررسی موردنظر فرایند بررسی پروفایل شما را سریع‌تر خواهد کرد.
          </p>

          <div className="mb-0">
            <Field error={errors.fullName?.message}>
              <input {...register('fullName')} placeholder="نام و نام خانوادگی" className={inputClass} />
            </Field>
          </div>

          {/* ─── بخش ۲ — تماس ─── */}
          <h3
            className="text-right font-[800] text-[#171717]"
            style={{ fontSize: '16px', marginTop: '32px', marginBottom: '16px' }}
          >
            از چه طریقی با شما در ارتباط باشیم؟
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field error={errors.phone?.message}>
              <input {...register('phone')} placeholder="شماره تماس" className={inputClass} dir="rtl" />
            </Field>
            <Field error={errors.email?.message}>
              <input {...register('email')} placeholder="ایمیل" className={inputClass} dir="rtl" />
            </Field>
            <Field>
              <input {...register('website')} placeholder="وب سایت شما (اختیاری)" className={inputClass} dir="rtl" />
            </Field>
            <Field>
              <input {...register('instagram')} placeholder="اینستاگرام شما (اختیاری)" className={inputClass} dir="rtl" />
            </Field>
          </div>

          {/* ─── بخش ۳ — رشته هنری ─── */}
          <h3
            className="text-right font-[800] text-[#171717]"
            style={{ fontSize: '16px', marginTop: '32px', marginBottom: '16px' }}
          >
            در کدامیک از شاخه‌های زیر تمایل به همکاری دارید؟
          </h3>
          {errors.artField && (
            <p className="text-xs text-red-500 mb-2">{errors.artField.message}</p>
          )}
          <div className="flex flex-col gap-2">
            {artFields.map((field) => {
              const isSelected = selectedField === field
              return (
                <label
                  key={field}
                  className="flex items-center justify-between cursor-pointer rounded-lg transition-all duration-200"
                  style={{
                    border: `1px solid ${isSelected ? '#801A00' : '#E5E5E5'}`,
                    background: isSelected ? '#FDF5F5' : '#FFFFFF',
                    padding: '16px 20px',
                  }}
                >
                  <span className="text-right text-[#171717]" style={{ fontSize: '15px' }}>
                    {field}
                  </span>
                  <input
                    type="radio"
                    value={field}
                    checked={isSelected}
                    onChange={() => setValue('artField', field, { shouldValidate: true })}
                    className="w-5 h-5 cursor-pointer accent-[#801A00]"
                  />
                </label>
              )
            })}
          </div>

          {/* ─── بخش ۴ — پرتفولیو ─── */}
          <div className="mt-8">
            <h3 className="text-right font-[800] text-[#171717] mb-1" style={{ fontSize: '16px' }}>
              برای آشنایی کامل با شما، پرتفولیو خود را برایمان ارسال کنید.
            </h3>
            <p className="text-right text-[#717171] mb-4" style={{ fontSize: '12px' }}>
              فایل از ارسال توجه داشته باشید: پرتفولیو باید شامل اطلاعات کامل رزومه و همچنین بهترین کارهای شما باشد. فرمت فایل PDF است.
            </p>
            <UploadZone
              accept=".pdf"
              hint="Allowed types: application/pdf"
              fileName={portfolioName}
              onFile={(f) => { setPortfolioFile(f); setPortfolioName(f.name); setPortfolioError(false) }}
            />
            {portfolioError && (
              <p className="text-xs text-red-500 mt-2">آپلود پرتفولیو الزامی است</p>
            )}
          </div>

          {/* ─── بخش ۵ — نمونه کارها ─── */}
          <div className="mt-8">
            <h3 className="text-right font-[800] text-[#171717] mb-1" style={{ fontSize: '16px' }}>
              ۲ تا از بهترین کارهایتان و توضیحات کامل را وارد کنید. <span className="font-[400] text-[#A0A0A0]" style={{ fontSize: '13px' }}>(اختیاری)</span>
            </h3>
            <p className="text-right text-[#717171] mb-4" style={{ fontSize: '12px' }}>
              کارشناسان ما به دقت کارهای شما را بررسی می‌کنند. فرمت‌های قابل پشتیبانی: PNG، JPG
            </p>

            <div className="flex flex-col gap-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg p-4"
                  style={{ border: '1px solid #E5E5E5' }}
                >
                  {/* textarea — راست */}
                  <textarea
                    {...register(`artworks.${i}.description`)}
                    placeholder="توضیحات شامل تکنیک کار، سال خلق اثر، ابعاد کار و ..."
                    className={textareaClass}
                    style={{ height: '160px' }}
                  />
                  {/* upload — چپ */}
                  <ArtworkUploadZone
                    fileName={artworkFiles[i]?.name}
                    onFile={(f) => setArtworkFiles((prev) => ({ ...prev, [i]: f }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ─── بخش ۶ — توضیحات اضافه ─── */}
          <div className="mt-8">
            <h3 className="text-right font-[800] text-[#171717] mb-1" style={{ fontSize: '16px' }}>
              توضیحات <span className="font-[400] text-[#A0A0A0]" style={{ fontSize: '13px' }}>(اختیاری)</span>
            </h3>
            <p className="text-right text-[#717171] mb-4" style={{ fontSize: '12px' }}>
              هر توضیح یا اطلاعات اضافه‌ای که فکر می‌کنید به بررسی پروفایل شما کمک می‌کند.
            </p>
            <textarea
              {...register('notes')}
              placeholder="توضیحات خود را اینجا بنویسید..."
              className={textareaClass}
              style={{ height: '140px' }}
            />
          </div>

          {/* ─── بخش ۷ — دکمه ─── */}
          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="text-white font-[700] rounded-lg transition-colors duration-200 disabled:opacity-60"
              style={{
                width: '200px',
                background: loading ? '#555' : '#171717',
                padding: '16px 40px',
                fontSize: '16px',
                fontFamily: 'YekanBakh, Tahoma, sans-serif',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#2D2D2D' }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#171717' }}
            >
              {loading ? 'در حال ارسال...' : 'ثبت نام'}
            </button>
          </div>

        </form>
      </div>
      </div>
    </>
  )
}
