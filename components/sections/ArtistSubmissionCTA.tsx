import Image from 'next/image'
import Link from 'next/link'

export function ArtistSubmissionCTA() {
  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="grid items-center gap-16 grid-cols-1 md:grid-cols-2"
        >

          {/* ستون راست — متن */}
          <div>
            <h2
              className="text-[#171717] font-black mb-8"
              style={{
                fontSize:      'clamp(24px, 3vw, 36px)',
                letterSpacing: '-0.02em',
                lineHeight:    1.2,
              }}
            >
              خانه دی، فرصتی برای درخشش هنرمند
            </h2>

            <p
              className="text-[#404040] mb-10"
              style={{
                fontSize:   'clamp(14px, 1.5vw, 17px)',
                fontWeight: 400,
                lineHeight: 2.0,
              }}
            >
              در خانه دی، جایی برای رشد و دیده‌شدن هنر شما ساخته‌ایم. به‌عنوان یک بازار مستقل هنر، امکان فروش مستقیم آثار خود را بدون واسطه تجربه کنید. علاوه بر آن خانه دی با برگزاری ایونت‌ها و نمایشگاه‌های متنوع، فرصت بیشتری برای دیده‌شدن، شبکه‌سازی و ارتباط با خریداران در اختیار شما خواهد گذاشت. فرقی ندارد در چه سبکی فعالیت می‌کنید، اینجا جای هنر شماست! همین حالا به جمع هنرمندان ما بپیوندید.
            </p>

            <Link
              href="/artist"
              className="inline-block px-8 py-4 text-white font-bold
                         transition-all duration-200 hover:opacity-90
                         hover:-translate-y-px"
              style={{
                background:   '#8B1E1E',
                borderRadius: '8px',
                fontSize:     '15px',
              }}
            >
              همکاری هنری با خانه دی
            </Link>
          </div>

          {/* ستون چپ — عکس (در موبایل اول نمایش داده می‌شود) */}
          <div
            className="relative overflow-hidden order-first md:order-last"
            style={{ borderRadius: '12px', aspectRatio: '4/3' }}
          >
            <Image
              src="/images/artist-cta.jpg"
              alt="همکاری هنری با خانه دی"
              fill
              className="object-cover"
            />
            {/* fallback gradient */}
            <div
              className="absolute inset-0 -z-10"
              style={{ background: 'linear-gradient(135deg, #f5e6d3 0%, #e8c9a0 100%)' }}
            />
          </div>

        </div>
      </div>
    </section>
  )
}
